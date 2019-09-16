data "external" "swarm_tokens" {
  program = ["bash", "${path.module}/scripts/get-swarm-join-tokens.sh"]

  query = {
    host        = aws_instance.manager.private_ip
    user        = var.provision_user
    private_key = var.ssh_key_path
    bastion     = var.bastion_host
  }
}

data "template_file" "provision_manager" {
  template = file("${path.module}/scripts/provision-manager.sh")
  count    = var.num - 1

  vars = {
    root_manager_private_ip = aws_instance.manager.private_ip
    join_token              = data.external.swarm_tokens.result["manager"]
    manager_id              = count.index + 2
  }
}

data "template_file" "user_data" {
  template = file("${path.module}/scripts/user-data.sh")

  vars = {
    region        = var.aws_region
    access_key_id = var.aws_access_key
    secret_key_id = var.aws_secret_key
  }
}

resource "aws_instance" "manager" {
  ami                    = var.ami
  instance_type          = var.instance_type
  availability_zone      = "${var.aws_region}${var.availability_zones[0]}"
  vpc_security_group_ids = var.security_groups
  subnet_id              = var.subnet_id[0]
  key_name               = var.ssh_key_name
  source_dest_check      = false
  user_data              = format("%s", data.template_file.user_data.rendered)

  connection {
    type                = "ssh"
    host                = aws_instance.manager.private_ip
    bastion_host        = var.bastion_host
    bastion_user        = var.provision_user
    bastion_private_key = file(var.ssh_key_path)
    user                = var.provision_user
    private_key         = file(var.ssh_key_path)
    timeout             = var.connection_timeout
  }

  provisioner "file" {
    source      = "${path.module}/scripts/ssh-config"
    destination = "~/.ssh/config"
  }

  provisioner "file" {
    source      = "${path.module}/scripts/provision-first-manager.sh"
    destination = "/tmp/provision-first-manager.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /tmp/provision-first-manager.sh",
      "sudo /tmp/provision-first-manager.sh ${self.private_ip}",
    ]
  }

  tags = {
    Name = format("%s-%s-%d", var.swarm_id, var.name, 1)
  }
}

resource "aws_instance" "secondary_manager" {
  depends_on             = [aws_instance.manager]
  ami                    = var.ami
  instance_type          = var.instance_type
  count                  = var.num - 1
  availability_zone      = "${var.aws_region}${var.availability_zones[count.index + 1]}"
  vpc_security_group_ids = var.security_groups
  subnet_id              = var.subnet_id[count.index + 1]
  key_name               = var.ssh_key_name
  source_dest_check      = false
  user_data = format(
    "%s\n%s",
    data.template_file.user_data.rendered,
    element(data.template_file.provision_manager.*.rendered, count.index)
  )

  tags = {
    Name = format("%s-%s-%d", var.swarm_id, var.name, count.index + 2)
  }
}
