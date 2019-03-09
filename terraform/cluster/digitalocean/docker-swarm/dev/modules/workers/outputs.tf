output "ipv4_addresses" {
  value       = ["${digitalocean_droplet.node.*.ipv4_address}"]
  description = "The nodes public ipv4 adresses"
}

output "ipv4_addresses_private" {
  value       = ["${digitalocean_droplet.node.*.ipv4_address_private}"]
  description = "The nodes private ipv4 adresses"
}

output "droplet_ids" {
  value       = ["${digitalocean_droplet.node.*.id}"]
  description = "The droplet ids"
}

output "droplet_hostnames" {
  value       = ["${digitalocean_droplet.node.*.name}"]
  description = "The droplet names"
}
