## ----------------------
## Provider configuration
## ----------------------

variable "project_id" {
  description = "Project ID in GCP"
}

## -------
## General
## -------

variable "name" {
  description = "The name of the cluster, unique within the project and zone"
  default     = "ethvm"
}

variable "description" {
  description = "Cluster description"
  default     = "EthVM Kubernetes cluster"
}

variable "region" {
  description = "Region in which to manage GCP resources"
  default     = "us-central1"
}

variable "zone" {
  description = "The zone the master and nodes should be created in"
  default     = "us-central1-a"
}

variable "ntw_name" {
  description = "The name of the network to create to run cluster instances"
  default     = "ethvm-network"
}

variable "domain_name" {
  description = "Name of the main domain where the cluster will run"
}

## ------------------------------------
## Cluster configuration (Generic Pool)
## ------------------------------------

variable "generic_np_name" {
  description = "Name of the generic pool"
  default     = "ethvm-pool"
}

variable "generic_np_machine_type" {
  description = "The type of machine to use for nodes in the pool"
  default     = "n1-standard-2"
}

variable "generic_cluster_np_count" {
  description = "Number of nodes in the generic pool"
  default     = 3
}

variable "generic_cluster_np_min_node_count" {
  default = "Minimum number of nodes in the NodePool."
  default = 1
}

variable "generic_cluster_np_max_node_count" {
  default = "Maximum number of nodes in the NodePool."
  default = 3
}

## ------------------------------------
## Cluster configuration (Kafka Pool)
## ------------------------------------

variable "kafka_np_name" {
  description = "Name of the Kafka node pool nodes"
  default     = "ethvm-kafka-np"
}

variable "kafka_np_count" {
  description = "Number of Kafka nodes in the node pool"
  default     = 3
}
