import { PaginationParamsRepository } from '@/core/repositories/pagination-params-repository'

import { AnswerComment } from '../../enterprise/entities/answer-comment'

export interface AnswerCommentsRepository {
    findById(id: string): Promise<AnswerComment | null>
    findManyByAnswerId(answerId: string, params: PaginationParamsRepository): Promise<AnswerComment[]>
    create(answerComment: AnswerComment): Promise<void>
    delete(answerComment: AnswerComment): Promise<void>
}
