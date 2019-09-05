resource "aws_route53_zone" "ethvm" {
  name = "lan"

  vpc {
    vpc_id = aws_vpc.vpc.id
  }

  tags = {
    Comment = "${var.swarm_id}-hosted-zone"
  }
}

resource "aws_route53_record" "primary_managers" {
  zone_id = aws_route53_zone.ethvm.zone_id
  name    = "manager-1"
  type    = "A"
  ttl     = "600"
  records = [module.managers.root_manager_private_ip]
}

resource "aws_route53_record" "secondary_manager" {
  zone_id = aws_route53_zone.ethvm.zone_id
  name    = format("%s-%d", "manager", count.index + 2)
  type    = "A"
  ttl     = "600"
  count   = var.manager_instances - 1
  records = [module.managers.secondary_managers_private_ips[count.index]]
}

resource "aws_route53_record" "web_workers" {
  zone_id = aws_route53_zone.ethvm.zone_id
  name    = format("%s-%d", "worker", count.index + 1)
  type    = "A"
  ttl     = "600"
  count   = var.web_worker_instances
  records = [module.web_workers.worker_ips[count.index]]
}

resource "aws_route53_record" "kafka_workers" {
  zone_id = aws_route53_zone.ethvm.zone_id
  name    = format("%s-%d", "kafka-worker", count.index + 1)
  type    = "A"
  ttl     = "600"
  count   = var.kafka_worker_instances
  records = [module.kafka_workers.worker_ips[count.index]]
}

resource "aws_route53_record" "storage_workers" {
  zone_id = aws_route53_zone.ethvm.zone_id
  name    = format("%s-%d", "storage-worker", count.index + 1)
  type    = "A"
  ttl     = "600"
  count   = var.storage_worker_instances
  records = [module.timescale_workers.worker_ips[count.index]]
}

resource "aws_route53_record" "processing_workers" {
  zone_id = aws_route53_zone.ethvm.zone_id
  name    = format("%s-%d", "processing-worker", count.index + 1)
  type    = "A"
  ttl     = "600"
  count   = var.processing_worker_instances
  records = [module.processing_workers.worker_ips[count.index]]
}
