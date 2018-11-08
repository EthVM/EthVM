resource "kubernetes_service" "kafka_service" {
  metadata {
    name = "kafka"

    labels {
      app = "kafka"
    }
  }

  spec {
    selector {
      app = "kafka"
    }

    port {
      name        = "broker"
      port        = 9092
      target_port = 9092
    }
  }
}

resource "kubernetes_service" "kafka_service_headless" {
  metadata {
    name = "kafka-headless"

    labels {
      app = "kafka"
    }

    annotations {
      "service.alpha.kubernetes.io/tolerate-unready-endpoints" = "true"
    }
  }

  spec {
    selector {
      app = "kafka"
    }

    port {
      name = "broker"
      port = 9092
    }

    cluster_ip = "None"
  }
}

resource "kubernetes_stateful_set" "kafka_stateful_set" {
  metadata {
    name = "kafka"

    labels {
      app = "kafka"
    }
  }

  spec {
    selector {
      app = "kafka"
    }

    service_name          = "kafka-headless"
    pod_management_policy = "OrderedReady"
    replicas              = 3

    update_strategy {
      type = "OnDelete"
    }

    template {
      metadata {
        labels {
          app = "kafka"
        }
      }

      spec {
        container {
          name              = "kafka-broker"
          image             = "confluentinc/cp-kafka:5.0.0-2"
          image_pull_policy = "IfNotPresent"

          liveness_probe {
            initial_delay_seconds = 30
            timeout_seconds       = 5

            exec {
              command = [
                "sh",
                "-ec",
                "/usr/bin/jps | /bin/grep -q SupportedKafka",
              ]
            }
          }

          readiness_probe {
            initial_delay_seconds = 30
            period_seconds        = 10
            timeout_seconds       = 5
            success_threshold     = 1
            failure_threshold     = 3

            tcp_socket {
              port = 9092
            }
          }

          port {
            name           = "kafka"
            container_port = 9092
          }

          env {
            name = "POD_IP"

            value_from {
              field_ref {
                field_path = "status.podIP"
              }
            }
          }

          env {
            name  = "KAFKA_HEAP_OPTS"
            value = "-Xmx1G -Xms1G"
          }

          env {
            name  = "KAFKA_ZOOKEEPER_CONNECT"
            value = "zookeeper:2181"
          }

          env {
            name  = "KAFKA_LOG_DIRS"
            value = "/opt/kafka/data/logs"
          }

          env {
            name  = "KAFKA_CONFLUENT_SUPPORT_METRICS_ENABL"
            value = "false"
          }

          env {
            name  = "KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR"
            value = "3"
          }

          env {
            name  = "KAFKA_JMX_PORT"
            value = "555"
          }

          command = ["${file("${path.module}/command.sh")}"]

          volume_mount {
            name       = "data"
            mount_path = "/opt/kafka/data"
          }
        }

        affinity {
          pod_affinity {
            preferred_during_scheduling_ignored_during_execution {
              pod_affinity_term {
                label_selector {
                  match_expressions {
                    key      = "app"
                    operator = "In"
                    values   = ["zookeeper"]
                  }
                }

                topology_key = "kubernetes.io/hostname"
              }

              weight = 50
            }
          }

          pod_anti_affinity {
            required_during_scheduling_ignored_during_execution {
              label_selector {
                match_expressions {
                  key      = "app"
                  operator = "In"
                  values   = ["kafka"]
                }
              }

              topology_key = "kubernetes.io/hostname"
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
        access_modes = ["ReadWriteOnce"]

        resources {
          requests {
            storage = "5Gi"
          }
        }
      }
    }
  }
}

resource "kubernetes_pod" "kafka_pod_create_topics" {
  metadata {
    name = "topics-creation"
  }

  spec {
    container {
      name  = "create-topics"
      image = "confluentinc/cp-kafka:5.0.0-2"

      command = [
        "sh",
        "-c",
        "kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 12 --topic blocks --config retention.ms=-1 --config cleanup.policy=compact",
        "kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 12 --topic account-state --config retention.ms=-1 --config cleanup.policy=compact",
        "kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 12 --topic pending-transactions --config retention.ms=-1 --config cleanup.policy=compact",
        "kafka-topics --create --zookeeper zookeeper:2181 --replication-factor 1 --partitions 1 --topic metadata --config retention.ms=-1 --config cleanup.policy=compact",
      ]
    }
  }
}
