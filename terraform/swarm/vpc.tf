locals {
  vpc_cidr = "10.0.0.0/16"
}

resource "aws_vpc" "vpc" {
  cidr_block           = local.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.swarm_id}-vpc"
  }
}

resource "aws_subnet" "bastion" {
  cidr_block        = "10.0.0.0/28"
  vpc_id            = aws_vpc.vpc.id
  availability_zone = "${var.aws_region}${var.bastion_zone}"

  tags = {
    Name = "${var.swarm_id}-subnet"
  }
}

resource "aws_subnet" "managers" {
  vpc_id            = aws_vpc.vpc.id
  count             = length(var.manager_availability_zones)
  cidr_block        = cidrsubnet(local.vpc_cidr, 8, count.index + 1)
  availability_zone = "${var.aws_region}${var.manager_availability_zones[count.index]}"

  tags = {
    Name = "${var.swarm_id}-manager-subnet-${count.index + 1}"
  }
}

resource "aws_subnet" "workers" {
  vpc_id            = aws_vpc.vpc.id
  count             = length(var.worker_availability_zones)
  cidr_block        = cidrsubnet(local.vpc_cidr, 8, count.index + 11)
  availability_zone = "${var.aws_region}${var.worker_availability_zones[count.index]}"

  tags = {
    Name = "${var.swarm_id}-worker-subnet-${count.index + 1}"
  }
}

resource "aws_subnet" "public_workers" {
  vpc_id            = aws_vpc.vpc.id
  count             = length(var.worker_availability_zones)
  cidr_block        = cidrsubnet(local.vpc_cidr, 8, count.index + 51)
  availability_zone = "${var.aws_region}${var.worker_availability_zones[count.index]}"

  tags = {
    Name = "${var.swarm_id}-public-workers-subnet-${count.index + 1}"
  }
}

resource "aws_eip" "bastion_ip" {
  instance = module.bastion.bastion_id
  vpc      = true

  tags = {
    Name = "${var.swarm_id}-bastion-ip"
  }
}

resource "aws_eip" "nat_ip" {
  vpc = true

  tags = {
    Name = "${var.swarm_id}-nat-ip"
  }
}

resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "${var.swarm_id}-internet-gateway"
  }
}

resource "aws_nat_gateway" "nat_gateway_internal_to_external" {
  allocation_id = aws_eip.nat_ip.id
  subnet_id     = aws_subnet.bastion.id

  tags = {
    Name = "${var.swarm_id}-internal-to-external-nat-gateway"
  }
}

resource "aws_route_table" "workers_to_world" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat_gateway_internal_to_external.id
  }

  tags = {
    Name = "${var.swarm_id}-workers-to-world"
  }
}

resource "aws_route_table" "managers_to_world" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_nat_gateway.nat_gateway_internal_to_external.id
  }

  tags = {
    Name = "${var.swarm_id}-route-managers-to-world"
  }
}

resource "aws_route_table" "bastion_to_world" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_internet_gateway.internet_gateway.id
  }

  tags = {
    Name = "${var.swarm_id}-route-bastion-to-world"
  }
}

resource "aws_route_table" "route_table_lb_to_world" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_internet_gateway.internet_gateway.id
  }

  tags = {
    Name = "${var.swarm_id}-route-table-lb-to-world"
  }
}

resource "aws_route_table_association" "subnet_association_bastion" {
  subnet_id      = aws_subnet.bastion.id
  route_table_id = aws_route_table.bastion_to_world.id
}

resource "aws_route_table_association" "subnet_association_managers" {
  count          = length(var.manager_availability_zones)
  subnet_id      = aws_subnet.managers.*.id[count.index]
  route_table_id = aws_route_table.managers_to_world.id
}

resource "aws_route_table_association" "subnet_association_workers" {
  count          = length(var.worker_availability_zones)
  subnet_id      = aws_subnet.workers.*.id[count.index]
  route_table_id = aws_route_table.workers_to_world.id
}

resource "aws_route_table_association" "subnet_association_public_workers" {
  count          = length(var.worker_availability_zones)
  subnet_id      = aws_subnet.public_workers.*.id[count.index]
  route_table_id = aws_route_table.workers_to_world.id
}
