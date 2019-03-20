import { Config } from '@app/config'
import { KafkaConnector } from '@app/connectors/kafka-connector'
import { bufferTime, filter } from 'rxjs/operators'

export async function EtherBalances(config: Config) {
  const connector = new KafkaConnector(config)

  let expectedNumber = 0

  connector
    .etherBalances$()
    .pipe(
      bufferTime(100),
      filter(blocks => !!blocks.length)
    )
    .subscribe(
      balances => {

        balances.forEach(pair => {

          const { address } = pair.first;
          const { amount } = pair.second;

          console.log(address, amount);

        });

      },
      err => console.error('Error', err),
      () => console.log('Finished')
    )
}
