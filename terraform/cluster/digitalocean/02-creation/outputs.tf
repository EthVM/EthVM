output "manager_ips" {
  value       = ["${module.managers.ipv4_addresses}"]
  description = "The manager nodes public ipv4 adresses"
}

output "manager_ips_private" {
  value       = ["${module.managers.ipv4_addresses_private}"]
  description = "The manager nodes private ipv4 adresses"
}

output "worker_ips" {
  value       = ["${module.workers.ipv4_addresses}"]
  description = "The worker nodes public ipv4 adresses"
}

output "worker_ips_private" {
  value       = ["${module.workers.ipv4_addresses_private}"]
  description = "The worker nodes private ipv4 adresses"
}

output "manager_token" {
  value       = "${module.managers.manager_token}"
  description = "The Docker Swarm manager join token"
  sensitive   = true
}

output "worker_token" {
  value       = "${module.managers.worker_token}"
  description = "The Docker Swarm worker join token"
  sensitive   = true
}
