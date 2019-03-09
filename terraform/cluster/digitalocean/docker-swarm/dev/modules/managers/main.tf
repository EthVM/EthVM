data "template_file" "provision_first_manager" {
  template = "${file("${path.module}/scripts/provision-first-manager.sh")}"

  vars {
    docker_cmd   = "${var.docker_cmd}"
    availability = "${var.availability}"
  }
}

data "template_file" "provision_manager" {
  template = "${file("${path.module}/scripts/provision-manager.sh")}"

  vars {
    docker_cmd   = "${var.docker_cmd}"
    availability = "${var.availability}"
  }
}

resource "digitalocean_droplet" "manager" {
  ssh_keys           = "${var.ssh_keys}"
  image              = "${var.image}"
  region             = "${var.region}"
  size               = "${var.size}"
  private_networking = true
  backups            = "${var.backups}"
  ipv6               = false
  tags               = ["${var.tags}"]
  user_data          = "${var.user_data}"
  count              = "${var.total_instances}"
  name               = "${format("%s-%02d.%s", var.name, count.index + 1, var.region)}"

  connection {
    type        = "ssh"
    user        = "${var.provision_user}"
    private_key = "${file("${var.provision_ssh_key}")}"
    timeout     = "${var.connection_timeout}"
  }

  provisioner "file" {
    content     = "${data.template_file.provision_first_manager.rendered}"
    destination = "/tmp/provision-first-manager.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /tmp/provision-first-manager.sh",
      "if [ ${count.index} -eq 0 ]; then /tmp/provision-first-manager.sh ${self.ipv4_address_private}; fi",
    ]
  }

  provisioner "remote-exec" {
    when = "destroy"

    inline = [
      "timeout 25 docker swarm leave --force",
    ]

    on_failure = "continue"
  }
}

# Optionally expose Docker API using certificates
resource "null_resource" "manager_api_access" {
  count = "${var.remote_api_key == "" || var.remote_api_certificate == "" || var.remote_api_ca == "" ? 0 : var.total_instances}"

  triggers {
    cluster_instance_ids = "${join(",", digitalocean_droplet.manager.*.id)}"
    certificate          = "${md5(file("${var.remote_api_certificate}"))}"
  }

  connection {
    host        = "${element(digitalocean_droplet.manager.*.ipv4_address, count.index)}"
    type        = "ssh"
    user        = "${var.provision_user}"
    private_key = "${file("${var.provision_ssh_key}")}"
    timeout     = "${var.connection_timeout}"
  }

  provisioner "remote-exec" {
    inline = [
      "mkdir -p ~/.docker",
    ]
  }

  provisioner "file" {
    source      = "${var.remote_api_ca}"
    destination = "~/.docker/ca.pem"
  }

  provisioner "file" {
    source      = "${var.remote_api_certificate}"
    destination = "~/.docker/server-cert.pem"
  }

  provisioner "file" {
    source      = "${var.remote_api_key}"
    destination = "~/.docker/server-key.pem"
  }

  provisioner "file" {
    source      = "${path.module}/scripts/certs/default.sh"
    destination = "~/.docker/install_certificates.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x ~/.docker/install_certificates.sh",
      "~/.docker/install_certificates.sh",
    ]
  }
}

data "external" "swarm_tokens" {
  program    = ["bash", "${path.module}/scripts/get-swarm-join-tokens.sh"]
  depends_on = ["null_resource.manager_api_access"]

  query = {
    host        = "${element(digitalocean_droplet.manager.*.ipv4_address, 0)}"
    user        = "${var.provision_user}"
    private_key = "${var.provision_ssh_key}"
  }
}

resource "null_resource" "bootstrap" {
  count      = "${var.total_instances}"
  depends_on = ["null_resource.manager_api_access"]

  triggers {
    cluster_instance_ids = "${join(",", digitalocean_droplet.manager.*.id)}"
  }

  connection {
    host        = "${element(digitalocean_droplet.manager.*.ipv4_address, count.index)}"
    type        = "ssh"
    user        = "${var.provision_user}"
    private_key = "${file("${var.provision_ssh_key}")}"
    timeout     = "${var.connection_timeout}"
  }

  provisioner "file" {
    content     = "${data.template_file.provision_manager.rendered}"
    destination = "/tmp/provision-manager.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /tmp/provision-manager.sh",
      "/tmp/provision-manager.sh ${digitalocean_droplet.manager.0.ipv4_address_private} ${lookup(data.external.swarm_tokens.result, "manager")}",
    ]
  }
}
