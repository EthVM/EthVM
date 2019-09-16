data "template_file" "user_data" {
  template = file("${path.module}/scripts/user-data.sh")

  vars = {
    region        = var.aws_region
    access_key_id = var.aws_access_key
    secret_key_id = var.aws_secret_key
  }
}

data "template_file" "join_worker_swarm" {
  template = file("${path.module}/scripts/join-worker-swarm.sh")
  count    = var.num

  vars = {
    root_manager_private_ip = var.manager_private_ip
    join_token              = var.swarm_tokens["worker"]
    hostname                = "${var.name}-${count.index + 1}"
  }
}

resource "aws_instance" "workers" {
  ami                    = var.ami
  instance_type          = var.instance_type
  count                  = var.num
  availability_zone      = "${var.aws_region}${var.availability_zones[count.index]}"
  vpc_security_group_ids = var.security_groups
  subnet_id              = var.subnet_ids[count.index]
  key_name               = var.ssh_key_name
  source_dest_check      = false

  user_data = format(
    "%s\n%s",
    data.template_file.user_data.rendered,
    element(data.template_file.join_worker_swarm.*.rendered, count.index),
  )

  tags = {
    Name = format("%s-%s-%d", var.swarm_id, var.name, count.index + 1)
    Type = "terraform"
  }
}
