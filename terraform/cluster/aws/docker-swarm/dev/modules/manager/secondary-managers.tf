data "external" "swarm_tokens" {
  program = ["bash", "${path.module}/scripts/get-swarm-join-tokens.sh"]

  query = {
    host        = "${var.aws_eip}"
    user        = "${var.provision_user}"
    private_key = "${var.ssh_key_path}"
  }
}

data "template_file" "user_data" {
  template = "${file("${path.module}/scripts/provision-manager.sh")}"
  count    = "${var.total_instances -1}"

  vars = {
    root_manager_private_ip = "${aws_instance.manager.private_ip}"
    join_token              = "${lookup(data.external.swarm_tokens.result, "manager")}"
    manager_id              = "${count.index + 1}"
  }
}

data "local_file" "install_docker" {
  filename = "${path.module}/scripts/install-docker.sh"
}

resource "aws_instance" "secondary-manager" {
  depends_on                  = ["aws_instance.manager"]
  ami                         = "${var.ami}"
  availability_zone           = "${var.availability_zone}"
  instance_type               = "${var.instance_type}"
  vpc_security_group_ids      = ["${var.security_group}"]
  key_name                    = "${var.key_name}"
  subnet_id                   = "${var.subnet_id}"
  source_dest_check           = false
  count                       = "${var.total_instances -1}"
  depends_on                  = ["aws_instance.manager"]
  associate_public_ip_address = true
  user_data                   = "${format("%s\n%s\n%s",data.local_file.install_docker.content, element(data.template_file.user_data.*.rendered, count.index), data.template_file.efs_mount.rendered)}"

  tags = {
    Name = "${format("%s-secondary-%02d", var.name, count.index + 1)}"
    Type = "terraform"
  }
}
