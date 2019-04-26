terraform init \
  -backend-config="endpoint=${SPACES_ENDPOINT:-"sfo2.digitaloceanspaces.com"}" \
  -backend-config="bucket=${SPACES_BUCKET:-"ethvm-terraform-remote"}" \
  -backend-config="access_key=$SPACES_ACCESS_TOKEN" \
  -backend-config="secret_key=$SPACES_SECRET_KEY"
