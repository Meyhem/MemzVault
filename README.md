# MemzVault

Simple encrypted storage for images & videos.

![image](https://user-images.githubusercontent.com/6241657/111897333-a1e9b780-8a1f-11eb-9b48-7b615d7175c1.png)

- AES256CBC encrypted storage (not E2E encryption)
- Primitive UI, Upload batches, Download from URL
- Multiple separated repositories
- Search by tags

# Server requirements
- dotnet-sdk-5.0
- nodejs
- npm
- yarn
- node
- git
- nginx
- certbot (see their installation guide for your OS)
- CentOS8 (Anything with SystemD should suffice)

# First deploy
1. Install all required deps
2. Configure Nginx
3. Choose long-term working folder for deploys, e.g. /root (will be reused for deploys)
4. Pull sources from this repo
5. run "sh deploy.sh" (It generates appsettings.Prod.json, write down or provide your own "AdminKey", needed for Repository creation, can be any string)


App should be up and running. To update deployment to never version just pull the repo & run "sh deploy.sh" again. It will not regenerate the production config, so your keys will stay.

After deployment, don't delete the pulled sources, if you delete appsettings.Production.json it will be regenerated with different keys (ServerKey & AdminKey are not used for data encryption so you will not loose your data even if you regenerate it).

# Security
## File encryption scheme
Repository contains manifest json file called "repository.json" which contains repository encryption key encrypted by passphrase.
Then every file has ".data file" and ".meta file". Meta contains some metedata about file along with unique IV for data file encryption.

If repository key or passphrase is lost, then all data are undecipherable.

Repository key is encrypted by function:
```js
EncryptedRepositoryKey = AES256CBC_encrypt(PlainRepositoryKey, RandomIV, Passphrase)
```

File data themselves are encrypted by function:
```js
EncryptedData = AES256CBC_encrypt(PlainData, IVMeta, RepositoryKey)
```

Simplified crypto flow for retrieving encrypted image for authenticated user:
```js
// decrypt passphrase by server key
encPassphrase = GetEncryptedPassphraseFromToken()
passphrase = Decrypt(encPassphrase, ServerKey)

// decrypt repository key by passphrase
encRepositoryKey = GetEncryptedRepositoryKey(GetRepositoryNameFromToken())
repositoryKey = Decrypt(encRepositoryKey, passphrase)

// decrypt meta by repository key
encMeta = GetFileMetadata()
meta = Decrypt(encMeta, repositoryKey)

// decrypt data by repository key
encData = GetFileData()
data = Decrypt(encData, meta.IV, repositoryKey)
```

## Authentication
There are no users, just repositories with passphrases which are used to log in to UI.
Server issues JWT token for session that contains repository name (plain) and passphrase (encrypted by ServerKey). 
This token gives full access to repository.

## Scenarios
1. **Lost ServerKey** - Just JWT tokens are invalidated, data are OK, just put new one to appsettings.Production.json
2. **Lost AdminKey** - Can't create new repos, data are OK, just put new one to appsettings.Production.json
3. **Lost Repository Passphrase** - Your data are lost, undecryptable. There is not backup or recovery. *nelson_haw_haw.png*

# NGINX

```nginx
server {
  listen 80;
  server_name "my-server.com" "www.my-server.com";

  include /etc/nginx/memzvault.nginx.conf;
}
```

# Cron

```
0 0 * * 0 root /usr/bin/certbot renew --post-hook "/usr/sbin/nginx -s reload"
```
