FROM mvertes/alpine-mongo:4.0.5-0

ENV DOCKERIZE_VERSION v0.6.1

ENV MONGO_STORAGE_CACHE_SIZE 3000
ENV MONGO_BIND_IP 0.0.0.0
ENV MONGO_REPL_SET ethvm-replicaset
ENV MONGO_SLOW_MS 10000

RUN apk add --no-cache mongodb-tools

# Install dockerize

RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Copy config

COPY --chown=mongodb:mongodb ./etc/mongod.conf /etc/mongod.conf

CMD [\
  "dockerize", \
  "-template", "/etc/mongod.conf", \
  "mongod", \
  "--config", "/etc/mongod.conf", \
  "--bind_ip", "{{ .Env.MONGO_BIND_IP }}", \
  "--replSet", "{{ .Env.MONGO_REPL_SET }}", \
  "--quiet", \
  "--slowms", "{{ .Env.MONGO_SLOW_MS }}" \
]
