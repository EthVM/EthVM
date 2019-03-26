output "root_manager.ip" {
  value = "${aws_eip.manager-ip.public_ip}"
}

output "grafana" {
  value = "http://${aws_eip.manager-ip.public_ip}:3000"
}

output "prometheus" {
  value = "http://${aws_eip.manager-ip.public_ip}:9090"
}

output "alert-manager" {
  value = "http://${aws_eip.manager-ip.public_ip}:9093"
}

output "unsee" {
  value = "http://${aws_eip.manager-ip.public_ip}:9094"
}

output "ethstats_instance" {
  value = "http://${aws_eip.manager-ip.public_ip}:3030"
}

output "EFS_mount" {
  value = "${module.efs.mount_target_dns}"
}
