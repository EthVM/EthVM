resource "kubernetes_service_account" "traefik_service_account" {
  metadata {
    name      = "traefik-ingress-account"
    namespace = "kube-system"
  }
}

resource "kubernetes_cluster_role" "traefik_cluster_role" {
  metadata {
    name = "traefik-ingress-cr"
  }

  rule {
    api_groups = [""]

    resources = [
      "services",
      "endpoints",
      "secrets",
    ]

    verbs = [
      "get",
      "list",
      "watch",
    ]
  }

  rule {
    api_groups = ["extensions"]

    resources = ["ingresses"]

    verbs = [
      "get",
      "list",
      "watch",
    ]
  }
}

resource "kubernetes_cluster_role_binding" "traefik_cluster_role_binding" {
  metadata {
    name = "traefik-ingress-crb"
  }

  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind      = "ClusterRole"
    name      = "traefik-ingress-cr"
  }

  subject {
    kind = "ServiceAccount"
    name = "${kubernetes_service_account.traefik_service_account.metadata.name}"
  }
}

resource "kubernetes_config_map" "traefik_config_map" {
  metadata {
    name      = "traefik-config"
    namespace = "kube-system"
  }

  data {
    traefik_config = <<EOF
defaultEntryPoints = ["http","https"]
debug = false
logLevel = "INFO"

[entryPoints]
  [entryPoints.http]
    address = ":80"
    compress = true
    [entryPoints.http.redirect]
      entryPoint = "https"
      [entryPoints.https]
        address = ":443"
        compress = true
        [entryPoints.https.tls]

[kubernetes]

[ping]
  entryPoint = "http"

[accessLog]

[acme]
  email = "${var.traefik_email}"
  storage = "/etc/traefik/acme/account"
  acmeLogging = true
  entryPoint = "https"
  OnHostRule = true
  [acme.httpChallenge]
    entryPoint="http"
EOF
  }
}

resource "kubernetes_service" "traefik_service" {
  metadata {
    name = "traefik-ingress-service"
  }

  spec {
    selector {
      app = "traefik-ingress-lb"
    }

    type = "LoadBalancer"

    port {
      name     = "http"
      protocol = "TCP"
      port     = 80
    }

    port {
      name     = "https"
      protocol = "TCP"
      port     = 443
    }
  }
}

resource "kubernetes_stateful_set" "traefik_sateful_set" {
  metadata {
    name      = "kube-system"
    namespace = "traefik-ingress-controller"

    labels {
      app = "traefik-ingress-lb"
    }
  }

  spec {
    selector {
      app = "traefik-ingress-lb"
    }

    replicas     = 1
    service_name = "${kubernetes_service.traefik_service.metadata.name}"

    update_strategy {
      type = "RollingUpdate"

      rolling_update {
        partition = 1
      }
    }

    template {
      metadata {
        labels {
          app  = "traefik-ingress-lb"
          name = "traefik-ingress-lb"
        }
      }

      spec {
        container {
          image             = "traefik:${var.traefik_version}-alpine"
          name              = "traefik-ingress-lb"
          image_pull_policy = "IfNotPresent"
          args              = ["--configFile=/etc/traefik/config/traefik.toml"]

          port {
            name           = "http"
            container_port = 80
          }

          port {
            name           = "https"
            container_port = 443
          }

          volume_mount {
            name       = "config"
            mount_path = "/etc/traefik/config"
          }

          volume_mount {
            name       = "traefik-storage-volume"
            mount_path = "/etc/traefik/acme"
          }
        }

        volume {
          name = "config"

          config_map {
            name = "traefik-config"
          }
        }

        service_account_name             = "${kubernetes_service_account.traefik_service_account.metadata.name}"
        termination_grace_period_seconds = 60
      }
    }

    volume_claim_templates {
      metadata {
        name = "traefik-storage-volume"
      }

      spec {
        access_modes = ["ReadWriteOnce"]

        resources {
          requests {
            storage = "25Mi"
          }
        }
      }
    }
  }
}

output "lb_ip" {
  value = "${kubernetes_service.traefik_service.load_balancer_ingress.0.ip}"
}
