resource "kubernetes_config_map" "mongodb_replicaset_configmap_init" {
  metadata {
    name = "mongodb-config-init"

    labels {
      app = "mongodb"
    }
  }

  data {
    "on-start.sh" = "${file("${path.module}/replicaset-init.sh")}"
  }
}

resource "kubernetes_config_map" "mongodb_replicaset_configmap_mongodb" {
  metadata {
    name = "mongodb-config"

    labels {
      app = "mongodb"
    }
  }

  data {
    "mongod.conf" = "${file("${path.module}/mongod.conf")}"
  }
}

resource "kubernetes_service" "mongodb_service" {
  metadata {
    name = "mongodb"

    annotations {
      "service.alpha.kubernetes.io/tolerate-unready-endpoints" = "true"
    }

    labels {
      app = "mongodb"
    }
  }

  spec {
    selector {
      app = "mongodb"
    }

    type       = "ClusterIP"
    cluster_ip = "None"

    port {
      name = "mongodb"
      port = 27017
    }
  }
}

resource "kubernetes_stateful_set" "mongodb_stateful_set" {
  metadata {
    name = "mongodb"

    labels {
      app = "mongodb"
    }
  }

  spec {
    selector {
      app = "mongodb"
    }

    service_name = "mongodb"
    replicas     = "${var.mongodb_nodes}"

    template {
      metadata {
        labels {
          app = "mongodb"
        }
      }

      spec {
        security_context {
          fs_group        = 999
          run_as_user     = 999
          run_as_non_root = "true"
        }

        termination_grace_period_seconds = 30

        init_container {
          name              = "copy-config"
          image             = "busybox"
          image_pull_policy = "IfNotPresent"

          command = ["sh"]

          args = [
            "-c",
            "set -ex && cp /configdb-readonly/mongod.conf /data/configdb/mongod.conf",
          ]

          volume_mount {
            name       = "workdir"
            mount_path = "/work-dir"
          }

          volume_mount {
            name       = "config"
            mount_path = "/configdb-readonly"
          }

          volume_mount {
            name       = "configdir"
            mount_path = "/data/configdb"
          }
        }

        init_container {
          name              = "install"
          image             = "k8s.gcr.io/mongodb-install:0.6"
          image_pull_policy = "IfNotPresent"

          args = ["--work-dir=/work-dir"]

          volume_mount {
            name       = "workdir"
            mount_path = "/work-dir"
          }
        }

        init_container {
          name              = "bootstrap"
          image             = "mongo:${var.mongodb_version}"
          image_pull_policy = "IfNotPresent"

          command = ["/work-dir/peer-finder"]

          args = [
            "-on-start=/init/on-start.sh",
            "-service=mongodb",
          ]

          env {
            name = "POD_NAMESPACE"

            value_from {
              field_ref {
                api_version = "v1"
                field_path  = "metadata.namespace"
              }
            }
          }

          env {
            name  = "REPLICA_SET"
            value = "rs0"
          }

          volume_mount {
            name       = "workdir"
            mount_path = "/work-dir"
          }

          volume_mount {
            name       = "init"
            mount_path = "/init"
          }

          volume_mount {
            name       = "config"
            mount_path = "/data/configdb"
          }

          volume_mount {
            name       = "data"
            mount_path = "/data/db"
          }
        }

        container {
          name              = "mongodb"
          image             = "mongo:${var.mongodb_version}"
          image_pull_policy = "IfNotPresent"

          command = ["mongod"]

          args = [
            "--config=/data/configdb/mongod.conf",
            "--dbpath=/data/db",
            "--replSet=rs0",
            "--port=27017",
            "--bind_ip=0.0.0.0",
          ]

          port {
            name           = "mongodb"
            container_port = 27017
          }

          liveness_probe {
            initial_delay_seconds = 60
            timeout_seconds       = 5
            failure_threshold     = 3
            period_seconds        = 10
            success_threshold     = 1

            exec {
              command = [
                "mongo",
                "--eval",
                "\"db.adminCommand('ping')\"",
              ]
            }
          }

          readiness_probe {
            initial_delay_seconds = 60
            timeout_seconds       = 1
            failure_threshold     = 3
            period_seconds        = 10
            success_threshold     = 1

            exec {
              command = [
                "mongo",
                "--eval",
                "\"db.adminCommand('ping')\"",
              ]
            }
          }

          volume_mount {
            name       = "data"
            mount_path = "/data/db"
          }

          volume_mount {
            name       = "config"
            mount_path = "/data/configdb"
          }

          volume_mount {
            name       = "workdir"
            mount_path = "/work-dir"
          }
        }

        volume {
          name = "config"

          config_map {
            name = "mongodb-config"
          }
        }

        volume {
          name = "init"

          config_map {
            name         = "mongodb-config-init"
            default_mode = 0755
          }
        }

        volume {
          name      = "workdir"
          empty_dir = []
        }

        volume {
          name      = "configdir"
          empty_dir = []
        }

        affinity {
          pod_anti_affinity {
            required_during_scheduling_ignored_during_execution {
              topology_key = "kubernetes.io/hostname"
              label_selector {
                match_expressions {
                  key      = "app"
                  operator = "In"
                  values   = ["kafka", "zookeeper"]
                }
              }
            }
          }
        }
      }
    }

    volume_claim_templates {
      metadata {
        name = "data"
      }

      spec {
        storage_class_name = "${var.mongodb_storage_type}"
        access_modes       = ["ReadWriteOnce"]

        resources {
          requests {
            storage = "${var.mongodb_storage_size}"
          }
        }
      }
    }
  }
}
