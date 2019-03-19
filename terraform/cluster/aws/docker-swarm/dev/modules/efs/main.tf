resource "aws_efs_file_system" "efs_volume" {
  tags = {
    Name = "${var.name}"
  }
}

resource "aws_efs_mount_target" "main" {
  count = "${length(var.subnet_ids)}"

  file_system_id = "${aws_efs_file_system.efs_volume.id}"
  subnet_id      = "${element(var.subnet_ids, count.index)}"

  security_groups = [
    "${var.security_group_id}",
  ]
}
