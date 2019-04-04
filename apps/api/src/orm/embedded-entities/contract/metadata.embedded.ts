import { Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'
import { LogoEmbedded } from '@app/orm/embedded-entities/contract/logo.embedded'
import { SocialEmbedded } from '@app/orm/embedded-entities/contract/social.embedded'
import { SupportEmbedded } from '@app/orm/embedded-entities/contract/support.embedded'

export class MetadataEmbedded {
  constructor(data: any) {
    assignClean(this, data)
  }

  @Column({ type: 'int', readonly: true })
  decimals!: number

  @Column({ type: 'string', readonly: true })
  ens_address!: string

  @Column({ type: 'string', readonly: true })
  name!: string

  @Column({ type: 'string', readonly: true })
  symbol!: string

  @Column({ type: 'string', readonly: true })
  website!: string

  @Column(type => LogoEmbedded)
  logo!: LogoEmbedded

  @Column(type => SocialEmbedded)
  social!: SocialEmbedded

  @Column(type => SupportEmbedded)
  support!: SupportEmbedded
}
