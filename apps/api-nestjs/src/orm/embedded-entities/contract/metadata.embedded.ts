import { Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { LogoEmbedded } from '@app/orm/embedded-entities/contract/logo.embedded'
import { SocialEmbedded } from '@app/orm/embedded-entities/contract/social.embedded'
import { SupportEmbedded } from '@app/orm/embedded-entities/contract/support.embedded'

export class MetadataEmbedded {

  constructor(data: any) {
    assignClean(this, data)
  }

  @Column({type: 'int'})
  decimals: number

  @Column({type: 'string'})
  ens_address: string

  @Column({type: 'string'})
  name: string

  @Column({type: 'string'})
  symbol: string

  @Column({type: 'string'})
  website: string

  @Column(type => LogoEmbedded)
  logo: LogoEmbedded

  @Column(type => SocialEmbedded)
  social: SocialEmbedded

  @Column(type => SupportEmbedded)
  support: SupportEmbedded

}
