resource "aws_instance" "bastion" {
  ami                         = var.ami
  availability_zone           = var.availability_zone
  instance_type               = var.instance_type
  vpc_security_group_ids      = [var.security_group]
  key_name                    = var.key_name
  subnet_id                   = var.subnet_id
  source_dest_check           = false
  associate_public_ip_address = true

  connection {
    host        = coalesce(self.public_ip, self.private_ip)
    type        = "ssh"
    user        = var.provision_user
    private_key = file(var.ssh_key_path)
    timeout     = var.connection_timeout
  }

  provisioner "file" {
    source      = "${path.module}/scripts/ssh-config"
    destination = "~/.ssh/config"
  }

  provisioner "file" {
    source      = var.ssh_key_path
    destination = "~/.ssh/key.pem"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod 400 ~/.ssh/key.pem",
      "sudo hostname bastion"
    ]
  }

  tags = {
    Name = format("%s-%s", var.swarm_id, var.name)
  }
}
