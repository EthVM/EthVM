output "worker_ips" {
  value = aws_instance.workers.*.private_ip
}

output "worker_ids" {
  value = aws_instance.workers.*.id
}
