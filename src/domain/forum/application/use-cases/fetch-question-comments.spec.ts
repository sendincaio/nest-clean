import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { FetchQuestionCommentsUseCase } from './fetch-question-comments'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let fetchQuestionComments: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
    beforeEach(() => {
        questionCommentsRepository = new InMemoryQuestionCommentsRepository()
        fetchQuestionComments = new FetchQuestionCommentsUseCase(questionCommentsRepository)
    })

    it('should be able to fetch question comments', async () => {
        await questionCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityId('question-01') }))
        await questionCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityId('question-01') }))
        await questionCommentsRepository.create(makeQuestionComment({ questionId: new UniqueEntityId('question-01') }))

        const result = await fetchQuestionComments.execute({
            questionId: 'question-01',
            page: 1,
        })

        expect(result.value?.questionComments).toHaveLength(3)
    })

    it('should be able to fetch paginated question comments', async () => {
        for (let i = 1; i <= 25; i++) {
            await questionCommentsRepository.create(
                makeQuestionComment({
                    questionId: new UniqueEntityId('question-01'),
                }),
            )
        }

        const result = await fetchQuestionComments.execute({
            questionId: 'question-01',
            page: 2,
        })

        expect(result.value?.questionComments).toHaveLength(5)
    })
})
