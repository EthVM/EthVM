resource "kubernetes_namespace" "ethvm_pre" {
  metadata {
    name = "ethvm-pre"

    labels {
      mylabel = "ethvm"
    }
  }
}

resource "kubernetes_namespace" "ethvm_prod" {
  metadata {
    name = "ethvm-prod"

    labels {
      app = "ethvm"
    }
  }
}
