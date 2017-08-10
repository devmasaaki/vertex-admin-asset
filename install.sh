echo 'remove old data..'
rm -rf ../../back_end_rails_json_api/vertex-asset-api/public/admin
echo 'deploy new data'
cp -rf ./dist/ ../../back_end_rails_json_api/vertex-asset-api/public/admin