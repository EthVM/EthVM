output "preprod-namespace" {
  value = "${kubernetes_namespace.ethvm_pre.metadata.0.name}"
}

output "prod-namespace" {
  value = "${kubernetes_namespace.ethvm_prod.metadata.0.name}"
}
