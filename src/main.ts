import { type DialOptions } from '@viamrobotics/rpc/src/dial';
import { ViamClient, FilterOptions } from '@viamrobotics/sdk';

async function connect(): Promise<ViamClient> {
  const credential = {
    payload: '<API-KEY>',
    type: 'api-key',
  };

  const dialOpts: DialOptions = {
    authEntity: '<API-KEY-ID>',
    credentials: credential,
  };

  const client = new ViamClient(dialOpts);
  await client.connect();

  return client;
}

const button = <HTMLButtonElement>document.getElementById('main-button');

async function run(client: ViamClient) {
  // A filter is an optional tool to filter out which data comes back.
  const opts: FilterOptions = {
    startTime: new Date('2023-10-25T09:00:00.000Z'),
    endTime: new Date('2023-10-25T09:18:00.000Z'),
    componentType: 'movement_sensor',
    componentName: 'accelerometer'
  };

  const filter = client.dataClient?.createFilter(opts);

  try {
    button.disabled = true;
    const textElement = <HTMLParagraphElement>document.getElementById('text');
    textElement.innerHTML = 'waiting for data...';

    const dataList = await client.dataClient?.tabularDataByFilter(filter);
    textElement.innerHTML = JSON.stringify(dataList, null, 2);
  } finally {
    button.disabled = false;
  }
}

async function main() {
  let client: ViamClient;
  try {
    button.textContent = 'Connecting...';
    client = await connect();
    button.textContent = 'Click for data';
  } catch (error) {
    button.textContent = 'Unable to connect';
    console.error(error);
    return;
  }

  // Make the button in our app do something interesting
  button.addEventListener('click', async () => {
    await run(client);
  });
  button.disabled = false;
}

main();