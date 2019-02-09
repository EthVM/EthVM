FROM traefik:1.7.3-alpine

ENV DOCKERIZE_VERSION v0.6.1

ENV ACME_EMAIL admin@myetherwallet.com
ENV ACME_STORAGE /var/lib/traefik/acme
ENV DEBUG true
ENV LOG_LEVEL DEBUG
ENV SWARM_MODE true



# Install dockerize

RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Add config

COPY traefik.toml.tmpl /etc/traefik/traefik.toml.tmpl

VOLUME ["/var/lib/traefik"]

EXPOSE 80
EXPOSE 443

ENTRYPOINT [ \
  "dockerize", \
  "-template", "/etc/traefik/traefik.toml.tmpl:/etc/traefik/traefik.toml", \
  "traefik" \
]
