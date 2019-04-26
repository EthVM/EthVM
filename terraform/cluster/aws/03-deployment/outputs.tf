output "grafana" {
  value = "http://${var.swarm_manager_ip}:3000"
}

output "prometheus" {
  value = "http://${var.swarm_manager_ip}:9090"
}

output "alert-manager" {
  value = "http://${var.swarm_manager_ip}:9093"
}

output "unsee" {
  value = "http://${var.swarm_manager_ip}:9094"
}

output "ethstats_instance" {
  value = "http://${var.swarm_manager_ip}:3030"
}

output "kafka_lenses" {
  value = "http://${var.swarm_manager_ip}:9991"
}
