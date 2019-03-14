output "root_manager.id" {
  value = "${aws_instance.manager.id}"
}

output "root_manager.public_ip" {
  value = "${aws_instance.manager.public_ip}"
}
