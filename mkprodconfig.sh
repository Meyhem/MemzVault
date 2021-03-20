#!/bin/sh

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

echo "$CONFIG"
