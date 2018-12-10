output "lb_ip" {
  value = "${kubernetes_service.traefik_service.load_balancer_ingress.0.ip}"
}
