#!/bin/sh

FRONTEND=memzvault.ui
ARTIFACT=artifact
APPSETTINGS=$1
DEPLOY_FOLDER=/var/www/memzvault

die () {
  echo "Build failed: $1"
  exit 1
}

NSTAGE=1

stage() {
  echo "============= Stage $NSTAGE - $1 ============="
  NSTAGE=$((NSTAGE+1))
}

test -f $APPSETTINGS || die "Missing production config file path (first positional argument)"

stage "Check tools"
dotnet --version || die "No dotnet install"
node --version || die "No nodejs install"
npm --version || die "No npm install"
yarn --version || die "No yarn install"
git --version || die "No git install"

stage "Prepare ground"

rm -rf $ARTIFACT
mkdir -p $ARTIFACT
git pull https://github.com/Meyhem/MemzVault master

stage "Make Frontend"
NODE_ENV=production yarn --cwd $FRONTEND build
mv $FRONTEND/build $ARTIFACT/frontend

stage "Make backend"
dotnet clean --nologo --verbosity quiet --configuration Release MemzVault.Web/MemzVault.Web.csproj
dotnet publish --nologo --verbosity quiet --configuration Release --output $ARTIFACT/backend --nologo  MemzVault.Web/MemzVault.Web.csproj
rm $ARTIFACT/backend/appsettings*.json

stage "Configure"
cp $APPSETTINGS $ARTIFACT/backend/appsettings.json

stage "Nginx"
cp memzvault.nginx.conf /etc/nginx/conf.d/memzvault.nginx.conf