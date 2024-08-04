import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { waitFor } from 'test/utils/wait-for'
import { MockInstance } from 'vitest'

import { SendNotificationUseCase } from '../use-cases/send-notification'
import { OnAnswerCreated } from './on-answer-created'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answersRepository: InMemoryAnswersRepository
let notificationsRepository: InMemoryNotificationsRepository
let sendNotification: SendNotificationUseCase

let sendNotificationSpy: MockInstance

describe('On Answer Created', () => {
    beforeEach(() => {
        questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
        answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository)
        notificationsRepository = new InMemoryNotificationsRepository()
        sendNotification = new SendNotificationUseCase(notificationsRepository)

        sendNotificationSpy = vi.spyOn(sendNotification, 'execute')

        new OnAnswerCreated(questionsRepository, sendNotification)
    })

    it('should  send a notification when an answer is created', async () => {
        const newQuestion = makeQuestion()
        const newAnswer = makeAnswer({ questionId: newQuestion.id })

        await questionsRepository.create(newQuestion)
        await answersRepository.create(newAnswer)

        await waitFor(() => {
            expect(sendNotificationSpy).toHaveBeenCalled()
        })
    })
})
