import { ContractSocial } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class ContractSocialDto implements ContractSocial {

  blog?: string;
  chat?: string;
  facebook?: string;
  forum?: string;
  github?: string;
  gitter?: string;
  instagram?: string;
  linkedin?: string;
  reddit?: string;
  slack?: string;
  telegram?: string;
  twitter?: string;
  youtube?: string;

  constructor(data: string) {
    // Deserialize JSON string
    data = JSON.parse(data)
    assignClean(this, data)

  }
}
