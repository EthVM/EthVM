resource "kubernetes_service" "kafka_schema_registry_service" {
  metadata {
    name      = "kafka-schema-registry"
    namespace = "${var.namespace}"

    labels {
      app = "kafka-schema-registry"
    }
  }

  spec {
    selector {
      app = "kafka-schema-registry"
    }

    port {
      name = "kafka-schema-registry"
      port = 8081
    }
  }
}

resource "kubernetes_deployment" "kafka_schema_registry_deployment" {
  metadata {
    name      = "kafka-schema-registry"
    namespace = "${var.namespace}"

    labels {
      app = "kafka-schema-registry"
    }
  }

  spec {
    selector {
      app = "kafka-schema-registry"
    }

    replicas = 1

    template {
      metadata {
        labels {
          app = "kafka-schema-registry"
        }
      }

      spec {
        container {
          name              = "kafka-schema-registry"
          image             = "confluentinc/cp-schema-registry:${var.kafka_schema_registry_version}"
          image_pull_policy = "IfNotPresent"

          resources {
            requests {
              memory = "1Gi"
            }

            limits {
              memory = "2Gi"
            }
          }

          port {
            container_port = 8081
          }

          liveness_probe {
            initial_delay_seconds = 60
            timeout_seconds       = 5

            http_get {
              path = "/"
              port = 8081
            }
          }

          readiness_probe {
            initial_delay_seconds = 60
            period_seconds        = 10
            timeout_seconds       = 5
            success_threshold     = 1
            failure_threshold     = 3

            http_get {
              path = "/"
              port = 8081
            }
          }

          env {
            name  = "SCHEMA_REGISTRY_JVM_PERFORMANCE_OPTS"
            value = "-XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -XX:MetaspaceSize=96m -XX:+UseG1GC -XX:MaxGCPauseMillis=20 -XX:InitiatingHeapOccupancyPercent=35 -XX:G1HeapRegionSize=16M -XX:MinMetaspaceFreeRatio=50 -XX:MaxMetaspaceFreeRatio=80"
          }

          env {
            name  = "SCHEMA_REGISTRY_HEAP_OPTS"
            value = "-Xms1g -Xmx1g"
          }

          env {
            name = "SCHEMA_REGISTRY_HOST_NAME"

            value_from {
              field_ref {
                field_path = "status.podIP"
              }
            }
          }

          env {
            name  = "SCHEMA_REGISTRY_KAFKASTORE_BOOTSTRAP_SERVERS"
            value = "PLAINTEXT://kafka-headless:9092"
          }

          env {
            name  = "SCHEMA_REGISTRY_MASTER_ELIGIBILITY"
            value = "true"
          }
        }
      }
    }
  }
}
