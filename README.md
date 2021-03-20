# MemzVault

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
