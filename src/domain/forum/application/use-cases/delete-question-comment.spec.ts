import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

import { DeleteQuestionCommentUseCase } from './delete-question-comment'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let deleteQuestionComment: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
    beforeEach(() => {
        questionCommentsRepository = new InMemoryQuestionCommentsRepository()
        deleteQuestionComment = new DeleteQuestionCommentUseCase(questionCommentsRepository)
    })

    it('should be able to delete a question comment', async () => {
        const newQuestionComment = makeQuestionComment()

        await questionCommentsRepository.create(newQuestionComment)

        await deleteQuestionComment.execute({
            authorId: newQuestionComment.authorId.toString(),
            questionCommentId: newQuestionComment.id.toString(),
        })

        expect(questionCommentsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete a question comment from another user', async () => {
        const newQuestionComment = makeQuestionComment({
            authorId: new UniqueEntityId('author-01'),
        })

        await questionCommentsRepository.create(newQuestionComment)

        const result = await deleteQuestionComment.execute({
            authorId: 'author-02',
            questionCommentId: newQuestionComment.id.toString(),
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
