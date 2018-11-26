resource "kubernetes_service" "ethereumj_service" {
  metadata {
    name      = "ethereumj"
    namespace = "${var.namespace}"

    labels {
      app = "ethereumj"
    }
  }

  spec {
    selector {
      app = "ethereumj"
    }

    port {
      name        = "rpc"
      port        = 8545
      target_port = 8545
    }

    port {
      name        = "peer"
      protocol    = "UDP"
      port        = 30303
      target_port = 30303
    }
  }
}

resource "kubernetes_stateful_set" "ethereumj_stateful_set" {
  metadata {
    name      = "ethereumj"
    namespace = "${var.namespace}"

    labels {
      app = "ethereumj"
    }
  }

  spec {
    selector {
      app = "ethereumj"
    }

    replicas = 1

    template {
      metadata {
        labels {
          app = "ethereumj"
        }
      }

      spec {
        container {
          name              = "ethereumj-node"
          image             = "enkryptio/etherumj:${var.ethereumj_version}"
          image_pull_policy = "IfNotPresent"

          resources {
            requests {
              memory = "7Gi"
            }

            limits {
              memory = "8Gi"
            }
          }

          port {
            name           = "rpc"
            container_port = 8545
          }

          port {
            name           = "peer"
            container_port = 30303
          }

          volume_mount {
            name       = "data"
            mount_path = "/opt/ethereumj/data"
          }

          liveness_probe {
            initial_delay_seconds = 60
            timeout_seconds       = 5

            tcp_socket {
              port = 30303
            }
          }

          readiness_probe {
            initial_delay_seconds = 60
            period_seconds        = 10
            timeout_seconds       = 5
            success_threshold     = 1
            failure_threshold     = 3

            tcp_socket {
              port = 30303
            }
          }

          env {
            name  = "JVM_OPTS"
            value = "-Xms6g -Xmx6g -XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -XX:+UseG1GC"
          }
        }
      }
    }

    volume_claim_templates {
      metadata {
        name = "data"
      }

      spec {
        storage_class_name = "${var.ethereumj_storage_type}"
        access_modes       = ["ReadWriteOnce"]

        resources {
          requests {
            storage = "${var.ethereumj_storage_size}"
          }
        }
      }
    }
  }
}
