output "root_manager.ip" {
  value = "${aws_eip.manager-ip.public_ip}"
}

output "EFS_mount" {
  value = "${module.efs.mount_target_dns}"
}
