resource "google_container_node_pool" "np" {
  name       = "${var.name}"
  zone       = "${var.zone}"
  cluster    = "${var.cluster_name}"
  node_count = "${var.node_count}"

  node_config {
    image_type   = "${var.image_type}"
    machine_type = "${var.machine_type}"
    disk_type    = "${var.disk_type}"
    disk_size_gb = "${var.disk_size_gb}"
  }
}
