import { DynamicModule, Module, Provider } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions, getDataSourceToken } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { TraceTemplate } from '../template/trace.template';
import { LoggerModule } from '../logger/trace.module';
import { TYPEORM_EX_CUSTOM_REPOSITORY } from '../decorators/typeorm.decorator';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
        type: 'mysql',
        host: process.env.MYSQL_HOST,
        port: 3306,
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE_NAME,
        entities: [__dirname + '../../../**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: false,
        timezone: '+09:00',
        namingStrategy: new SnakeNamingStrategy(),
      }),
      async dataSourceFactory(options: DataSourceOptions): Promise<DataSource> {
        
        if (!options) {
          throw new Error('Invalid TypeORM options provided');
        }

        const dataSource = new DataSource(options);
        await dataSource.initialize();  // 🚀 데이터 소스 초기화
        return addTransactionalDataSource(dataSource);  // 🚀 트랜잭션 적용
      },
    }),
  ],
  providers: [TraceTemplate],
})
export class TypeOrmExModule {
  public static forCustomRepository<T extends new (...args: any[]) => any>(
    repositories: T[],
  ): DynamicModule {
    const providers: Provider[] = [];

    for (const repository of repositories) {
      const entity = Reflect.getMetadata(
        TYPEORM_EX_CUSTOM_REPOSITORY,
        repository,
      );

      if (!entity) {
        continue;
      }

      providers.push({
        inject: [getDataSourceToken(), TraceTemplate], // TraceTemplate이 주입될 수 있도록 설정
        provide: repository,
        useFactory: (
          dataSource: DataSource,
          traceTemplate: TraceTemplate,
        ): typeof repository => {
          const baseRepository = dataSource.getRepository<any>(entity);
          return new repository(
            baseRepository.target,
            baseRepository.manager,
            baseRepository.queryRunner,
            traceTemplate,
          );
        },
      });
    }

    return {
      exports: providers,
      module: TypeOrmExModule,
      providers,
    };
  }
}
