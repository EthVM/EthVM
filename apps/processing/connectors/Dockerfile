FROM zenika/kotlin:1.3.10-jdk8-slim as builder

# Create workdir
RUN mkdir -p /tmp
WORKDIR /tmp

# Install deps
RUN apt update && \
  apt install -y wget && \
  apt clean && \
  apt autoremove

# Copy code
COPY . .

# Give execution perms && build
RUN chmod +x /tmp/gradlew && \
  /tmp/gradlew --no-daemon shadowJar

FROM confluentinc/cp-kafka-connect:5.2.0

# update postgres driver to resolve https://github.com/confluentinc/kafka-connect-jdbc/issues/494
RUN confluent-hub install confluentinc/kafka-connect-jdbc:5.2.2 --no-prompt \
  && rm /usr/share/confluent-hub-components/confluentinc-kafka-connect-jdbc/lib/postgresql-9.4-1206-jdbc41.jar \
  && wget -P /usr/share/confluent-hub-components/confluentinc-kafka-connect-jdbc/lib https://jdbc.postgresql.org/download/postgresql-9.4.1212.jre7.jar \
  && mkdir -p /usr/share/ethvm

COPY --from=builder /tmp/connectors/sinks/jdbc/build/libs/jdbc.jar /usr/share/ethvm/
COPY --from=builder /tmp/connectors/sources/eth-tokens-list/build/libs/eth-tokens-list.jar /usr/share/ethvm/
COPY --from=builder /tmp/connectors/sources/exchanges/build/libs/exchanges.jar /usr/share/ethvm/
COPY --from=builder /tmp/connectors/sources/web3/build/libs/web3.jar /usr/share/ethvm/
