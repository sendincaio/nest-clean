import { Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Answer } from '../../enterprise/entities/answer'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { AnswersRepository } from '../repositories/answers-repository'

interface AnswerQuestionUseCaseRequest {
    content: string
    instructorId: string
    questionId: string
    attachmentsIds: string[]
}

type AnswerQuestionUseCaseResponse = Either<
    null,
    {
        answer: Answer
    }
>

export class AnswerQuestionUseCase {
    constructor(private answersRepository: AnswersRepository) {}

    async execute({
        content,
        instructorId,
        questionId,
        attachmentsIds,
    }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
        const answer = Answer.create({
            content,
            authorId: new UniqueEntityId(instructorId),
            questionId: new UniqueEntityId(questionId),
        })

        const answerAttachments = attachmentsIds.map((attachmentId) => {
            return AnswerAttachment.create({
                answerId: answer.id,
                attachmentId: new UniqueEntityId(attachmentId),
            })
        })

        answer.attachments = new AnswerAttachmentList(answerAttachments)

        await this.answersRepository.create(answer)

        return right({ answer })
    }
}
