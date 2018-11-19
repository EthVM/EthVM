resource "google_container_node_pool" "np" {
  name       = "${var.name}"
  zone       = "${var.zone}"
  cluster    = "${var.cluster_name}"
  node_count = "${var.node_count}"

  autoscaling {
    min_node_count = "${var.min_node_count}"
    max_node_count = "${var.max_node_count}"
  }

  management {
    auto_repair  = "${var.auto_repair}"
    auto_upgrade = "${var.auto_upgrade}"
  }

  node_config {
    image_type   = "${var.image_type}"
    machine_type = "${var.machine_type}"

    disk_type    = "${var.disk_type}"
    disk_size_gb = "${var.disk_size_gb}"

    # The set of Google API scopes
    oauth_scopes = [
      "compute-rw",
      "storage-ro",
      "logging-write",
      "monitoring",
    ]

    # Tags can used to identify targets in firewall rules
    tags = ["${var.name}-cluster", "nodes"]
  }
}
