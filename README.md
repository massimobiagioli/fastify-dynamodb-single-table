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

## Swagger

You can find the swagger documentation at the following url:

```bash
https://<app-url>/api/documentation
```