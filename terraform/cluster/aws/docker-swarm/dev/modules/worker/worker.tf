data "external" "swarm_tokens" {
  program = ["bash", "${path.module}/../manager/scripts/get-swarm-join-tokens.sh"]

  query = {
    host        = "${var.manager_public_ip}"
    user        = "${var.provision_user}"
    private_key = "${var.ssh_key_path}"
  }
}

data "template_file" "user_data" {
  template = "${file("${path.module}/scripts/provision-worker.sh")}"

  vars = {
    root_manager_private_ip = "${var.manager_private_ip}"
    join_token              = "${lookup(data.external.swarm_tokens.result, "worker")}"
  }
}

data "local_file" "install_docker" {
  filename = "${path.module}/scripts/install-docker.sh"
}

resource "aws_instance" "workers" {
  ami                         = "${var.ami}"
  availability_zone           = "${var.availability_zone}"
  instance_type               = "${var.instance_type}"
  security_groups             = ["${var.security_group}"]
  key_name                    = "${var.key_name}"
  subnet_id                   = "${var.subnet_id}"
  associate_public_ip_address = true
  source_dest_check           = false
  count                       = "${var.total_instances}"
  user_data                   = "${format("%s\n%s",data.local_file.install_docker.content, data.template_file.user_data.rendered)}"

  tags = {
    Name = "${format("%s-%02d", var.name, count.index + 1)}"
    Type = "terraform"
  }
}
