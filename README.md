# Fastify DynamoDB Single Table Design

Stack:
- [x] NodeJs
- [x] Fastify
- [x] Serverless Framework
- [x] Tap
- [x] Eslint
- [x] Prettier
- [x] Husky

## Commands

### Start server

Start local server (use only for development and testing purposes)

```bash
npm run dev
```

### Start serverless offline

Start serverless in offline mode (use only for development and testing purposes)

```bash
npm run offline
```

### Testing

Launch tests

```bash
npm run test
```

Launch tests with coverage

```bash
npm run test:coverage
```

Launch tests with filter

```bash
npm run test:filter --filter=<filter>
```

### Linting and Formatting

Check linting

```bash
npm run lint
```

Fix linting

```bash
npm run lint:fix
```

Format code

```bash
npm run format
```

## Use Cases

### Health Check

```bash
curl --location 'https://<app-url>/api/health/'
```

should return

```json
{
  "status": "ok"
}
```

### List all areas

```bash
curl --location 'https://<app-url>/api/area'
```

### Get area by ID

```bash
curl --location 'https://<app-url>/api/area/1000'
```

### Create new area

```bash
curl --location 'https://<app-url>/api/area' \
--header 'Content-Type: application/json' \
--data '{
    "id": "4000",
    "name": "New area name 4000",
    "manager": "New manager for area 4000",
    "location": "New location for area 4000"
}'
```

### Get all networks by area ID

```bash
curl --location 'https://<app-url>/api/network?areaId=1000'
```

### Get network by ID

```bash
curl --location 'https://<app-url>/api/network/1100?areaId=1000'
```

### Get network by ID - With area

```bash
curl --location 'https://<app-url>/api/network/withArea?areaId=1000'
```

### Create new network

```bash
curl --location 'https://<app-url>/api/network' \
--header 'Content-Type: application/json' \
--data '{
    "id": "1501",
    "areaId": "1000",
    "type": "LAN",
    "connectionSpeed": "1Gbps"    
}'
```

### Get devices by area ID and network ID 

```bash
curl --location 'https://<app-url>/api/device?areaId=1000&networkId=1400'
```

### Get device by ID

```bash
curl --location 'https://<app-url>/api/device/1413?areaId=1000&networkId=1400'
```

## Swagger

You can find the swagger documentation at the following url:

```bash
https://<app-url>/api/documentation
```