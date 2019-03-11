import { Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'

export class SocialEmbedded {

  constructor(data: any) {
    assignClean(this, data)
  }

  @Column({type: 'string', readonly: true})
  blog: string

  @Column({type: 'string', readonly: true})
  chat: string

  @Column({type: 'string', readonly: true})
  facebook: string

  @Column({type: 'string', readonly: true})
  forum: string

  @Column({type: 'string', readonly: true})
  github: string

  @Column({type: 'string', readonly: true})
  gitter: string

  @Column({type: 'string', readonly: true})
  instagram: string

  @Column({type: 'string', readonly: true})
  linkedin: string

  @Column({type: 'string', readonly: true})
  reddit: string

  @Column({type: 'string', readonly: true})
  slack: string

  @Column({type: 'string', readonly: true})
  telegram: string

  @Column({type: 'string', readonly: true})
  twitter: string

  @Column({type: 'string', readonly: true})
  youtube: string

}
