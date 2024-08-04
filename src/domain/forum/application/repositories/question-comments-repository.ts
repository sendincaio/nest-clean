import { PaginationParamsRepository } from '@/core/repositories/pagination-params-repository'

import { QuestionComment } from '../../enterprise/entities/question-comment'

export interface QuestionCommentsRepository {
    findById(id: string): Promise<QuestionComment | null>
    findManyByQuestionId(questionId: string, params: PaginationParamsRepository): Promise<QuestionComment[]>
    create(questionComment: QuestionComment): Promise<void>
    delete(questionComment: QuestionComment): Promise<void>
}
