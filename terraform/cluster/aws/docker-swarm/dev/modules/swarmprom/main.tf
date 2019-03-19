data "template_file" "swarmprom-install" {
  template = "${file("${path.module}/scripts/install-swarmprom.sh")}"

  vars = {
    admin_user     = "${var.admin_user}"
    admin_password = "${var.admin_password}"
    slack_token    = "${var.slack_token}"
    slack_channel  = "${var.slack_channel}"
    slack_user     = "${var.slack_user}"
  }
}

resource "null_resource" "swarmprom-install" {
  connection {
    type        = "ssh"
    host        = "${var.host}"
    user        = "${var.provision_user}"
    private_key = "${file("${var.ssh_key_path}")}"
    timeout     = "${var.connection_timeout}"
  }

  provisioner "file" {
    content     = "${data.template_file.swarmprom-install.rendered}"
    destination = "/tmp/swarmprom-install.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /tmp/swarmprom-install.sh",
      "sudo /tmp/swarmprom-install.sh",
    ]
  }
}
