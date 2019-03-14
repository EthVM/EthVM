resource "aws_security_group" "ingress-manager" {
  name   = "manager-sg"
  vpc_id = "${aws_vpc.docker-swarm-vpc.id}"

  ingress {
    cidr_blocks = [
      "0.0.0.0/0",
    ]

    from_port = 22
    to_port   = 22
    protocol  = "tcp"
  }

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["${aws_subnet.subnet-1.cidr_block}"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
