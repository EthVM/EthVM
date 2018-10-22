.PHONY: up stop

all: create

create:
	@ansible-playbook -i hosts/inventory.ini gcp-ethvm-create.yaml

delete:
	@ansible-playbook -i hosts/inventory.ini gcp-ethvm-delete.yaml
