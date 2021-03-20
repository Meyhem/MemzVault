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

# check required installation
stage "Check tools"
dotnet --info || die "No dotnet install"
node --version || die "No nodejs install"
npm --version || die "No npm install"
yarn --version || die "No yarn install"
git --version || die "No git install"

# clean artifacts, create deploy dest
stage "Prepare ground"
rm -rf $ARTIFACT
mkdir -p $ARTIFACT
mkdir -p $DEPLOY_FOLDER/storage

# pull new sources
stage "Update sources"
git pull --ff-only https://github.com/Meyhem/MemzVault master 

# create prod backend config with random keys
stage "Generate prod config"
if [ ! -f appsettings.Production.json ]; then
  echo  "$CONFIG" > appsettings.Production.json
fi

# build frontend
stage "Make Frontend"
yarn --cwd $FRONTEND
NODE_ENV=production yarn --cwd $FRONTEND build
mv $FRONTEND/build $ARTIFACT/frontend

# build backend
stage "Make backend"
dotnet clean --nologo --verbosity quiet --configuration Release MemzVault.Web/MemzVault.Web.csproj
dotnet publish --nologo --verbosity quiet --configuration Release --output $ARTIFACT/backend --nologo  MemzVault.Web/MemzVault.Web.csproj
rm $ARTIFACT/backend/appsettings*.json

# put prod config to backend
stage "Configure"
cp appsettings.Production.json $ARTIFACT/backend/appsettings.json

# reconfigure nginx
stage "Nginx"
cp memzvault.nginx.conf /etc/nginx/memzvault.nginx.conf

# stop backend if running
stage "Stop services"
BACKENDSTATUS=`systemctl is-active memzvault`
if [ "$BACKENDSTATUS" = "active" ]; then
  echo "Stopping memzvault backend"
  systemctl stop memzvault
fi

# copy frontend artifact
stage "Deploy frontend"
rm -rf DEPLOY_FOLDER/frontend
cp -r $ARTIFACT/frontend $DEPLOY_FOLDER/

# copy backend artifact
stage "Deploy backend"
cp memzvault.service /etc/systemd/system/memzvault.service
rm -rf DEPLOY_FOLDER/backend
cp -r $ARTIFACT/backend $DEPLOY_FOLDER/

# reload new configs & start services
stage "Start services"
systemctl daemon-reload
systemctl start memzvault
systemctl enable memzvault
nginx -s reload
