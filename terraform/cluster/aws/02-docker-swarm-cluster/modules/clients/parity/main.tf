data "template_file" "start_parity" {
  template = "${file("${path.module}/scripts/start-parity.sh")}"

  vars = {
    ethstats_secret = "${var.ethstats_secret}"
    ethstats_server = "${var.ethstats_server}"
    client_image    = "${var.client_image}"
  }
}

data "local_file" "setup" {
  filename = "${path.module}/scripts/setup.sh"
}

data "local_file" "install_docker" {
  filename = "${path.module}/scripts/install-docker.sh"
}

resource "aws_instance" "parity_client" {
  ami                    = "${var.ami}"
  availability_zone      = "${var.availability_zone}"
  instance_type          = "${var.instance_type}"
  vpc_security_group_ids = ["${var.security_group}"]
  key_name               = "${var.key_name}"
  subnet_id              = "${var.subnet_id}"
  source_dest_check      = false

  user_data = "${format("%s\n%s\n%s",data.local_file.setup.content, data.local_file.install_docker.content, data.template_file.start_parity.rendered)}"

  ebs_block_device {
    device_name           = "/dev/xvdh"
    volume_size           = "${var.volume_size}"
    volume_type           = "io1"
    iops                  = "${var.volume_iops}"
    delete_on_termination = true
  }

  tags = {
    Name = "${format("Parity-Client-%s", var.name)}"
    Type = "terraform"
  }
}
