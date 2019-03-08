import { Column } from 'typeorm'
import { assignClean } from '@app/shared/utils'

export class SocialEmbedded {

  constructor(data: any) {
    assignClean(this, data)
  }

  @Column({type: 'string'})
  blog: string

  @Column({type: 'string'})
  chat: string

  @Column({type: 'string'})
  facebook: string

  @Column({type: 'string'})
  forum: string

  @Column({type: 'string'})
  github: string

  @Column({type: 'string'})
  gitter: string

  @Column({type: 'string'})
  instagram: string

  @Column({type: 'string'})
  linkedin: string

  @Column({type: 'string'})
  reddit: string

  @Column({type: 'string'})
  slack: string

  @Column({type: 'string'})
  telegram: string

  @Column({type: 'string'})
  twitter: string

  @Column({type: 'string'})
  youtube: string

}
