data "template_file" "user_data" {
  template = "${file("${path.module}/scripts/provision-worker.sh")}"

  vars = {
    root_manager_private_ip = "${var.manager_private_ip}"
    join_token              = "${lookup(var.swarm_tokens, "worker")}"
  }
}

data "local_file" "install_docker" {
  filename = "${path.module}/scripts/install-docker.sh"
}

data "template_file" "efs_mount" {
  template = "${file("${path.module}/scripts/setup-efs.sh")}"

  vars = {
    efs_mount_target_dns = "${var.efs_mount_target_dns}"
  }
}

resource "aws_instance" "workers" {
  ami                    = "${var.ami}"
  availability_zone      = "${var.availability_zone}"
  instance_type          = "${var.instance_type}"
  vpc_security_group_ids = ["${var.security_group}"]
  key_name               = "${var.key_name}"
  subnet_id              = "${var.subnet_id}"
  source_dest_check      = false
  count                  = "${var.total_instances}"
  user_data              = "${format("%s\n%s\n%s",data.local_file.install_docker.content, data.template_file.user_data.rendered, data.template_file.efs_mount.rendered)}"

  tags = {
    Name = "${format("%s-%02d", var.name, count.index + 1)}"
    Type = "terraform"
  }
}
