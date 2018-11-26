data "template_file" "ethereumj_conf" {
  template = "${file("${path.module}/${var.ethereumj_conf}")}"

  vars {
    kafka_bootstrap_servers = "${var.ethereumj_kafka_bootstrap_servers}"
    kafka_registry_url      = "${var.ethereumj_kafka_registry_url}"
  }
}

resource "kubernetes_config_map" "ethereumj_config_map" {
  metadata {
    name      = "ethereumj-config"
    namespace = "${var.namespace}"
  }

  data {
    "ethereumj.conf" = "${data.template_file.ethereumj_conf.rendered}"
  }
}

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

    replicas     = 1
    service_name = "ethereumj"

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

          args = [
            "-Dethereumj.conf.res=${var.ethereumj_conf} -PmainClassName='${var.ethereumj_mainclass}' -PjvmArgs='-XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -XX:+UseG1GC'",
          ]

          resources {
            requests {
              memory = "2Gi"
            }

            limits {
              memory = "4Gi"
            }
          }

          port {
            name           = "peer"
            container_port = 30303
          }

          volume_mount {
            name       = "config"
            mount_path = "/ethereumj/config"
          }

          volume_mount {
            name       = "data"
            mount_path = "/ethereumj/data"
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
        }

        volume {
          name = "config"

          config_map {
            name = "ethereumj-config"
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
