FROM boxfuse/flyway:6.0-alpine

# Switch to root user as base image changes it to flyway
USER root

# Env variables
ENV DOCKERIZE_VERSION v0.6.1

ENV FLYWAY_EDITION community
ENV FLYWAY_CONNECT_RETRIES 30

# Install dockerize
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Copy flyway conf
COPY ./flyway/flyway.tmpl.conf /flyway/conf/flyway.tmpl

# Copy JDBC Postgres driver
COPY ./drivers/ /flyway/drivers/

# Copy SQL migrations
COPY migrations /flyway/migrations/

# Restore original user back
USER flyway

ENTRYPOINT [ \
  "dockerize", \
  "-template", "/flyway/conf/flyway.tmpl:/flyway/conf/flyway.conf", \
  "/flyway/flyway" \
]

CMD ["-?"]
