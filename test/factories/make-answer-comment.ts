import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerComment, AnswerCommentProps } from '@/domain/forum/enterprise/entities/answer-comment'

export function makeAnswerComment(override: Partial<AnswerCommentProps> = {}, id?: UniqueEntityId) {
    const answercomment = AnswerComment.create(
        {
            content: faker.lorem.sentence(5),
            authorId: new UniqueEntityId(),
            answerId: new UniqueEntityId(),
            ...override,
        },
        id,
    )

    return answercomment
}
