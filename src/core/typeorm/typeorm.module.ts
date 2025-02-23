import { DynamicModule, Module, Provider } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { TraceTemplate } from '../template/trace.template';
import { LoggerModule } from '../logger/trace.module';
import { TYPEORM_EX_CUSTOM_REPOSITORY } from '../decorators/typeorm.decorator';

@Module({
  imports: [LoggerModule], // ✅ LoggerModule을 가져오되, forwardRef 사용
  providers: [TraceTemplate],
})
export class TypeOrmExModule {
  public static forCustomRepository<T extends new (...args: any[]) => any>(
    repositories: T[],
  ): DynamicModule {
    const providers: Provider[] = [];

    for (const repository of repositories) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const entity = Reflect.getMetadata(
        TYPEORM_EX_CUSTOM_REPOSITORY,
        repository,
      );

      if (!entity) {
        continue;
      }

      providers.push({
        inject: [getDataSourceToken(), TraceTemplate], // ✅ TraceTemplate이 주입될 수 있도록 설정
        provide: repository,
        useFactory: (
          dataSource: DataSource,
          traceTemplate: TraceTemplate,
        ): typeof repository => {
          const baseRepository = dataSource.getRepository<any>(entity);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
