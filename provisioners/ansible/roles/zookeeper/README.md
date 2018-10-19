![Logo](logo.gif)

# Apache ZooKeeper Ansible role [![Build Status](https://travis-ci.org/idealista/zookeeper-role.png)](https://travis-ci.org/idealista/zookeeper-role)

This ansible role installs an Apache ZooKeeper service in a debian environment.

- [Getting Started](#getting-started)
	- [Prerequisities](#prerequisities)
	- [Installing](#installing)
- [Usage](#usage)
- [Testing](#testing)
- [Built With](#built-with)
- [Versioning](#versioning)
- [Authors](#authors)
- [License](#license)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)

## Getting Started

These instructions will get you a copy of the role for your ansible playbook. Once launched, it will install an Apache ZooKeeper server.

### Prerequisities

Ansible 2.4.2.0 version installed.
Molecule 1.25 version installed.
Ansible-lint 3.4.15 version installed.
Inventory destination should be a Debian environment.

Notice that automatically java is installed as dependency.

For testing purposes, [Molecule](https://molecule.readthedocs.io/) with [Vagrant](https://www.vagrantup.com/) as driver (with [hostmanager](https://github.com/devopsgroup-io/vagrant-hostmanager) plugin) and [VirtualBox](https://www.virtualbox.org/) as provider.

### Installing

Create or add to your roles dependency file (e.g requirements.yml):

```
- src: idealista.zookeeper-role
  version: 1.0.0
  name: zookeeper
```

Install the role with ansible-galaxy command:

```
ansible-galaxy install -p roles -r requirements.yml -f
```

Use in a playbook:

```
---
- hosts: someserver
  roles:
    - { role: zookeeper
      }
```

## Usage

To set multiple versions

```
zookeeper_hosts:
  - host: zookeeper1
    id: 1
  - host: zookeeper2
    id: 2
  - host: zookeeper3
    id: 3
```

## Testing

```
molecule test
```

## Built With

![Ansible](https://img.shields.io/badge/ansible-2.4.0.0-green.svg)

## Versioning

For the versions available, see the [tags on this repository](https://github.com/idealista/zookeeper-role/tags).

Additionaly you can see what change in each version in the [CHANGELOG.md](CHANGELOG.md) file.

## Authors

* **Idealista** - *Work with* - [idealista](https://github.com/idealista)

See also the list of [contributors](https://github.com/idealista/zookeeper-role/contributors) who participated in this project.

## License

![Apache 2.0 Licence](https://img.shields.io/hexpm/l/plug.svg)

This project is licensed under the [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0) license - see the [LICENSE](LICENSE) file for details.

## Contributing

Please read [CONTRIBUTING.md](.github/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.
