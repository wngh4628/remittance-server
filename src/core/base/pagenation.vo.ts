import { PageRequest } from './pagenation.dto';

export class PagenationVo {
  page?: number;
  size?: number;
  order?: 'DESC' | 'ASC' = 'ASC';

  constructor(dto?: PageRequest) {
  this.page = dto?.page;   
  this.size = dto?.size;  
  this.order = dto?.order; 
}

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

  get isPaging(): boolean {
    let answer = false;
    if (this.page && this.size) {
      answer = false;
    }
    return answer;
  }
}
