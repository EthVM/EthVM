resource "kubernetes_service" "grafana_service" {
  metadata {
    name      = "monitoring-grafana"
    namespace = "kube-system"

    labels {
      "kubernetes.io/cluster-service" = "true"
      "kubernetes.io/name"            = "monitoring-grafana"
    }
  }

  spec {
    selector {
      app = "grafana"
    }

    port {
      port        = 80
      target_port = 3000
    }
  }
}

resource "kubernetes_deployment" "grafana_deployment" {
  metadata {
    name      = "monitoring-grafana"
    namespace = "kube-system"
  }

  spec {
    selector {
      app = "grafana"
    }

    replicas = 1

    template {
      metadata {
        labels {
          app  = "grafana"
          task = "monitoring"
        }
      }

      spec {
        container {
          name  = "grafana"
          image = "gcr.io/google_containers/heapster-grafana-amd64:v4.4.3"

          port {
            container_port = 3000
            protocol       = "TCP"
          }

          env {
            name  = "INFLUXDB_HOST"
            value = "monitoring-influxdb"
          }

          env {
            name  = "GF_SERVER_HTTP_PORT"
            value = "3000"
          }

          env {
            name  = "GF_AUTH_BASIC_ENABLED"
            value = "false"
          }

          env {
            name  = "GF_AUTH_ANONYMOUS_ENABLED"
            value = "true"
          }

          env {
            name  = "GF_AUTH_ANONYMOUS_ORG_ROLE"
            value = "Admin"
          }

          env {
            name  = "GF_SERVER_ROOT_URL"
            value = "/"
          }

          volume_mount {
            name       = "ca-certificates"
            mount_path = "/etc/ssl/certs"
          }

          volume_mount {
            name       = "grafana-storage"
            mount_path = "/var"
          }
        }

        volume {
          name = "ca-certificates"

          host_path {
            path = "/etc/ssl/certs"
          }
        }

        volume {
          name = "grafana-storage"
        }
      }
    }
  }
}
