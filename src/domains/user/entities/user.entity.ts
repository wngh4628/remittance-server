import { Column, Entity, Unique } from 'typeorm';

import BaseEntity from '../../../core/typeorm/base.entity';
import { IdType } from '../helper/constant';

@Entity()
@Unique(['userId'])
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 64, unique: true })
  userId: string; // 이메일 형식으로 저장 (중복 방지)

  @Column({ type: 'varchar', length: 100 })
  password: string; // 비밀번호 (해싱 필수)

  @Column({ type: 'varchar', length: 32 })
  name: string; // 이름

  @Column({ type: 'varchar', length: 50 })
  idType: IdType; // ID 유형 (예: 주민등록번호, 여권 등)

  @Column({ type: 'varchar', length: 256 })
  idValue: string; // ID 값

  // @Column({
  //   nullable: true,
  //   default: null,
  // })
  // refreshToken: string;
}
