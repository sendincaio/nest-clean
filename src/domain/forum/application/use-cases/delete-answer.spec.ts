import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachments'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

import { DeleteAnswerUseCase } from './delete-answer'

let answersRepository: InMemoryAnswersRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let deleteAnswer: DeleteAnswerUseCase

describe('Delete Answer', () => {
    beforeEach(() => {
        answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
        deleteAnswer = new DeleteAnswerUseCase(answersRepository)
    })

    it('should be able to delete a answer', async () => {
        const newAnswer = makeAnswer(
            {
                authorId: new UniqueEntityId('author-01'),
            },
            new UniqueEntityId('answer-01'),
        )

        await answersRepository.create(newAnswer)

        answerAttachmentsRepository.items.push(
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityId('1'),
            }),

            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityId('2'),
            }),
        )

        await deleteAnswer.execute({
            authorId: 'author-01',
            answerId: 'answer-01',
        })

        expect(answersRepository.items).toHaveLength(0)
        expect(answerAttachmentsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete a answer from another user', async () => {
        const newAnswer = makeAnswer(
            {
                authorId: new UniqueEntityId('author-01'),
            },
            new UniqueEntityId('answer-01'),
        )

        await answersRepository.create(newAnswer)

        const result = await deleteAnswer.execute({
            authorId: 'author-02',
            answerId: 'answer-01',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
