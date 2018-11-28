resource "kubernetes_service_account" "traefik_service_account" {
  metadata {
    name      = "traefik-ingress-controller"
    namespace = "kube-system"
  }
}

resource "kubernetes_cluster_role" "traefik_cluster_role" {
  metadata {
    name = "traefik-ingress-controller"
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
    name = "traefik-ingress-controller"
  }

  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind      = "ClusterRole"
    name      = "traefik-ingress-controller"
  }

  subject {
    kind      = "ServiceAccount"
    name      = "traefik-ingress-controller"
    namespace = "kube-system"
  }
}

resource "kubernetes_secret" "traefik_default_cert" {
  metadata {
    name = "traefik-default-cert"

    labels {
      app = "traefik"
    }
  }

  type = "Opaque"

  data {
    "tls.crt" = "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUVtekNDQTRPZ0F3SUJBZ0lKQUpBR1FsTW1DMGt5TUEwR0NTcUdTSWIzRFFFQkJRVUFNSUdQTVFzd0NRWUQKVlFRR0V3SlZVekVSTUE4R0ExVUVDQk1JUTI5c2IzSmhaRzh4RURBT0JnTlZCQWNUQjBKdmRXeGtaWEl4RkRBUwpCZ05WQkFvVEMwVjRZVzF3YkdWRGIzSndNUXN3Q1FZRFZRUUxFd0pKVkRFV01CUUdBMVVFQXhRTktpNWxlR0Z0CmNHeGxMbU52YlRFZ01CNEdDU3FHU0liM0RRRUpBUllSWVdSdGFXNUFaWGhoYlhCc1pTNWpiMjB3SGhjTk1UWXgKTURJME1qRXdPVFV5V2hjTk1UY3hNREkwTWpFd09UVXlXakNCanpFTE1Ba0dBMVVFQmhNQ1ZWTXhFVEFQQmdOVgpCQWdUQ0VOdmJHOXlZV1J2TVJBd0RnWURWUVFIRXdkQ2IzVnNaR1Z5TVJRd0VnWURWUVFLRXd0RmVHRnRjR3hsClEyOXljREVMTUFrR0ExVUVDeE1DU1ZReEZqQVVCZ05WQkFNVURTb3VaWGhoYlhCc1pTNWpiMjB4SURBZUJna3EKaGtpRzl3MEJDUUVXRVdGa2JXbHVRR1Y0WVcxd2JHVXVZMjl0TUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQwpBUThBTUlJQkNnS0NBUUVBdHVKOW13dzlCYXA2SDROdUhYTFB6d1NVZFppNGJyYTFkN1ZiRUJaWWZDSStZNjRDCjJ1dThwdTNhVTVzYXVNYkQ5N2pRYW95VzZHOThPUHJlV284b3lmbmRJY3RFcmxueGpxelUyVVRWN3FEVHk0bkEKNU9aZW9SZUxmZXFSeGxsSjE0VmlhNVFkZ3l3R0xoRTlqZy9jN2U0WUp6bmg5S1dZMnFjVnhEdUdEM2llaHNEbgphTnpWNFdGOWNJZm1zOHp3UHZPTk5MZnNBbXc3dUhUKzNiSzEzSUloeDI3ZmV2cXVWcENzNDFQNnBzdStWTG4yCjVIRHk0MXRoQkN3T0wrTithbGJ0ZktTcXM3TEFzM25RTjFsdHpITHZ5MGE1RGhkakpUd2tQclQrVXhwb0tCOUgKNFpZazErRUR0N09QbGh5bzM3NDFRaE4vSkNZK2RKbkFMQnNValFJREFRQUJvNEgzTUlIME1CMEdBMVVkRGdRVwpCQlJwZVc1dFhMdHh3TXJvQXM5d2RNbTUzVVVJTERDQnhBWURWUjBqQklHOE1JRzVnQlJwZVc1dFhMdHh3TXJvCkFzOXdkTW01M1VVSUxLR0JsYVNCa2pDQmp6RUxNQWtHQTFVRUJoTUNWVk14RVRBUEJnTlZCQWdUQ0VOdmJHOXkKWVdSdk1SQXdEZ1lEVlFRSEV3ZENiM1ZzWkdWeU1SUXdFZ1lEVlFRS0V3dEZlR0Z0Y0d4bFEyOXljREVMTUFrRwpBMVVFQ3hNQ1NWUXhGakFVQmdOVkJBTVVEU291WlhoaGJYQnNaUzVqYjIweElEQWVCZ2txaGtpRzl3MEJDUUVXCkVXRmtiV2x1UUdWNFlXMXdiR1V1WTI5dGdna0FrQVpDVXlZTFNUSXdEQVlEVlIwVEJBVXdBd0VCL3pBTkJna3EKaGtpRzl3MEJBUVVGQUFPQ0FRRUFjR1hNZms4TlpzQit0OUtCemwxRmw2eUlqRWtqSE8wUFZVbEVjU0QyQjRiNwpQeG5NT2pkbWdQcmF1SGI5dW5YRWFMN3p5QXFhRDZ0YlhXVTZSeENBbWdMYWpWSk5aSE93NDVOMGhyRGtXZ0I4CkV2WnRRNTZhbW13QzFxSWhBaUE2MzkwRDNDc2V4N2dMNm5KbzdrYnIxWVdVRzN6SXZveGR6OFlEclpOZVdLTEQKcFJ2V2VuMGxNYnBqSVJQNFhac25DNDVDOWdWWGRoM0xSZTErd3lRcTZoOVFQaWxveG1ENk5wRTlpbVRPbjJBNQovYkozVktJekFNdWRlVTZrcHlZbEpCemRHMXVhSFRqUU9Xb3NHaXdlQ0tWVVhGNlV0aXNWZGRyeFF0aDZFTnlXCnZJRnFhWng4NCtEbFNDYzkzeWZrL0dsQnQrU0tHNDZ6RUhNQjlocVBiQT09Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K"
    "tls.key" = "LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFb3dJQkFBS0NBUUVBdHVKOW13dzlCYXA2SDROdUhYTFB6d1NVZFppNGJyYTFkN1ZiRUJaWWZDSStZNjRDCjJ1dThwdTNhVTVzYXVNYkQ5N2pRYW95VzZHOThPUHJlV284b3lmbmRJY3RFcmxueGpxelUyVVRWN3FEVHk0bkEKNU9aZW9SZUxmZXFSeGxsSjE0VmlhNVFkZ3l3R0xoRTlqZy9jN2U0WUp6bmg5S1dZMnFjVnhEdUdEM2llaHNEbgphTnpWNFdGOWNJZm1zOHp3UHZPTk5MZnNBbXc3dUhUKzNiSzEzSUloeDI3ZmV2cXVWcENzNDFQNnBzdStWTG4yCjVIRHk0MXRoQkN3T0wrTithbGJ0ZktTcXM3TEFzM25RTjFsdHpITHZ5MGE1RGhkakpUd2tQclQrVXhwb0tCOUgKNFpZazErRUR0N09QbGh5bzM3NDFRaE4vSkNZK2RKbkFMQnNValFJREFRQUJBb0lCQUhrTHhka0dxNmtCWWQxVAp6MkU4YWFENnhneGpyY2JSdGFCcTc3L2hHbVhuQUdaWGVWcE81MG1SYW8wbHZ2VUgwaE0zUnZNTzVKOHBrdzNmCnRhWTQxT1dDTk1PMlYxb1MvQmZUK3Zsblh6V1hTemVQa0pXd2lIZVZMdVdEaVVMQVBHaWl4emF2RFMyUnlQRmEKeGVRdVNhdE5pTDBGeWJGMG5Zd3pST3ZoL2VSa2NKVnJRZlZudU1melFkOGgyMzZlb1UxU3B6UnhSNklubCs5UApNc1R2Wm5OQmY5d0FWcFo5c1NMMnB1V1g3SGNSMlVnem5oMDNZWUZJdGtDZndtbitEbEdva09YWHBVM282aWY5ClRIenBleHdubVJWSmFnRG85bTlQd2t4QXowOW80cXExdHJoU1g1U2p1K0xyNFJvOHg5bytXdUF1VnVwb0lHd0wKMWVseERFRUNnWUVBNzVaWGp1enNJR09PMkY5TStyYVFQcXMrRHZ2REpzQ3gyZnRudk1WWVJKcVliaGt6YnpsVQowSHBCVnk3NmE3WmF6Umxhd3RGZ3ljMlpyQThpM0F3K3J6d1pQclNJeWNieC9nUVduRzZlbFF1Y0FFVWdXODRNCkdSbXhKUGlmOGRQNUxsZXdRalFjUFJwZVoxMzlYODJreGRSSEdma1pscHlXQnFLajBTWExRSEVDZ1lFQXcybkEKbUVXdWQzZFJvam5zbnFOYjBlYXdFUFQrbzBjZ2RyaENQOTZQK1pEekNhcURUblZKV21PeWVxRlk1eVdSSEZOLwpzbEhXU2lTRUFjRXRYZys5aGlMc0RXdHVPdzhUZzYyN2VrOEh1UUtMb2tWWEFUWG1NZG9xOWRyQW9INU5hV2lECmRSY3dEU2EvamhIN3RZV1hKZDA4VkpUNlJJdU8vMVZpbDBtbEk5MENnWUVBb2lsNkhnMFNUV0hWWDNJeG9raEwKSFgrK1ExbjRYcFJ5VEg0eldydWY0TjlhYUxxNTY0QThmZGNodnFiWGJHeEN6U3RxR1E2cW1peUU1TVpoNjlxRgoyd21zZEpxeE14RnEzV2xhL0lxSzM0cTZEaHk3cUNld1hKVGRKNDc0Z3kvY0twZkRmeXZTS1RGZDBFejNvQTZLCmhqUUY0L2lNYnpxUStQREFQR0YrVHFFQ2dZQmQ1YnZncjJMMURzV1FJU3M4MHh3MDBSZDdIbTRaQVAxdGJuNk8KK0IvUWVNRC92UXBaTWV4c1hZbU9lV2Noc3FCMnJ2eW1MOEs3WDY1NnRWdGFYay9nVzNsM3ZVNTdYSFF4Q3RNUwpJMVYvcGVSNHRiN24yd0ZncFFlTm1XNkQ4QXk4Z0xiaUZhRkdRSDg5QWhFa0dTd1d5cWJKc2NoTUZZOUJ5OEtUCkZaVWZsUUtCZ0V3VzJkVUpOZEJMeXNycDhOTE1VbGt1ZnJxbllpUTNTQUhoNFZzWkg1TXU0MW55Yi95NUUyMW4KMk55d3ltWGRlb3VJcFZjcUlVTXl0L3FKRmhIcFJNeVEyWktPR0QyWG5YaENNVlRlL0FQNDJod294Nm02QkZpQgpvemZFa2wwak5uZmREcjZrL1p2MlQ1TnFzaWxaRXJBQlZGOTBKazdtUFBIa0Q2R1ZMUUJ4Ci0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0tCg"
  }
}

