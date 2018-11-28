output "ssd-storage-class" {
  value = "${kubernetes_storage_class.ssd.metadata.0.name}"
}
