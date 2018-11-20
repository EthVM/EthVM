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
    replicas              = "${var.kafka_brokers}"

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
          image             = "confluentinc/cp-kafka:${var.kafka_version}"
          image_pull_policy = "IfNotPresent"

          command = [
            "bash",
            "-c",
            "${file("${path.module}/command.sh")}",
          ]

          resources {
            requests {
              memory = "7Gi"
            }

            limits {
              memory = "8Gi"
            }
          }

          port {
            name           = "kafka"
            container_port = 9092
          }

          volume_mount {
            name       = "data"
            mount_path = "/opt/kafka/data"
          }

          liveness_probe {
            initial_delay_seconds = 60
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
            initial_delay_seconds = 60
            period_seconds        = 10
            timeout_seconds       = 5
            success_threshold     = 1
            failure_threshold     = 3

            tcp_socket {
              port = 9092
            }
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
            name  = "KAFKA_JVM_PERFORMANCE_OPTS"
            value = "-XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -XX:MetaspaceSize=96m -XX:+UseG1GC -XX:MaxGCPauseMillis=20 -XX:InitiatingHeapOccupancyPercent=35 -XX:G1HeapRegionSize=16M -XX:MinMetaspaceFreeRatio=50 -XX:MaxMetaspaceFreeRatio=80"
          }

          env {
            name  = "KAFKA_HEAP_OPTS"
            value = "-Xms6g -Xmx6g"
          }

          env {
            name  = "KAFKA_ZOOKEEPER_CONNECT"
            value = "zookeeper:2181"
          }

          env {
            name  = "KAFKA_LOG4J_LOGGERS"
            value = "kafka.controller=INFO,kafka.producer.async.DefaultEventHandler=INFO,state.change.logger=INFO"
          }

          env {
            name  = "KAFKA_LOG_DIRS"
            value = "/opt/kafka/data/logs"
          }

          env {
            name  = "KAFKA_AUTO_CREATE_TOPICS_ENABLE"
            value = "false"
          }

          env {
            name  = "KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR"
            value = "${var.kafka_brokers}"
          }

          env {
            name  = "KAFKA_CONFLUENT_SUPPORT_METRICS_ENABLE"
            value = "false"
          }

          env {
            name  = "KAFKA_JMX_PORT"
            value = "555"
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
                  values   = ["kafka"]
                }
              }
            }
          }
        }

        toleration {
          key      = "kafka"
          operator = "Equal"
          value    = "false"
          effect   = "NoSchedule"
        }
      }
    }

    volume_claim_templates {
      metadata {
        name = "data"
      }

      spec {
        storage_class_name = "${var.kafka_storage_type}"
        access_modes       = ["ReadWriteOnce"]

        resources {
          requests {
            storage = "${var.kafka_storage_size}"
          }
        }
      }
    }
  }
}

resource "kubernetes_job" "kafka_create_topics" {
  metadata {
    name = "kafka-topics-creation"
  }

  spec {
    template {
      spec {
        restart_policy = "Never"

        container {
          name              = "kafka-create-topics"
          image             = "enkryptio/kafka-ethvm-init:${var.kafka_ethvm_init_version}"
          image_pull_policy = "Always"
        }
      }
    }
  }
}