data "template_file" "traefik_toml" {
  template = "${file("${path.module}/traefik.toml")}"

  vars {
    email  = "${var.traefik_acme_email}"
    domain = "${var.traefik_domain}"
  }
}

resource "kubernetes_config_map" "traefik_config_map" {
  metadata {
    name      = "traefik-config"
    namespace = "kube-system"
  }

  data {
    "traefik.toml" = "${data.template_file.traefik_toml.rendered}"
  }
}

resource "kubernetes_service" "traefik_service" {
  metadata {
    name      = "traefik"
    namespace = "kube-system"
  }

  spec {
    selector {
      app = "traefik"
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

resource "kubernetes_service" "traefik_dashboard_service" {
  metadata {
    name = "traefik-dashboard"

    labels {
      app = "traefik"
    }
  }

  spec {
    selector {
      app = "traefik"
    }

    type = "ClusterIP"

    port {
      name        = "http"
      protocol    = "TCP"
      port        = 80
      target_port = 8080
    }
  }
}

resource "kubernetes_stateful_set" "traefik_sateful_set" {
  metadata {
    name      = "traefik-ingress-controller"
    namespace = "kube-system"

    labels {
      app = "traefik"
    }
  }

  spec {
    selector {
      app = "traefik"
    }

    replicas     = 1
    service_name = "traefik"

    update_strategy {
      type = "RollingUpdate"

      rolling_update {
        partition = 1
      }
    }

    template {
      metadata {
        labels {
          app  = "traefik"
          name = "traefik"
        }
      }

      spec {
        service_account_name             = "traefik-ingress-controller"
        termination_grace_period_seconds = 60

        container {
          name              = "traefik"
          image             = "traefik:${var.traefik_version}-alpine"
          image_pull_policy = "IfNotPresent"

          args = ["--configFile=/config/traefik.toml"]

          resources {
            requests {
              cpu    = "100m"
              memory = "20Mi"
            }

            limits {
              cpu    = "100m"
              memory = "30Mi"
            }
          }

          readiness_probe {
            failure_threshold     = 1
            initial_delay_seconds = 60
            period_seconds        = 10
            success_threshold     = 1
            timeout_seconds       = 2

            tcp_socket {
              port = 80
            }
          }

          liveness_probe {
            failure_threshold     = 3
            initial_delay_seconds = 60
            period_seconds        = 10
            success_threshold     = 1
            timeout_seconds       = 2

            tcp_socket {
              port = 80
            }
          }

          port {
            name           = "http"
            protocol       = "TCP"
            container_port = 80
          }

          port {
            name           = "https"
            protocol       = "TCP"
            container_port = 443
          }

          port {
            name           = "dashboard"
            protocol       = "TCP"
            container_port = 8080
          }

          volume_mount {
            name       = "acme"
            mount_path = "/acme"
          }

          volume_mount {
            name       = "config"
            mount_path = "/config"
          }

          volume_mount {
            name       = "ssl"
            mount_path = "/ssl"
          }
        }

        volume {
          name = "config"

          config_map {
            name = "traefik-config"
          }
        }

        volume {
          name = "ssl"

          secret {
            secret_name = "traefik-default-cert"
          }
        }

        volume {
          name = "acme"

          persistent_volume_claim {
            claim_name = "acme"
          }
        }
      }
    }

    volume_claim_templates {
      metadata {
        name = "acme"
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

resource "kubernetes_ingress" "traefik_ingress" {
  metadata {
    name = "traefik"

    labels {
      app = "traefik"
    }
  }

  spec {
    rule {
      host = "${var.traefik_domain}"

      http {
        path {
          backend {
            service_name = "explorer"
            service_port = 8080
          }
        }
      }
    }

    rule {
      host = "${format("%s.%s", var.traefik_api_subdomain, var.traefik_domain)}"

      http {
        path {
          backend {
            service_name = "api"
            service_port = 3000
          }
        }
      }
    }
  }
}
