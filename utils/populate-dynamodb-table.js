const { DynamoDBClient, BatchWriteItemCommand } = require('@aws-sdk/client-dynamodb');
const { faker } = require('@faker-js/faker');

const TABLE_NAME = 'single-table-demo';

function* chunkArray(array, chunkSize) {
  for (let i = 0; i < array.length; i += chunkSize) {
    yield array.slice(i, i + chunkSize);
  }
}

function S(value) {
  return {
    S: value,
  };
}

function ID(i, j = 0, k = 0) {
  const n = i * 1000 + j * 100 + k;
  return n.toString();
}

const data = [];
for (let i = 1; i <= 3; i++) {
  let area = {
    _et: S('AREA'),
    areaId: S(ID(i)),
    areaName: S(faker.location.countryCode('alpha-3')),
    manager: S(faker.person.fullName()),
    location: S(faker.location.city()),
    _ct: S(new Date().toISOString()),
    _md: S(new Date().toISOString()),
  }
  data.push({
    ...area,
    pk: S(`${area._et.S}#${area.areaId.S}`),
    sk: S(`${area._et.S}#${area.areaId.S}`),
  })

  for (let j = 1; j <= 5; j++) {
    let network = {
      _et: S('NETWORK'),
      networkId: S(ID(i, j)),
      networkType: S(faker.helpers.arrayElement(['LAN', 'WAN'])),
      connectionSpeed: S(faker.helpers.arrayElement(['1Gbps', '100Mbps'])),
      _ct: S(new Date().toISOString()),
      _md: S(new Date().toISOString()),
    }
    data.push({
      ...network,
      pk: S(`${area._et.S}#${area.areaId.S}`),
      sk: S(`${area._et.S}#${area.areaId.S}#${network._et.S}#${network.networkId.S}`),
    })

    for (let k = 1; k <= 20; k++) {
      let device = {
        _et: S('DEVICE'),
        deviceId: S(ID(i, j, k)),
        deviceName: S(faker.internet.displayName()),
        deviceType: S(faker.helpers.arrayElement(['Laptop', 'Desktop', 'Server'])),
        IPAddress: S(faker.internet.ipv4()),
        _ct: S(new Date().toISOString()),
        _md: S(new Date().toISOString()),
      }
      data.push({
        ...device,
        pk: S(`${device._et.S}#${device.deviceId.S}`),
        sk: S(`${device._et.S}#${device.deviceId.S}`),
        gsi1pk: S(`${area._et.S}#${area.areaId.S}#${network._et.S}#${network.networkId.S}`),
        gsi1sk: S(`${device._et.S}#${device.deviceId.S}`),
      })
    }
  }
}

function writeItemsBatch() {
  const client = new DynamoDBClient({});

  const chunks = chunkArray(data, 25);

  let chunkIndex = 0;
  for (const chunk of chunks) {
    const putRequests = chunk.map((item) => ({
      PutRequest: {
        Item: item,
      },
    }));

    const command = new BatchWriteItemCommand({
      RequestItems: {
        [TABLE_NAME]: putRequests,
      },
    });

    client.send(command)
      .then(() => console.log(`Batch write complete - Chunk # ${(++chunkIndex).toString().padStart(3, '0')}`))
      .catch((error) => console.error('Error writing items:', error));
  }
}

writeItemsBatch();