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

resource "aws_lb_listener_rule" "https_explorer" {
  listener_arn = aws_alb_listener.http_listener[0].arn
  priority     = 1
  count        = var.enable_ssl_cert ? 1 : 0

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.explorer.arn
  }

  condition {
    field  = "host-header"
    values = [var.explorer_url]
  }
}

resource "aws_lb_listener_rule" "https_api" {
  listener_arn = aws_alb_listener.http_listener[0].arn
  priority     = 2
  count        = var.enable_ssl_cert ? 1 : 0

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.explorer.arn
  }

  condition {
    field  = "host-header"
    values = [var.api_url]
  }
}


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

resource "aws_lb_listener_rule" "http_explorer" {
  listener_arn = aws_alb_listener.http_listener[0].arn
  priority     = 1
  count        = var.enable_ssl_cert ? 0 : 1

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.explorer.arn
  }

  condition {
    field  = "host-header"
    values = [var.explorer_url]
  }
}

resource "aws_lb_listener_rule" "http_api" {
  listener_arn = aws_alb_listener.http_listener[0].arn
  priority     = 2
  count        = var.enable_ssl_cert ? 0 : 1

  action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.explorer.arn
  }

  condition {
    field  = "host-header"
    values = [var.api_url]
  }
}

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
    port                = 80
    matcher             = "200-299"
  }

  tags = {
    name = "${var.swarm_id}-explorer-tg"
  }
}

resource "aws_alb_target_group_attachment" "explorer" {
  count            = var.alb_target_count
  target_group_arn = aws_alb_target_group.explorer.arn
  target_id        = var.alb_target_list[count.index]
  port             = 80
}

resource "aws_alb_target_group" "api" {
  name     = "${var.swarm_id}-api-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = var.alb_target_group_vpc_id

  health_check {
    enabled             = true
    healthy_threshold   = 3
    unhealthy_threshold = 10
    timeout             = 5
    interval            = 10
    path                = "/"
    port                = 3000
    matcher             = "200-299"
  }

  tags = {
    name = "${var.swarm_id}-explorer-tg"
  }
}

resource "aws_alb_target_group_attachment" "api" {
  count            = var.alb_target_count
  target_group_arn = aws_alb_target_group.explorer.arn
  target_id        = var.alb_target_list[count.index]
  port             = 3000
}
