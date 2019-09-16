output "root_manager_id" {
  value = aws_instance.manager.id
}

output "root_managers" {
  value = [aws_instance.manager.id]
}

output "secondary_managers" {
  value = aws_instance.secondary_manager.*.id
}

output "root_manager_private_ip" {
  value = aws_instance.manager.private_ip
}

output "secondary_managers_private_ips" {
  value = [
    for instance in aws_instance.secondary_manager.* :
    instance.private_ip
  ]
}

output "swarm_tokens" {
  value = data.external.swarm_tokens.result
}
