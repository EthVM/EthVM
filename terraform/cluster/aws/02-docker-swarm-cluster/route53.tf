resource "aws_route53_zone" "ethvm" {
  name = "ethvm"

  vpc {
    vpc_id = "${aws_vpc.docker-swarm-vpc.id}"
  }

  tags {
    Name = "ethvm hosted zone"
  }
}

resource "aws_route53_record" "eth_client" {
  zone_id = "${aws_route53_zone.ethvm.zone_id}"
  name    = "ethclient.ethvm"
  type    = "A"
  ttl     = "30"

  records = [
    "${module.ethclient.private_ip}",
  ]
}

resource "aws_route53_record" "manager" {
  zone_id = "${aws_route53_zone.ethvm.zone_id}"
  name    = "manager.ethvm"
  type    = "A"
  ttl     = "30"

  records = [
    "${module.managers.root_manager.private_ip}",
  ]
}

resource "aws_route53_record" "efs" {
  zone_id = "${aws_route53_zone.ethvm.zone_id}"
  name    = "efs.ethvm"
  type    = "CNAME"
  ttl     = "30"

  records = [
    "${module.efs.mount_target_dns}",
  ]
}
