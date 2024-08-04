import { Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Question } from '../../enterprise/entities/question'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { QuestionsRepository } from '../repositories/questions-repository'

interface CreateQuestionUseCaseRequest {
    title: string
    content: string
    authorId: string
    attachmentsIds: string[]
}

type CreateQuestionUseCaseResponse = Either<
    null,
    {
        question: Question
    }
>

export class CreateQuestionUseCase {
    constructor(private questionsRepository: QuestionsRepository) {}

    async execute({
        title,
        content,
        authorId,
        attachmentsIds,
    }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
        const question = Question.create({
            title,
            content,
            authorId: new UniqueEntityId(authorId),
        })

        const questionAttachments = attachmentsIds.map((attachmentId) => {
            return QuestionAttachment.create({
                questionId: question.id,
                attachmentId: new UniqueEntityId(attachmentId),
            })
        })

        question.attachments = new QuestionAttachmentList(questionAttachments)

        await this.questionsRepository.create(question)

        return right({ question })
    }
}
