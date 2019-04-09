data "template_file" "join_cluster_as_worker" {
  template = "${file("${path.module}/scripts/join.sh")}"

  vars {
    docker_cmd         = "${var.docker_cmd}"
    availability       = "${var.availability}"
    manager_private_ip = "${var.manager_private_ip}"
  }
}

resource "digitalocean_droplet" "node" {
  ssh_keys           = "${var.ssh_keys}"
  image              = "${var.image}"
  region             = "${var.region}"
  size               = "${var.size}"
  private_networking = true
  backups            = "${var.backups}"
  ipv6               = false
  user_data          = "${var.user_data}"
  tags               = ["${var.tags}"]
  count              = "${var.total_instances}"
  name               = "${format("%s-%02d.%s", var.name, count.index + 1, var.region)}"

  connection {
    type        = "ssh"
    user        = "${var.provision_user}"
    private_key = "${file("${var.provision_ssh_key}")}"
    timeout     = "${var.connection_timeout}"
  }

  provisioner "file" {
    content     = "${data.template_file.join_cluster_as_worker.rendered}"
    destination = "/tmp/join_cluster_as_worker.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /tmp/join_cluster_as_worker.sh",
      "/tmp/join_cluster_as_worker.sh ${var.join_token}",
    ]
  }

  provisioner "remote-exec" {
    when = "destroy"

    inline = [
      "docker swarm leave",
    ]

    on_failure = "continue"
  }
}
