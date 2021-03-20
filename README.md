# MemzVault

# Server requirements

- dotnet-sdk-5.0
- nodejs
- npm
- yarn
- node
- git

server {
listen 80;
server_name "sneed.fun" "www.sneed.fun" "65.21.48.166";

location /api {
proxy_pass http://localhost:5000;
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection keep-alive;
proxy_set_header Host $host;
proxy_cache_bypass $http_upgrade;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
client_max_body_size 100M;
}

location / {
root /var/www/memzvault/frontend;
try_files $uri $uri/ /index.html;
}
}

server {
listen 80;
server_name "sneed.fun" "www.sneed.fun";

        include /etc/nginx/memzvault.nginx.conf;
    }
