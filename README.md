# MemzVault

Encrypted storage for images & videos.

# Server requirements

- dotnet-sdk-5.0
- nodejs
- npm
- yarn
- node
- git

# NGINX

```nginx
server {
  listen 80;
  server_name "sneed.fun" "www.sneed.fun";

  include /etc/nginx/memzvault.nginx.conf;
}
```

# Cron

```
0 0 * * 0 root /usr/bin/certbot renew --post-hook "/usr/sbin/nginx -s reload"
```
