output "root_manager.id" {
  value = "${aws_instance.manager.id}"
}

output "root_manager.public_ip" {
  value = "${aws_instance.manager.public_ip}"
}

output "root_manager.private_ip" {
  value = "${aws_instance.manager.private_ip}"
}
