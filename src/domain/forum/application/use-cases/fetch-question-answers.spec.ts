import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { FetchQuestionAnswersUseCase } from './fetch-question-answers'

let answersRepository: InMemoryAnswersRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let fetchQuestionAnswers: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
    beforeEach(() => {
        answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
        fetchQuestionAnswers = new FetchQuestionAnswersUseCase(answersRepository)
    })

    it('should be able to fetch question answers', async () => {
        await answersRepository.create(makeAnswer({ questionId: new UniqueEntityId('question-01') }))
        await answersRepository.create(makeAnswer({ questionId: new UniqueEntityId('question-01') }))
        await answersRepository.create(makeAnswer({ questionId: new UniqueEntityId('question-01') }))
        await answersRepository.create(makeAnswer({ questionId: new UniqueEntityId('question-02') }))
        await answersRepository.create(makeAnswer({ questionId: new UniqueEntityId('question-03') }))

        const result = await fetchQuestionAnswers.execute({
            questionId: 'question-01',
            page: 1,
        })

        expect(result.value?.answers).toHaveLength(3)
    })

    it('should be able to fetch paginated question answers', async () => {
        for (let i = 1; i <= 25; i++) {
            await answersRepository.create(
                makeAnswer({
                    questionId: new UniqueEntityId('question-01'),
                }),
            )
        }

        const result = await fetchQuestionAnswers.execute({
            questionId: 'question-01',
            page: 2,
        })

        expect(result.value?.answers).toHaveLength(5)
    })
})
