resource "kubernetes_service" "zookeeper_service_headless" {
  metadata {
    name = "zookeeper-headless"

    labels {
      app = "zookeeper"
    }
  }

  spec {
    selector {
      app = "zookeeper"
    }

    cluster_ip = "None"

    port {
      name     = "client"
      port     = 2181
      protocol = "TCP"
    }

    port {
      name     = "election"
      port     = 3888
      protocol = "TCP"
    }

    port {
      name     = "server"
      port     = 2888
      protocol = "TCP"
    }
  }
}

resource "kubernetes_service" "zookeeper_service" {
  metadata {
    name = "zookeeper"

    labels {
      app = "zookeeper"
    }
  }

  spec {
    selector {
      app = "zookeeper"
    }

    type = "ClusterIP"

    port {
      name        = "client"
      protocol    = "TCP"
      port        = 2181
      target_port = 2181
    }
  }
}

resource "kubernetes_stateful_set" "zookeeper_stateful_set" {
  metadata {
    name = "zookeeper"

    labels {
      app = "zookeeper"
    }
  }

  spec {
    selector {
      app = "zookeeper"
    }

    service_name = "zookeeper-headless"
    replicas     = "${var.zookeeper_nodes}"

    pod_management_policy = "Parallel"

    update_strategy {
      type = "OnDelete"
    }

    template {
      metadata {
        labels {
          app = "zookeeper"
        }
      }

      spec {
        termination_grace_period_seconds = 1800

        security_context {
          fs_group    = 1000
          run_as_user = 1000
        }

        container {
          name              = "zookeeper"
          image             = "enkryptio/zookeeper:${var.zookeeper_version}"
          image_pull_policy = "Always"

          command = [
            "/bin/bash",
            "-xec",
            "zkGenConfig.sh && exec exec zkServer.sh start-foreground",
          ]

          port {
            name           = "client"
            container_port = 2181
            protocol       = "TCP"
          }

          port {
            name           = "election"
            container_port = 3888
            protocol       = "TCP"
          }

          port {
            name           = "server"
            container_port = 2888
            protocol       = "TCP"
          }

          liveness_probe {
            initial_delay_seconds = 20

            exec {
              command = ["zkOk.sh"]
            }
          }

          readiness_probe {
            initial_delay_seconds = 20

            exec {
              command = ["zkOk.sh"]
            }
          }

          env {
            name  = "ZK_REPLICAS"
            value = "${var.zookeeper_nodes}"
          }

          env {
            name  = "JMXDISABLE"
            value = "true"
          }

          env {
            name  = "ZK_CLIENT_PORT"
            value = "2181"
          }

          env {
            name  = "ZK_ELECTION_PORT"
            value = "3888"
          }

          env {
            name  = "ZK_HEAP_SIZE"
            value = "2G"
          }

          env {
            name  = "ZK_INIT_LIMIT"
            value = "5"
          }

          env {
            name  = "ZK_LOG_LEVEL"
            value = "INFO"
          }

          env {
            name  = "ZK_MAX_CLIENT_CNXNS"
            value = "60"
          }

          env {
            name  = "ZK_MAX_SESSION_TIMEOUT"
            value = "40000"
          }

          env {
            name  = "ZK_MIN_SESSION_TIMEOUT"
            value = "4000"
          }

          env {
            name  = "ZK_PURGE_INTERVAL"
            value = "0"
          }

          env {
            name  = "ZK_SERVER_PORT"
            value = "2888"
          }

          env {
            name  = "ZK_SNAP_RETAIN_COUNT"
            value = "3"
          }

          env {
            name  = "ZK_SYNC_LIMIT"
            value = "10"
          }

          env {
            name  = "ZK_TICK_TIME"
            value = "2000"
          }

          volume_mount {
            name       = "data"
            mount_path = "/var/lib/zookeeper"
          }
        }

        affinity {
          pod_anti_affinity {
            required_during_scheduling_ignored_during_execution {
              topology_key = "kubernetes.io/hostname"

              label_selector {
                match_expressions {
                  key      = "app"
                  operator = "In"
                  values   = ["zookeeper"]
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
        storage_class_name = "${var.zookeeper_storage_type}"
        access_modes       = ["ReadWriteOnce"]

        resources {
          requests {
            storage = "${var.zookeeper_storage_size}"
          }
        }
      }
    }
  }
}
