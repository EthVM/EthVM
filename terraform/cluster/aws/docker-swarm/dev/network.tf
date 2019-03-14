resource "aws_vpc" "docker-swarm-vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags {
    Name = "docker-swarm"
  }
}

resource "aws_eip" "public-ip" {
  instance = "${module.managers.root_manager.id}"
  vpc      = true
}

resource "aws_internet_gateway" "internet-gateway" {
  vpc_id = "${aws_vpc.docker-swarm-vpc.id}"
}

resource "aws_subnet" "subnet-1" {
  cidr_block        = "10.0.0.0/24"
  vpc_id            = "${aws_vpc.docker-swarm-vpc.id}"
  availability_zone = "${var.region}a"
}

resource "aws_route_table" "route-table-external-to-master" {
  vpc_id = "${aws_vpc.docker-swarm-vpc.id}"

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = "${aws_internet_gateway.internet-gateway.id}"
  }
}

resource "aws_route_table_association" "subnet-association" {
  subnet_id      = "${aws_subnet.subnet-1.id}"
  route_table_id = "${aws_route_table.route-table-external-to-master.id}"
}
