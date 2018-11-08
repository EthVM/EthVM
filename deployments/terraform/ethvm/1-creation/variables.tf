## ---------------------
## Provider configuration
## ---------------------
variable "project_id" {
  description = "Project ID in GCP"
}

variable "region" {
  description = "Region in which to manage GCP resources"
}

## ---------------------
## Cluster configuration
## ---------------------
variable "name" {
  description = "The name of the cluster, unique within the project and zone"
}

variable "description" {
  description = "Cluster description"
}

variable "node_pool_name" {
  description = "Name of the node pool nodes"
  default     = "pool"
}

variable "ntw_name" {
  description = "The name of the network to create to run cluster instances"
}

variable "zone" {
  description = "The zone the master and nodes specified in cluster_node_count should be created in"
}

variable "cluster_node_count" {
  description = "Number of master nodes in the cluster"
  default     = 2
}

variable "node_pool_count" {
  description = "Number of minion nodes in the cluster"
  default     = 0
}

variable "domain_name" {
  description = "Name of the main domain where the cluster will run"
}
