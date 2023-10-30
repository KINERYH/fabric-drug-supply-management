# Blockchain Explorer

## Setting up blockchain explorer

Copy entire crypto artifact directory (organizations/) from your fabric network (e.g /fabric-blockchain/test-network)

  ```bash
  cd explorer
  cp -r ../fabric-blockchain/test-network/organizations/ .
  ```
<hr>
Replace the user's certificate with an admin certificate and a secret (private) key in the connection profile (**test-network.json**). You need to specify the absolute path on the Explorer container.

  Before:
  ```json
  "adminPrivateKey": {
      "path": "/tmp/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/<priv_sk>"
  }
  ```

  After:
  ```json
  "adminPrivateKey": {
      "path": "/tmp/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/<your_priv_sk>"
  }
  ```
  **Check your admin private sk from the path:**
  ```bash
  ls ../fabric-blockchain/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/
  ```

## Start the container services

```bash
docker-compose up -d
```