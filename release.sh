#!/bin/sh
RELEASE="$1"
GITHUB_TOKEN="$2"
REPO="$3"
CHANGELOG=`awk -v version="$RELEASE" '/### Release / {printit = $3 == version}; printit;' 'CHANGELOG.md'`
mkdir release
cd v2/dist; zip -r ../../release/EthVM-Web-$RELEASE.zip *; cd ../../

# if [ -n "$4" ]; then
#     for f in release/*; do
#         gpg --output $f.sig --detach-sig $f
#     done
# fi

sha256sum ./release/EthVM-Web-$RELEASE.zip > ./release/EthVM-Web-$RELEASE-CHECKSUM-SHA256

GH_API="https://api.github.com"
GH_REPO="$GH_API/repos/$REPO"
AUTH="Authorization: token ${GITHUB_TOKEN}"
GH_TAGS="$GH_REPO/releases/tags/$RELEASE"
payload=$(
    jq --null-input \
    --arg tag "$RELEASE" \
    --arg name "EthVM $RELEASE" \
    --arg body "$CHANGELOG" \
    '{ tag_name: $tag, name: $name, body: $body, draft: false }'
)

response=$(
    curl -H "$AUTH" \
    --fail \
    --silent \
    --location \
    --data "$payload" \
    "https://api.github.com/repos/${REPO}/releases"
)
upresponse=$(curl -sH "$AUTH" $GH_TAGS)
eval $(echo "$upresponse" | grep -m 1 "id.:" | grep -w id | tr : = | tr -cd '[[:alnum:]]=')
[ "$id" ] || { echo "Error: Failed to get release id for tag: $RELEASE"; echo "$upresponse" | awk 'length($0)<100' >&2; exit 1; }

for file in ./release/*; do
    curl -H "$AUTH" \
    --header "Content-Type: application/octet-stream" \
    --data-binary "@$file" \
    --fail \
    --silent \
    --location \
    "https://uploads.github.com/repos/${REPO}/releases/$id/assets?name=$(basename $file)"
done
