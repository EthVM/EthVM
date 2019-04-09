output "dns_name" {
  value = "${aws_efs_file_system.efs_volume.dns_name}"
}

output "mount_target_dns" {
  description = "Address of the mount target provisioned."
  value       = "${aws_efs_mount_target.main.0.dns_name}"
}

output "mount_id" {
  description = "Address of the mount target provisioned."
  value       = "${aws_efs_file_system.efs_volume.id}"
}
