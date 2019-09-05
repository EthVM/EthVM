resource "aws_security_group" "loadbalancer" {
  name   = "${var.swarm_id}-loadbalancer-sg"
  vpc_id = aws_vpc.vpc.id

  ingress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
  }

  ingress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
  }

  egress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
  }

  tags = {
    Name = "${var.swarm_id}-loadbalancer-sg"
  }
}

resource "aws_security_group" "bastion" {
  name   = "${var.swarm_id}-bastion-sg"
  vpc_id = aws_vpc.vpc.id

  ingress {
    cidr_blocks = var.allowed_inbound_ssh
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
  }

  egress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
  }

  tags = {
    Name = "${var.swarm_id}-bastion-sg"
  }
}

resource "aws_security_group" "managers" {
  name   = "${var.swarm_id}-manager-sg"
  vpc_id = aws_vpc.vpc.id

  ingress {
    cidr_blocks = [aws_subnet.bastion.cidr_block]
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
  }

  ingress {
    cidr_blocks = concat(aws_subnet.workers.*.cidr_block, aws_subnet.managers.*.cidr_block)
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
  }

  ingress {
    cidr_blocks = concat(aws_subnet.workers.*.cidr_block, aws_subnet.managers.*.cidr_block)
    from_port   = 0
    to_port     = 65535
    protocol    = "udp"
  }

  ingress {
    cidr_blocks = aws_subnet.public_workers.*.cidr_block
    from_port   = 80
    to_port     = 81
    protocol    = "tcp"
  }

  ingress {
    cidr_blocks = concat(aws_subnet.workers.*.cidr_block, aws_subnet.managers.*.cidr_block)
    from_port   = -1
    to_port     = -1
    protocol    = "icmp"
  }

  egress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
  }

  tags = {
    Name = "${var.swarm_id}-managers-sg"
  }
}

resource "aws_security_group" "workers" {
  name   = "${var.swarm_id}-worker-sg"
  vpc_id = aws_vpc.vpc.id

  ingress {
    cidr_blocks = [aws_subnet.bastion.cidr_block]
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
  }

  ingress {
    cidr_blocks = concat(aws_subnet.managers.*.cidr_block, aws_subnet.workers.*.cidr_block)
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
  }

  ingress {
    cidr_blocks = concat(aws_subnet.managers.*.cidr_block, aws_subnet.workers.*.cidr_block)
    from_port   = 0
    to_port     = 65535
    protocol    = "udp"
  }

  ingress {
    cidr_blocks = aws_subnet.managers.*.cidr_block
    from_port   = -1
    to_port     = -1
    protocol    = "icmp"
  }

  egress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
  }

  tags = {
    Name = "${var.swarm_id}-workers-sg"
  }
}
