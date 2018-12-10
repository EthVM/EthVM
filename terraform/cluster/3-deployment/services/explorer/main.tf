resource "kubernetes_service" "explorer_service" {
  metadata {
    name      = "explorer"
    namespace = "${var.namespace}"

    labels {
      app                  = "explorer"
      "kubernetes.io/name" = "explorer"
    }
  }

  spec {
    selector {
      app = "explorer"
    }

    type = "ClusterIP"

    port {
      name = "explorer"
      port = 8080
    }
  }
}

resource "kubernetes_deployment" "explorer_deployment" {
  metadata {
    name      = "explorer"
    namespace = "${var.namespace}"

    labels {
      app = "explorer"
    }
  }

  spec {
    selector {
      app = "explorer"
    }

    replicas = "${var.explorer_nodes}"

    template {
      metadata {
        labels {
          app = "explorer"
        }
      }

      spec {
        container {
          name              = "explorer"
          image             = "enkryptio/explorer:${var.explorer_version}"
          image_pull_policy = "IfNotPresent"

          port {
            name           = "explorer"
            container_port = 8080
          }

          env {
            name  = "NODE_ENV"
            value = "production"
          }
        }
      }
    }
  }
}
