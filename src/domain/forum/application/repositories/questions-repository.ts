import { PaginationParamsRepository } from '@/core/repositories/pagination-params-repository'

import { Question } from '../../enterprise/entities/question'

export interface QuestionsRepository {
    findById(id: string): Promise<Question | null>
    findBySlug(slug: string): Promise<Question | null>
    findManyRecent(params: PaginationParamsRepository): Promise<Question[]>
    update(question: Question): Promise<void>
    create(question: Question): Promise<void>
    delete(question: Question): Promise<void>
}
