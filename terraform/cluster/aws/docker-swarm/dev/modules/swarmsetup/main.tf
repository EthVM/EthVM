data "template_file" "setup-swarm" {
  template = "${file("${path.module}/scripts/setup-swarm.sh")}"

  vars = {
    admin_user      = "${var.admin_user}"
    admin_password  = "${var.admin_password}"
    slack_token     = "${var.slack_token}"
    slack_channel   = "${var.slack_channel}"
    slack_user      = "${var.slack_user}"
    ethstats_secret = "${var.ethstats_secret}"
  }
}

resource "null_resource" "setup-swarm" {
  connection {
    type        = "ssh"
    host        = "${var.host}"
    user        = "${var.provision_user}"
    private_key = "${file("${var.ssh_key_path}")}"
    timeout     = "${var.connection_timeout}"
  }

  provisioner "file" {
    content     = "${data.template_file.setup-swarm.rendered}"
    destination = "/tmp/setup-swarm.sh"
  }

  provisioner "file" {
    source      = "${path.module}/scripts/swarm-aws.yml"
    destination = "/tmp/swarm-aws.yml"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /tmp/setup-swarm.sh",
      "sudo /tmp/setup-swarm.sh",
    ]
  }
}

# resource "null_resource" "ethvm-install" {
#   connection {
#     type        = "ssh"
#     host        = "${var.host}"
#     user        = "${var.provision_user}"
#     private_key = "${file("${var.ssh_key_path}")}"
#     timeout     = "${var.connection_timeout}"
#   }


#   provisioner "file" {
#     source      = "${path.module}/scripts/swarm-aws.yml"
#     destination = "~/swarm-aws.yml"
#   }
# }

