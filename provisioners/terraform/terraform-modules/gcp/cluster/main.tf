resource "google_container_cluster" "primary" {
  name               = "${var.name}"
  description        = "${var.description}"
  zone               = "${var.zone}"
  initial_node_count = "${var.initial_node_count}"

  addons_config {
    kubernetes_dashboard {
      disabled = "${var.disable_dashboard}"
    }

    http_load_balancing {
      disabled = "${var.disable_autoscaling_addon}"
    }
  }

  network = "${var.network}"

  # node pools will be replicated automatically to the additional zones
  # additional_zones = [
  #   "europe-west1-c"
  # ]

  # node configuration
  # NOTE: nodes created during the cluster creation become the default node pool
  node_config {
    image_type   = "${var.node_image_type}"
    machine_type = "${var.node_machine_type}"
    disk_size_gb = "${var.node_disk_size_gb}"

    # The set of Google API scopes
    # The following scopes are necessary to ensure the correct functioning of the cluster
    oauth_scopes = [
      "https://www.googleapis.com/auth/compute",
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ]

    # Tags can used to identify targets in firewall rules
    tags = ["${var.name}-cluster", "nodes"]
  }
}
