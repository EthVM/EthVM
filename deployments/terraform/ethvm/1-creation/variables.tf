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
}

variable "description" {
  description = "Cluster description"
}

variable "region" {
  description = "Region in which to manage GCP resources"
}

variable "zone" {
  description = "The zone the master and nodes should be created in"
}

variable "ntw_name" {
  description = "The name of the network to create to run cluster instances"
}

variable "domain_name" {
  description = "Name of the main domain where the cluster will run"
}

## ------------------------------------
## Cluster configuration (Default Pool)
## ------------------------------------

variable "default_cluster_node_count" {
  description = "Number of nodes in the cluster (default pool)"
  default     = 2
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
