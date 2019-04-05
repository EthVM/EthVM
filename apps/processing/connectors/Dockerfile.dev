FROM confluentinc/cp-kafka-connect:5.2.0

RUN confluent-hub install confluentinc/kafka-connect-jdbc:5.2.0 --no-prompt \
  # update postgres driver to resolve https://github.com/confluentinc/kafka-connect-jdbc/issues/494
  && rm /usr/share/confluent-hub-components/confluentinc-kafka-connect-jdbc/lib/postgresql-9.4-1206-jdbc41.jar \
  && wget -P /usr/share/confluent-hub-components/confluentinc-kafka-connect-jdbc/lib https://jdbc.postgresql.org/download/postgresql-9.4.1212.jre7.jar

