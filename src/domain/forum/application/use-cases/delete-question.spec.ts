import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionAttachment } from 'test/factories/make-question-attachments'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

import { DeleteQuestionUseCase } from './delete-question'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let deleteQuestion: DeleteQuestionUseCase

describe('Delete Question', () => {
    beforeEach(() => {
        questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
        deleteQuestion = new DeleteQuestionUseCase(questionsRepository)
    })

    it('should be able to delete a question', async () => {
        const newQuestion = makeQuestion(
            {
                authorId: new UniqueEntityId('author-01'),
            },
            new UniqueEntityId('question-01'),
        )

        await questionsRepository.create(newQuestion)

        questionAttachmentsRepository.items.push(
            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityId('1'),
            }),

            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityId('2'),
            }),
        )

        await deleteQuestion.execute({
            authorId: 'author-01',
            questionId: 'question-01',
        })

        expect(questionsRepository.items).toHaveLength(0)
        expect(questionAttachmentsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete a question from another user', async () => {
        const newQuestion = makeQuestion(
            {
                authorId: new UniqueEntityId('author-01'),
            },
            new UniqueEntityId('question-01'),
        )

        await questionsRepository.create(newQuestion)

        const result = await deleteQuestion.execute({
            authorId: 'author-02',
            questionId: 'question-01',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
