output "bastion_ip" {
  value = aws_eip.bastion_ip.public_ip
}
