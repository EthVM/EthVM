output "user_id" {
  value = aws_iam_access_key.user.id
}

output "user_secret" {
  value = aws_iam_access_key.user.secret
}
