import { PaginationParamsRepository } from '@/core/repositories/pagination-params-repository'

import { Answer } from '../../enterprise/entities/answer'

export interface AnswersRepository {
    findById(id: string): Promise<Answer | null>
    findManyByQuestionId(questionId: string, params: PaginationParamsRepository): Promise<Answer[]>
    update(answer: Answer): Promise<void>
    create(answer: Answer): Promise<void>
    delete(answer: Answer): Promise<void>
}
