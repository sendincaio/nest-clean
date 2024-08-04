import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

import { DeleteAnswerCommentUseCase } from './delete-answer-comment'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let deleteAnswerComment: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
    beforeEach(() => {
        answerCommentsRepository = new InMemoryAnswerCommentsRepository()
        deleteAnswerComment = new DeleteAnswerCommentUseCase(answerCommentsRepository)
    })

    it('should be able to delete a answer comment', async () => {
        const newAnswerComment = makeAnswerComment()

        await answerCommentsRepository.create(newAnswerComment)

        await deleteAnswerComment.execute({
            authorId: newAnswerComment.authorId.toString(),
            answerCommentId: newAnswerComment.id.toString(),
        })

        expect(answerCommentsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete a answer comment from another user', async () => {
        const newAnswerComment = makeAnswerComment({
            authorId: new UniqueEntityId('author-01'),
        })

        await answerCommentsRepository.create(newAnswerComment)

        const result = await deleteAnswerComment.execute({
            authorId: 'author-02',
            answerCommentId: newAnswerComment.id.toString(),
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
