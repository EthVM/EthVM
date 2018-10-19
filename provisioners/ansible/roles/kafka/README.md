# Ansible Kafka

[![Build Status](https://travis-ci.org/jaytaylor/ansible-kafka.svg?branch=master)](https://travis-ci.org/jaytaylor/ansible-kafka)
[![Galaxy](https://img.shields.io/badge/galaxy-jaytaylor.kafka-blue.svg)](https://galaxy.ansible.com/list#/roles/4083)

An ansible role to install and configure [kafka](https://kafka.apache.org/) distributed pub/sub messaging queue clusters.


## How to get it

Add to your playbooks requirements.yml:

    - src: https://github.com/jaytaylor/ansible-kafka

and then run:

    ansible-galaxy install -r requirements.yml --ignore-errors

Or if you just want to grab this role and start using it:

    cd my-playbook-folder/roles
    git clone https://github.com/jaytaylor/ansible-kafka.git
    cd -

## How to use it

Once the role is installed, configure it from your playbook file (e.g. playbook.yml).

Example:

```yml
    ---
    - hosts: [all]
      roles:
        - {
          role: "ansible-kafka",
          kafka_hosts: "{{ groups.kafka | list }}",
          kafka_zookeeper_hosts: "{{ zookeeper_hosts | list }}"
          kafka_version: 0.11.0.2,     # Kafka version override.
          kafka_scala_serverion: 2.10 # Scala version override.
        }
```

Where `kafka_hosts` and `zookeeper_hosts` are both defined variables
(e.g. in group_vars/all), and contain the list of hosts to use.

## Important Note

If you are using this role from the ansible-galaxy website, make sure you use "jaytaylor.kafka" for the role name (rather than "ansible-kafka").

## Role variables

- `kafka_hosts` - list of hosts in the cluster.
- `kafka_zookeeper_hosts` - list of zookeeper hosts for the cluster.
- `kafka_broker_id` - Integer uniquely identifying the broker, by default one will be generated for you either by this role or by kafka itself for versions >= 0.9.
- `kafka_generate_broker_id` - Flag controlling whether to generate a broker id, defaults to `yes`.
- `kafka_server_defaults` - Default Kafka server settings. This variable shoulnd't usually be changed.
- `kafka_producer_defaults` - Default Kafka producer settings. This variable shouldn't usually be changed.
- `kafka_server` - Allows to overwrite particular default server settings (from `kafka_server_defaults` variable). Values in this hash are combined with `kafka_server_defaults` variable.
- `kafka_producer` - Allows to overwrite particular default producer settings (from `kafka_producer_defaults` variable). Values in this hash are combined with `kafka_server_defaults` variable.
- `kafka_healthcheck_address` - If not defined, this will dynamicaly set to `kafka_server_defaults.host_name` or `kafka_server.host_name` if defined. Defaults to '127.0.0.1'
- `kafka_java_version` - Java version to install. Defaults to "openjdk-7-jre-headless"

## Version notes

Version 2.0.0 does not support Ansible versions lower than 2.2.

Before version 2.0.0, `server` and `producer` Ansible variables were used to configure Kafka Server and Kafka Producer respecively, but 2.0.0 introduced better variable scoping and better variable overwritting:

- `server` variable became `kafka_server`, so it is inside Kafka role "scope". It is a hash that is combined with `kafka_server_defaults` hash, overwriting the values defined in the former. This makes easier to overwrite just some particular setting, instead of rewritting the whole `server` variable hash jus tto change one setting.
- `producer` variable became `kafka_producer`, and it behaves now the same way as `kafka_server` variable. Also `kafka_producer_defaults` hash has the default values for producer.

Also:

- `healthcheck_address` became `kafka_healthcheck_address`, which improves its scope.
- `nofiles_limit` became `kafka_nofiles_limit`

## License

BSD

## Author

Jay Taylor

[@jtaylor](https://twitter.com/jtaylor) - [jaytaylor.com](http://jaytaylor.com) - [github](https://github.com/jaytaylor)
