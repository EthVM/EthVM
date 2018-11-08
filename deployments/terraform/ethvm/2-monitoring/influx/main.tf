resource "kubernetes_service" "influx_service" {
  metadata {
    name      = "monitoring-influxdb"
    namespace = "kube-system"

    labels {
      task                            = "monitoring"
      "kubernetes.io/cluster-service" = "true"
      "kubernetes.io/name"            = "monitoring-influxdb"
    }
  }

  spec {
    selector {
      app = "influxdb"
    }

    port {
      port        = 8086
      target_port = 8086
    }
  }
}

resource "kubernetes_deployment" "influx_deployment" {
  metadata {
    name      = "monitoring-influxdb"
    namespace = "kube-system"
  }

  spec {
    selector {
      app = "influxdb"
    }

    replicas = 1

    template {
      metadata {
        labels {
          app  = "influxdb"
          task = "monitoring"
        }
      }

      spec {
        container {
          name              = "influxdb"
          image             = "gcr.io/google_containers/heapster-influxdb-amd64:v1.3.3"
          image_pull_policy = "IfNotPresent"

          volume_mount {
            name       = "influxdb-storage"
            mount_path = "/data"
          }
        }

        volume {
          name = "influxdb-storage"
        }
      }
    }
  }
}
