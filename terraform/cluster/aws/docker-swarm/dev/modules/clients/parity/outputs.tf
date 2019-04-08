output "private_ip" {
  value = "${aws_instance.parity_client.private_ip}"
}
