#!/bin/sh

FRONTEND=memzvault.ui
ARTIFACT=artifact
DEPLOY_FOLDER=/var/www/memzvault

SERVERKEY=`openssl rand -base64 16`
ADMINKEY=`openssl rand -base64 16`
ISSUERSIGNINGKEY=`openssl rand -base64 16`

CONFIG="{
  \"Urls\": \"http://localhost:5000\",
  \"Memz\": {
    \"ServerKey\": \"$SERVERKEY\",
    \"AdminKey\": \"$ADMINKEY\",
    \"StorageFolder\": \"/var/www/memzvault/storage\"
  },
  \"Jwt\": {
    \"Audience\": \"MemzVault\",
    \"SaveToken\": false,
    \"RequireHttpsMetadata\": false,
    \"TokenValidationParameters\": {
      \"IssuerSigningKey\": \"$ISSUERSIGNINGKEY\",
      \"ValidIssuer\": \"MemzVault\",
      \"ValidAudience\": \"MemzVault\",
      \"RequireExpirationTime\": true
    }
  },
  \"Logging\": {
    \"LogLevel\": {
      \"Default\": \"Information\",
      \"Microsoft\": \"Warning\",
      \"Microsoft.Hosting.Lifetime\": \"Information\"
    }
  }
}"

die () {
  echo "Build failed: $1"
  exit 1
}

NSTAGE=1

stage() {
  echo "============= Stage $NSTAGE - $1 ============="
  NSTAGE=$((NSTAGE+1))
}

stage "Check tools"
dotnet --info || die "No dotnet install"
node --version || die "No nodejs install"
npm --version || die "No npm install"
yarn --version || die "No yarn install"
git --version || die "No git install"

stage "Prepare ground"
rm -rf $ARTIFACT
mkdir -p $ARTIFACT
mkdir -p $DEPLOY_FOLDER/storage
git pull --ff-only https://github.com/Meyhem/MemzVault master 
if [ ! -f appsettings.Production.json ]; then
  echo "Generating prod config 'appsettings.Production.json'"
  echo  "$CONFIG" > appsettings.Production.json
fi

stage "Make Frontend"
yarn --cwd $FRONTEND
NODE_ENV=production yarn --cwd $FRONTEND build
mv $FRONTEND/build $ARTIFACT/frontend

stage "Make backend"
dotnet clean --nologo --verbosity quiet --configuration Release MemzVault.Web/MemzVault.Web.csproj
dotnet publish --nologo --verbosity quiet --configuration Release --output $ARTIFACT/backend --nologo  MemzVault.Web/MemzVault.Web.csproj
rm $ARTIFACT/backend/appsettings*.json

stage "Configure"
cp appsettings.Production.json $ARTIFACT/backend/appsettings.json

stage "Nginx"
cp memzvault.nginx.conf /etc/nginx/conf.d/memzvault.nginx.conf

stage "Stop services"
BACKENDSTATUS=`systemctl is-active memzvault`
if [ "$BACKENDSTATUS" = "active" ]; then
  echo "Stopping memzvault backend"
  systemctl stop memzvault
fi

stage "Deploy frontend"
rm -rf DEPLOY_FOLDER/frontend
cp -r $ARTIFACT/frontend $DEPLOY_FOLDER/frontend

stage "Deploy backend"
cp memzvault.service /etc/systemd/system/memzvault.service
rm -rf DEPLOY_FOLDER/backend
cp -r $ARTIFACT/backend $DEPLOY_FOLDER/backend

stage "Start services"
systemctl start memzvault
systemctl enable memzvault
nginx -s reload
