resource "kubernetes_deployment" "kafka_streams_deployment" {
  metadata {
    name      = "kafka-streams"
    namespace = "${var.namespace}"

    labels {
      app = "kafka-streams"
    }
  }

  spec {
    selector {
      app = "kafka-streams"
    }

    replicas = "${var.kafka_streams_nodes}"

    template {
      metadata {
        labels {
          app = "kafka-streams"
        }
      }

      spec {
        container {
          name              = "kafka-streams"
          image             = "enkryptio/kafka-streams:${var.kafka_streams_version}"
          image_pull_policy = "IfNotPresent"

          env {
            name  = "KAFKA_BOOTSTRAP_SERVERS"
            value = "kafka:9092"
          }

          env {
            name  = "MONGO_URI"
            value = "mongodb://localhost:27017/"
          }
        }
      }
    }
  }
}
