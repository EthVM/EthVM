resource "kubernetes_config_map" "mongodb_replicaset_configmap_init" {
  metadata {
    name = "mongodb-replicaset-init"

    labels {
      app = "mongodb-replicaset"
    }
  }

  data {
    on_start_sh = "${file("${path.module}/replicaset-init.sh")}"
  }
}

resource "kubernetes_config_map" "mongodb_replicaset_configmap_mongodb" {
  metadata {
    name = "mongodb-replicaset-mongodb"

    labels {
      app = "mongodb-replicaset"
    }
  }

  data {
    mongodb_conf = ""
  }
}

resource "kubernetes_config_map" "mongodb_replicaset_configmap_tests" {
  metadata {
    name = "mongodb-replicaset-tests"

    labels {
      app = "mongodb-replicaset"
    }
  }

  data {
    mongodb_up_test = "${file("${path.module}/mongodb-test.sh")}"
  }
}

resource "kubernetes_service" "mongodb_service" {
  metadata {
    name = "mongodb-replicaset"

    annotations {
      "service.alpha.kubernetes.io/tolerate-unready-endpoints" = "true"
    }

    labels {
      app = "mongodb-replicaset"
    }
  }

  spec {
    selector {
      app = "mongodb-replicaset"
    }

    type       = "ClusterIP"
    cluster_ip = "None"

    port {
      name = "mongodb"
      port = 27017
    }
  }
}

resource "kubernetes_pod" "mongodb_pod" {
  metadata {
    name = "mongodb-replicaset-test"

    labels {
      app = "mongodb-replicaset"
    }
  }

  spec {
    restart_policy = "Never"

    init_container {
      name  = "test-framework"
      image = "dduportal/bats:0.4.0"

      command = [
        "bash",
        "-c",
        "set -ex && cp -R /usr/local/libexec/ /tools/bats/",
      ]

      volume_mount {
        name       = "tools"
        mount_path = "/tools"
      }
    }

    container {
      name  = "mongo"
      image = "mongo:4.1"

      env {
        name  = "FULL_NAME"
        value = "mongodb-replicaset"
      }

      env {
        name  = "REPLICAS"
        value = "3"
      }

      volume_mount {
        name       = "tools"
        mount_path = "/tools"
      }

      volume_mount {
        name       = "tests"
        mount_path = "/tests"
      }
    }

    volume {
      name      = "tools"
      empty_dir = []
    }

    volume {
      name = "tests"

      config_map {
        name = "mongodb-replicaset-tests"
      }
    }
  }
}

resource "kubernetes_stateful_set" "mongodb_stateful_set" {
  metadata {
    name = "mongodb-replicaset"

    labels {
      app = "mongodb-replicaset"
    }
  }

  spec {
    selector {
      match_labels = "mongodb-replicaset"
    }

    service_name = "mongodb-replicaset"
    replicas     = 3

    template {
      metadata {
        labels {
          app = "mongodb-replicaset"
        }
      }

      spec {
        security_context {
          fs_group        = 999
          run_as_non_root = "true"
          run_as_user     = 999
        }

        termination_grace_period_seconds = 30

        init_container {
          name  = "copy-config"
          image = "busybox"

          command = ["sh"]

          args = [
            "-c",
            "set -e && set -x && cp /configdb-readonly/mongod.conf /data/configdb/mongod.conf",
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
          image             = "mongo:4.1"
          image_pull_policy = "IfNotPresent"

          command = ["/work-dir/peer-finder"]

          args = [
            "-on-start=/init/on-start.sh",
            "\"-service=mongodb-replicaset\"",
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
            name       = "configdir"
            mount_path = "/data/configdb"
          }

          volume_mount {
            name       = "datadir"
            mount_path = "/data/db"
          }
        }

        container {
          name              = "mongodb-replicaset"
          image             = "mongo:4.1"
          image_pull_policy = "IfNotPresent"

          port {
            name           = "mongodb"
            container_port = 27017
          }

          liveness_probe {
            initial_delay_seconds = 30
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
            initial_delay_seconds = 5
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
          name = "config"

          config_map {
            name = "mongodb-replicaset-mongodb"
          }
        }

        volume {
          name = "init"

          config_map {
            name         = "mongodb-replicaset-init"
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
      }
    }

    volume_claim_templates {
      metadata {
        name = "datadir"
      }

      spec {
        access_modes = ["ReadWriteOnce"]

        resources {
          requests {
            storage = "10Gi"
          }
        }
      }
    }
  }
}
