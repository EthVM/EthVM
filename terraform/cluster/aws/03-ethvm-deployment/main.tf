provider "aws" {
  region                  = "${var.region}"
  shared_credentials_file = "${var.shared_credentials_file}"
  profile                 = "${var.aws_profile}"
}

module "swarmsetup" {
  source             = "./modules/swarmsetup"
  admin_user         = "${var.swarmprom_admin_user}"
  admin_password     = "${var.swarmprom_admin_password}"
  slack_token        = "${var.swarmprom_slack_token}"
  slack_channel      = "${var.swarmprom_slack_channel}"
  slack_user         = "${var.swarmprom_slack_user}"
  host               = "${var.swarm_manager_ip}"
  provision_user     = "${var.provision_user}"
  ssh_key_path       = "${var.ssh_key_path}"
  connection_timeout = "${var.connection_timeout}"
  ethstats_secret    = "${var.ethstats_secret}"
}
