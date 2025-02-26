import { Column, Entity, Unique } from 'typeorm';

import BaseEntity from '../../../core/typeorm/base.entity';
import { IdType } from '../helper/constant';

@Entity()
@Unique(['userId'])
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 64, unique: true })
  userId: string; // 이메일 형식으로 저장 유니크 o

  @Column({ type: 'varchar', length: 100 })
  password: string; // 비밀번호 해싱

  @Column({ type: 'varchar', length: 32 })
  name: string; // 이름 유니크 x

  @Column({
    type: 'enum',
    enum: ['REG_NO', 'BUSINESS_NO'],
  })
  idType: IdType; //  주민등록번호 or 사업자 타입

  @Column({ type: 'varchar', length: 256 })
  idValue: string; // 주민등록번호 or 사업자 번호 값 해싱
}
