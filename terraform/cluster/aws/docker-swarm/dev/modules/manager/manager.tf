resource "aws_instance" "manager" {
  ami                         = "${var.ami}"
  availability_zone           = "${var.availability_zone}"
  instance_type               = "${var.instance_type}"
  security_groups             = ["${var.security_group}"]
  key_name                    = "${var.key_name}"
  subnet_id                   = "${var.subnet_id}"
  associate_public_ip_address = true
  source_dest_check           = false

  connection {
    type        = "ssh"
    user        = "${var.provision_user}"
    private_key = "${file("${var.ssh_key_path}")}"
    timeout     = "${var.connection_timeout}"
  }

  provisioner "file" {
    source      = "${path.module}/scripts/install-docker.sh"
    destination = "/tmp/install-docker.sh"
  }

  provisioner "file" {
    source      = "${path.module}/scripts/provision-first-manager.sh"
    destination = "/tmp/provision-first-manager.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /tmp/provision-first-manager.sh",
      "chmod +x /tmp/install-docker.sh",
      "sudo /tmp/install-docker.sh",
      "if [ ${count.index} -eq 0 ]; then /tmp/provision-first-manager.sh ${self.private_ip}; fi",
    ]
  }

  tags = {
    Name = "${format("%s-%02d", var.name, count.index + 1)}"
    Type = "terraform"
  }
}
