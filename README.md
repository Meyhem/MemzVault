# MemzVault

Simple encrypted storage for images & videos.

![image](https://user-images.githubusercontent.com/6241657/111897333-a1e9b780-8a1f-11eb-9b48-7b615d7175c1.png)

- AES256CBC encrypted storage (not E2E encryption)
- Primitive UI, Upload batches, Download from URL
- Multiple separated repositories

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
