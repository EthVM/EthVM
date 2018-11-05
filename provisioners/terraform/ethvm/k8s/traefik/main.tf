resource "kubernetes_service_account" "traefik-service-account" {
  metadata {
    name = "traefik-ingress-account"
    namespace = "kube-system"
  }
}

resource "kubernetes_cluster_role" "traefik-cluster-role" {
  metadata {
    name = "traefik-ingress-cr"
  }

  rule {
    api_groups = ""

    resources = [
      "services",
      "endpoints",
      "secrets"
    ]

    verbs = [
      "get",
      "list",
      "watch"
    ]
  }

  rule {
    api_groups = "extensions"

    resources = "ingresses"

    verbs = [
      "get",
      "list",
      "watch"
    ]
  }
}

resource "kubernetes_cluster_role_binding" "traefik-cluster-role-binding" {
  metadata {
    name = "traefik-ingress-crb"
  }

  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind = "ClusterRole"
    name = "traefik-ingress-cr"
  }

  subject {
    kind = "ServiceAccount"
    name = "traefik-ingress-account"
  }
}

resource "kubernetes_config_map" "traefik-config-map" {
  metadata {
    name = "traefik-config"
    namespace = "kube-system"
  }
}

resource "kubernetes_service" "traefik-service" {
  metadata {
    name = "traefik-ingress-service"
  }

  spec {
    selector {
      app = "traefik-ingress-lb"
    }

    type = "LoadBalancer"

    port {
      name = "http"
      protocol = "TCP"
      port = 80
    }

    port {
      name = "https"
      protocol = "TCP"
      port = 443
    }
  }
}

resource "kubernetes_stateful_set" "traefik-sateful-set" {
  metadata {
    name = "kube-system"
    namespace = "traefik-ingress-controller"

    labels {
      app = "traefik-ingress-lb"
    }
  }

  spec {
    replicas = 1
    service_name = "traefik-ingress-service"

    selector {
      app = "traefik-ingress-lb"
    }

    template {
      container {
        image = "traefik:1.7.3-alpine"
        name = "traefik-ingress-lb"
      }
    }
  }
}
