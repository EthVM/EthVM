import { Config } from '@app/config'
import { KafkaConnector } from '@app/connectors/kafka-connector'
import { bufferTime, filter } from 'rxjs/operators'

export async function KafkaQuickTest(config: Config) {

  const connector = new KafkaConnector(config)

  let expectedNumber = 0;

  connector.blocks$()
    .pipe(
      bufferTime(100),
      filter(blocks => !!blocks.length)
    )
    .subscribe(
      blocks => {

        blocks
          .map(b => b.header._number)
          .forEach(number => {
            if(number != expectedNumber) {
              console.log(`Sequence broken, expected ${expectedNumber}, received = ${number}`);
              process.exit(1);
            } else {
              expectedNumber += 1;
              console.log(`Expected block number ${number} received`);
            }
          });

      },
      err => console.error('Error', err),
      () => console.log('Finished')
    )

}
