output "ethvm_static_ip" {
  value = "${google_compute_global_address.ethvm_static_ip.address}"
}

output "kubconfig" {
  value = " ... \nRun command to configure access via kubectl:\n$ gcloud container clusters get-credentials ${module.ethvm_cluster.name} --zone ${var.zone} --project ${var.project_id}"
}
