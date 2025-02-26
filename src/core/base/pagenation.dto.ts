import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class PaginatedResponseDto<T> {
  result: T[];
  page: number;
  total_pages: number;
  cnt: number;
}
export class PaginatedResponseDtoExtend<T1, T2> {
  result: T1[];
  page: number;
  total_pages: number;
  cnt: number;
  etc: T2;
}
export class PageRequest {
  @IsOptional()
  @Type(() => Number)
  page?: number = null;

  @IsOptional()
  @Type(() => Number)
  size?: number= null;

  @IsOptional()
  order?: 'DESC' | 'ASC';

  get offset(): number {
    return ((this.page || 1) - 1) * (this.size || 20);
  }

  get limit(): number {
    return this.size || 20;
  }

  existsNextPage(totalCount: number): boolean {
    const totalPage = totalCount / (this.size || 20);
    return totalPage > (this.page || 1);
  }

  getPagingData = (count) => {
    const totalPages = Math.ceil(count / this.limit);
    return totalPages;
  };
}
