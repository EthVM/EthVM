FROM confluentinc/cp-kafka-connect-base

ENV COMPONENT=kafka-connect

ENV CONNECT_PLUGIN_PATH=/usr/share/java
ENV CONNECT_LOG4J_LOGGERS=kafka.controller=INFO,kafka.producer.async.DefaultEventHandler=INFO,state.change.logger=INFO,org.reflections=ERROR

ENV CONNECT_GROUP_ID=ethvm
ENV CONNECT_CONFIG_STORAGE_TOPIC=ethvm-config
ENV CONNECT_OFFSET_STORAGE_TOPIC=ethvm-offset
ENV CONNECT_STATUS_STORAGE_TOPIC=ethvm-status
ENV CONNECT_KEY_CONVERTER=org.apache.kafka.connect.json.JsonConverter
ENV CONNECT_VALUE_CONVERTER=org.apache.kafka.connect.json.JsonConverter
ENV CONNECT_INTERNAL_KEY_CONVERTER=org.apache.kafka.connect.json.JsonConverter
ENV CONNECT_INTERNAL_VALUE_CONVERTER=org.apache.kafka.connect.json.JsonConverter

RUN confluent-hub install confluentinc/kafka-connect-jdbc:5.1.2
