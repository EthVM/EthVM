resource "aws_security_group" "ingress-manager" {
  name   = "manager-sg"
  vpc_id = "${aws_vpc.docker-swarm-vpc.id}"

  ingress {
    cidr_blocks = "${var.allowed_inbound_ssh}"

    from_port = 22
    to_port   = 22
    protocol  = "tcp"
  }

  ingress {
    cidr_blocks = "${var.allowed_inbound_ssh}"

    from_port = 9090  //prometheus, alertmanager, unsee
    to_port   = 9094
    protocol  = "tcp"
  }

  ingress {
    cidr_blocks = "${var.allowed_inbound_ssh}"

    from_port = 3000  //grafana
    to_port   = 3000
    protocol  = "tcp"
  }

  ingress {
    cidr_blocks = "${var.allowed_inbound_ssh}"

    from_port = 3030  //ethstats
    to_port   = 3030
    protocol  = "tcp"
  }

  ingress {
    cidr_blocks = "${var.allowed_inbound_ssh}"

    from_port = 9991  //lenses
    to_port   = 9991
    protocol  = "tcp"
  }

  ingress {
    cidr_blocks = "${var.allowed_inbound_ssh}"

    from_port = 9021  //kafka-control-center
    to_port   = 9021
    protocol  = "tcp"
  }

  ingress {
    cidr_blocks = "${var.allowed_inbound_ssh}"

    from_port = 9022  //kafka-connect-ui
    to_port   = 9022
    protocol  = "tcp"
  }

  ingress {
    cidr_blocks = ["${aws_subnet.subnet-workers.cidr_block}", "${aws_subnet.subnet-managers.cidr_block}"]
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
  }

  ingress {
    cidr_blocks = ["${aws_subnet.subnet-workers.cidr_block}", "${aws_subnet.subnet-managers.cidr_block}"]
    from_port   = 0
    to_port     = 65535
    protocol    = "udp"
  }

  ingress {
    from_port   = -1
    to_port     = -1
    protocol    = "icmp"
    cidr_blocks = ["${aws_subnet.subnet-workers.cidr_block}", "${aws_subnet.subnet-managers.cidr_block}"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "ingress-worker" {
  name   = "worker-sg"
  vpc_id = "${aws_vpc.docker-swarm-vpc.id}"

  ingress {
    cidr_blocks = ["${aws_subnet.subnet-managers.cidr_block}"]
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
  }

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["${aws_subnet.subnet-managers.cidr_block}", "${aws_subnet.subnet-workers.cidr_block}"]
  }

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "udp"
    cidr_blocks = ["${aws_subnet.subnet-managers.cidr_block}", "${aws_subnet.subnet-workers.cidr_block}"]
  }

  ingress {
    from_port   = -1
    to_port     = -1
    protocol    = "icmp"
    cidr_blocks = ["${aws_subnet.subnet-managers.cidr_block}"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "efs" {
  vpc_id = "${aws_vpc.docker-swarm-vpc.id}"

  ingress {
    from_port = 2049
    to_port   = 2049
    protocol  = "tcp"

    cidr_blocks = ["${aws_subnet.subnet-managers.cidr_block}", "${aws_subnet.subnet-workers.cidr_block}"]
  }

  egress {
    from_port = 2049
    to_port   = 2049
    protocol  = "tcp"

    cidr_blocks = ["${aws_subnet.subnet-managers.cidr_block}", "${aws_subnet.subnet-workers.cidr_block}"]
  }

  tags {
    Name = "allow_nfs-workers-managers"
  }
}
