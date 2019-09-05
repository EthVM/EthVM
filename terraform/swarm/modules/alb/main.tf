resource "aws_alb" "alb" {
  name               = var.alb_name
  subnets            = var.alb_subnets
  security_groups    = [var.alb_security_group]
  internal           = false
  load_balancer_type = "application"

  tags = {
    Name = var.alb_name
  }
}

# ---
#  HTTPS: Enabled
# ---

resource "aws_alb_listener" "https_listener" {
  load_balancer_arn = aws_alb.alb.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.ssl_cert_arn
  count             = var.enable_ssl_cert ? 1 : 0

  default_action {
    target_group_arn = aws_alb_target_group.explorer.arn
    type             = "forward"
  }
}

resource "aws_lb_listener" "http_redirect_to_https" {
  load_balancer_arn = aws_alb.alb.arn
  port              = "80"
  protocol          = "HTTP"
  count             = var.enable_ssl_cert ? 1 : 0

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# ---

# ---
#  HTTPS: Disabled
# ---

resource "aws_alb_listener" "http_listener" {
  load_balancer_arn = aws_alb.alb.arn
  port              = "80"
  protocol          = "HTTP"
  count             = var.enable_ssl_cert ? 0 : 1

  default_action {
    target_group_arn = aws_alb_target_group.explorer.arn
    type             = "forward"
  }
}

# ---

# ---
#  Target groups
# ---

resource "aws_alb_target_group" "explorer" {
  name     = "${var.swarm_id}-explorer-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = var.alb_target_group_vpc_id

  health_check {
    enabled             = true
    healthy_threshold   = 3
    unhealthy_threshold = 10
    timeout             = 5
    interval            = 10
    path                = "/ping"
    port                = 81
    matcher             = "200"
  }

  tags = {
    name = "${var.swarm_id}-explorer-tg"
  }
}

// resource "aws_lb_listener_rule" "explorer" {
//   listener_arn = aws_alb.alb.arn
//   priority     = 1

//   action {
//     type             = "forward"
//     target_group_arn = aws_alb_target_group.explorer.arn
//   }

//   condition {
//     field  = "host-header"
//     values = ["ethvm.dev"]
//   }
// }

resource "aws_alb_target_group_attachment" "explorer" {
  count            = var.alb_target_count
  target_group_arn = aws_alb_target_group.explorer.arn
  target_id        = var.alb_target_list[count.index]
  port             = 80
}
