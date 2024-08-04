import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachments'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

import { EditAnswerUseCase } from './edit-answer'

let answersRepository: InMemoryAnswersRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let editAnswer: EditAnswerUseCase

describe('Edit Answer', () => {
    beforeEach(() => {
        answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
        editAnswer = new EditAnswerUseCase(answersRepository, answerAttachmentsRepository)
    })

    it('should be able to edit a answer', async () => {
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

        await editAnswer.execute({
            content: 'Edited Content',
            authorId: 'author-01',
            answerId: 'answer-01',
            attachmentsIds: ['1', '3'],
        })

        expect(answersRepository.items[0]).toMatchObject({
            content: 'Edited Content',
        })

        expect(answersRepository.items[0].attachments.currentItems).toHaveLength(2)
        expect(answersRepository.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
            expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
        ])
    })

    it('should not be able to edit a answer from another user', async () => {
        const newAnswer = makeAnswer(
            {
                authorId: new UniqueEntityId('author-01'),
            },
            new UniqueEntityId('answer-01'),
        )

        await answersRepository.create(newAnswer)

        const result = await editAnswer.execute({
            content: 'Edited Content',
            authorId: 'author-02',
            answerId: 'answer-01',
            attachmentsIds: [],
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
