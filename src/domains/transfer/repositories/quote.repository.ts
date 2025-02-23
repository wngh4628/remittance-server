import { Repository } from 'typeorm';

import { CustomRepository } from '../../../core/decorators/typeorm.decorator';
import { Quote } from '../entities/quote.entity';

@CustomRepository(Quote)
export class QuoteRepository extends Repository<Quote> {}
