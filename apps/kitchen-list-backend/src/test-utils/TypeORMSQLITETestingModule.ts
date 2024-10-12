import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/models/user.entity';
import { GoodEntity } from '../goods-list/models/good.entity';

export const TypeOrmSQLITETestingModule = () => [
  TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: ':memory:',
    dropSchema: true,
    entities: [UserEntity],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([UserEntity, GoodEntity]),
];