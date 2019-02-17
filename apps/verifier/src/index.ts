import program from 'commander'
import { Config } from '@app/config'
import { Verify } from '@app/commands/verify'

const config = new Config();

program
  .version('0.0.1')
  .description('A utility for verifying the consistency and correctness of data within EthVM');

program
  .command('verify')
  .action(async () => {
    await Verify(config);
  });

program.parse(process.argv);
