resource "kubernetes_config_map" "redis_config_map" {
  metadata {
    name = "redis-health"

    labels {
      app = "redis"
    }
  }

  data {
    "ping_local.sh" = "${file("${path.module}/ping_local.sh")}"

    "ping_master.sh" = "${file("${path.module}/ping_master.sh")}"

    "ping_local_and_master.sh" = "${file("${path.module}/ping_local_master.sh")}"
  }
}

resource "kubernetes_service" "redis_master_service" {
  metadata {
    name = "redis-master"

    labels {
      app = "redis"
    }
  }

  spec {
    selector {
      app  = "redis"
      role = "master"
    }

    type = "ClusterIP"

    port {
      name        = "redis"
      port        = 6379
      target_port = 6379
    }
  }
}

resource "kubernetes_stateful_set" "redis_stateful_set" {
  metadata {
    name = "redis-master"

    labels {
      app = "redis"
    }
  }

  spec {
    selector {
      role = "master"
      app  = "redis"
    }

    replicas     = 1
    service_name = "redis-master"

    update_strategy {
      type = "RollingUpdate"
    }

    template {
      metadata {
        labels {
          role = "master"
          app  = "redis"
        }
      }

      spec {
        security_context {
          fs_group    = 1001
          run_as_user = 1001
        }

        service_account_name = "default"

        init_container {
          name              = "volume-permissions"
          image             = "docker.io/bitnami/minideb:latest"
          image_pull_policy = "IfNotPresent"

          command = [
            "/bin/chown",
            "-R",
            "1001:1001",
            "/bitnami/redis/data",
          ]

          security_context {
            run_as_user = 0
          }

          volume_mount {
            name       = "data"
            mount_path = "/bitnami/redis/data"
          }
        }

        container {
          name              = "redis"
          image             = "docker.io/bitnami/redis:${var.redis_version}"
          image_pull_policy = "IfNotPresent"

          env {
            name  = "REDIS_REPLICATION_MODE"
            value = "master"
          }

          env {
            name  = "ALLOW_EMPTY_PASSWORD"
            value = "yes"
          }

          env {
            name  = "REDIS_PORT"
            value = "6379"
          }

          env {
            name  = "REDIS_DISABLE_COMMANDS"
            value = "FLUSHDB,FLUSHALL"
          }

          port {
            name           = "redis"
            container_port = 6379
          }

          liveness_probe {
            initial_delay_seconds = 30
            period_seconds        = 10
            timeout_seconds       = 5
            success_threshold     = 1
            failure_threshold     = 5

            exec {
              command = [
                "sh",
                "-c",
                "/health/ping_local.sh",
              ]
            }
          }

          readiness_probe {
            initial_delay_seconds = 5
            period_seconds        = 10
            timeout_seconds       = 1
            success_threshold     = 1
            failure_threshold     = 5

            exec {
              command = [
                "sh",
                "-c",
                "/health/ping_local.sh",
              ]
            }
          }

          volume_mount {
            name       = "health"
            mount_path = "/health"
          }

          volume_mount {
            name       = "data"
            mount_path = "/bitnami/redis/data"
          }
        }

        volume {
          name = "health"

          config_map {
            name         = "redis-health"
            default_mode = 0755
          }
        }
      }
    }

    volume_claim_templates {
      metadata {
        name = "data"
      }

      spec {
        storage_class_name = "${var.redis_storage_type}"
        access_modes       = ["ReadWriteOnce"]

        resources {
          requests {
            storage = "${var.redis_storage_size}"
          }
        }
      }
    }
  }
}
