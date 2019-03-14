resource "aws_instance" "manager" {
  ami                         = "${var.ami}"
  availability_zone           = "${var.availability_zone}"
  instance_type               = "${var.instance_type}"
  security_groups             = ["${var.security_group}"]
  key_name                    = "${var.key_name}"
  subnet_id                   = "${var.subnet_id}"
  associate_public_ip_address = true
  source_dest_check           = false
  count                       = "${var.total_instances}"

  connection {
    type        = "ssh"
    user        = "ubuntu"
    private_key = "${file("${var.ssh_key_path}")}"
    timeout     = "${var.connection_timeout}"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update -y",
      "sudo DEBIAN_FRONTEND=noninteractive apt-get upgrade -yq",
      "sudo apt-get install apt-transport-https software-properties-common ca-certificates -y",
      "sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -",
      "sudo add-apt-repository \"deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable\"",
      "sudo apt-get update -y",
      "sudo apt-get install docker-ce -y",
      "sudo systemctl start docker && sudo systemctl enable docker",
    ]
  }

  tags = {
    Name = "swarm-master"
    Type = "terraform"
  }
}
