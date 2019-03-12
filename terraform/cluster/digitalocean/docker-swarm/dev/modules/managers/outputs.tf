output "ipv4_addresses" {
  value       = ["${digitalocean_droplet.manager.*.ipv4_address}"]
  description = "The manager nodes public ipv4 adresses"
}

output "ipv4_addresses_private" {
  value       = ["${digitalocean_droplet.manager.*.ipv4_address_private}"]
  description = "The manager nodes private ipv4 adresses"
}

output "manager_token" {
  value       = "${lookup(data.external.swarm_tokens.result, "manager", "")}"
  description = "The Docker Swarm manager join token"
  sensitive   = true
}

output "worker_token" {
  value       = "${lookup(data.external.swarm_tokens.result, "worker", "")}"
  description = "The Docker Swarm worker join token"
  sensitive   = true
}
