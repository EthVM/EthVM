# Based on the work done by meenie:
# Url: https://github.com/kubernetes/charts/tree/master/stable/rethinkdb/init
#
# Differences:
#   - This image is based on Alpine instead of using Debian
#   - rethink-probe command is built without having to use other docker images (everything is self contained)
#   - Also, removed some assumptions about the default user in the rethink-probe command

# Use golang base image to build probe
FROM golang:1.10-alpine as builder

# Install dependencies
RUN apk add --no-cache \
  git \
  gcc \
  musl-dev

COPY ./rethink-probe /go/src/rethink-probe
WORKDIR /go/src/rethink-probe

RUN go get . \
  && go build -a -ldflags '-w -s' .

FROM alpine:3.8

COPY --from=builder /go/src/rethink-probe/rethink-probe /usr/local/bin/

RUN chmod +x /usr/local/bin/rethink-probe

# Install dependencies
RUN apk add --no-cache \
  jq \
  dumb-init \
  curl \
  rethinkdb

# Copy files
COPY ./run.sh /usr/local/bin/
RUN chmod u+x /usr/local/bin/run.sh

# Volumes
RUN mkdir /data
WORKDIR /data
VOLUME ["/data"]

# Expose
#     	process cluster webui
EXPOSE	28015   29015   8080

ENTRYPOINT ["dumb-init", "run.sh"]
