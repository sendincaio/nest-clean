import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionComment, QuestionCommentProps } from '@/domain/forum/enterprise/entities/question-comment'

export function makeQuestionComment(override: Partial<QuestionCommentProps> = {}, id?: UniqueEntityId) {
    const questioncomment = QuestionComment.create(
        {
            content: faker.lorem.sentence(5),
            authorId: new UniqueEntityId(),
            questionId: new UniqueEntityId(),
            ...override,
        },
        id,
    )

    return questioncomment
}
