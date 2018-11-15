variable "name" {
  description = "The name of the Node Pool"
}

variable "zone" {
  description = "In which zone to create the Node Pool"
  default     = "us-central1-a"
}

variable "min_node_count" {
  description = "Minimum number of nodes in the NodePool"
}

variable "max_node_count" {
  description = "Maximum number of nodes in the NodePool"
}

variable "auto_repair" {
  description = "Whether the nodes will be automatically repaired"
  default     = true
}

variable "auto_upgrade" {
  description = "Whether the nodes will be automatically upgraded"
  default     = true
}

variable "node_count" {
  description = "The number of nodes to create in this Node Pool"
  default     = 1
}

variable "cluster_name" {
  description = "Name of the cluster to which to add this Node Pool"
}

variable "machine_type" {
  description = "The type of machine to use for nodes in the pool"
  default     = "n1-standard-4"
}

variable "image_type" {
  description = "The image type to use for nodes. See supported image types https://cloud.google.com/kubernetes-engine/docs/concepts/node-images"
  default     = "COS"
}

variable "disk_type" {
  description = "Type of the disk attached to each node"
  default     = "pd-ssd"
}

variable "disk_size_gb" {
  description = "Disk of which size to attach to the nodes in the pool "
  default     = "10"
}
