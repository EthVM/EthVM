resource "kubernetes_config_map" "mongodb_replicaset_configmap_init" {
  metadata {
    name = "mongodb-init"

    labels {
      app = "mongodb"
    }
  }

  data {
    on_start_sh = "${file("${path.module}/replicaset-init.sh")}"
  }
}

resource "kubernetes_config_map" "mongodb_replicaset_configmap_mongodb" {
  metadata {
    name = "mongodb"

    labels {
      app = "mongodb"
    }
  }

  data {
    mongodb_conf = ""
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
          name  = "copy-config"
          image = "busybox"

          command = ["sh"]

          args = [
            "-c",
            "set -ex && cp /configdb-readonly/mongod.conf /data/configdb/mongod.conf",
          ]

          volume_mount {
            name       = "mongodb-workdir"
            mount_path = "/work-dir"
          }

          volume_mount {
            name       = "mongodb-config"
            mount_path = "/configdb-readonly"
          }
        }

        init_container {
          name              = "install"
          image             = "k8s.gcr.io/mongodb-install:0.6"
          image_pull_policy = "IfNotPresent"

          args = ["--work-dir=/work-dir"]

          volume_mount {
            name       = "mongodb-workdir"
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
            "\"-service=mongodb\"",
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
            name       = "mongodb-workdir"
            mount_path = "/work-dir"
          }

          volume_mount {
            name       = "init"
            mount_path = "/init"
          }

          volume_mount {
            name       = "mongodb-config"
            mount_path = "/data/configdb"
          }

          volume_mount {
            name       = "mongodb-data"
            mount_path = "/data/db"
          }
        }

        container {
          name              = "mongodb"
          image             = "mongo:${var.mongodb_version}"
          image_pull_policy = "IfNotPresent"

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

          command = ["mongod"]

          args = [
            "--config=/data/configdb/mongod.conf",
            "--dbpath=/data/db",
            "--replSet=rs0",
            "--port=27017",
            "--bind_ip=0.0.0.0",
          ]
        }

        volume {
          name = "mongodb-config"

          config_map {
            name = "mongodb"
          }
        }

        volume {
          name = "init"

          config_map {
            name         = "mongodb-init"
            default_mode = 0755
          }
        }

        volume {
          name      = "mongodb-workdir"
          empty_dir = []
        }
      }
    }

    volume_claim_templates {
      metadata {
        name = "mongodb-data"
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
