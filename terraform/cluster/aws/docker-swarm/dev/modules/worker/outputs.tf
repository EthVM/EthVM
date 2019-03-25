output "worker.ips" {
  value = "${aws_instance.workers.*.private_ip}"
}
