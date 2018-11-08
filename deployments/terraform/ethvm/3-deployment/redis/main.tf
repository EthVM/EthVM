resource "kubernetes_config_map" "redis_config_map" {
  metadata {
    name = "redis-health"

    labels {
      app = "redis"
    }
  }

  data {
    "ping_local.sh" = <<EOF
response=$(
  redis-cli \
  -h localhost \
  -p $REDIS_PORT \
  ping
)
if [ "$response" != "PONG" ]; then
  echo "$response"
  exit 1
fi
EOF

    "ping_master.sh" = <<EOF
response=$(
  redis-cli \
  -h $REDIS_MASTER_HOST \
  -p $REDIS_MASTER_PORT_NUMBER \
  ping
)
if [ "$response" != "PONG" ]; then
  echo "$response"
  exit 1
fi
EOF

    "ping_local_and_master.sh" = <<EOF
script_dir="$(dirname "$0")"
exit_status=0
"$script_dir/ping_local.sh" || exit_status=$?
"$script_dir/ping_master.sh" || exit_status=$?
exit $exit_status
EOF
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
                "\"/health/ping_local.sh\"",
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
                "\"/health/ping_local.sh\"",
              ]
            }
          }

          volume_mount {
            name       = "health"
            mount_path = "/health"
          }

          volume_mount {
            name       = "redis-data"
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
            name       = "redis-data"
            mount_path = "/bitnami/redis/data"
          }
        }
      }
    }

    volume_claim_templates {
      metadata {
        name = "redis-data"

        labels {
          app = "redis"
        }
      }

      spec {
        access_modes = ["ReadWriteOnce"]

        resources {
          requests {
            storage = "8Gi"
          }
        }
      }
    }
  }
}
