import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let fetchAnswerComments: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
    beforeEach(() => {
        answerCommentsRepository = new InMemoryAnswerCommentsRepository()
        fetchAnswerComments = new FetchAnswerCommentsUseCase(answerCommentsRepository)
    })

    it('should be able to fetch answer comments', async () => {
        await answerCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityId('answer-01') }))
        await answerCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityId('answer-01') }))
        await answerCommentsRepository.create(makeAnswerComment({ answerId: new UniqueEntityId('answer-01') }))

        const result = await fetchAnswerComments.execute({
            answerId: 'answer-01',
            page: 1,
        })

        expect(result.value?.answerComments).toHaveLength(3)
    })

    it('should be able to fetch paginated answer comments', async () => {
        for (let i = 1; i <= 25; i++) {
            await answerCommentsRepository.create(
                makeAnswerComment({
                    answerId: new UniqueEntityId('answer-01'),
                }),
            )
        }

        const result = await fetchAnswerComments.execute({
            answerId: 'answer-01',
            page: 2,
        })

        expect(result.value?.answerComments).toHaveLength(5)
    })
})
