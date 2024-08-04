import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let fetchRecentQuestions: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
    beforeEach(() => {
        questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
        fetchRecentQuestions = new FetchRecentQuestionsUseCase(questionsRepository)
    })

    it('should be able to fetch recent questions', async () => {
        await questionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 20) }))
        await questionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 18) }))
        await questionsRepository.create(makeQuestion({ createdAt: new Date(2022, 0, 22) }))

        const result = await fetchRecentQuestions.execute({
            page: 1,
        })

        expect(result.value?.questions).toEqual([
            expect.objectContaining({ createdAt: new Date(2022, 0, 22) }),
            expect.objectContaining({ createdAt: new Date(2022, 0, 20) }),
            expect.objectContaining({ createdAt: new Date(2022, 0, 18) }),
        ])
    })

    it('should be able to fetch paginated recent questions', async () => {
        for (let i = 1; i <= 25; i++) {
            await questionsRepository.create(makeQuestion())
        }

        const result = await fetchRecentQuestions.execute({
            page: 2,
        })

        expect(result.value?.questions).toHaveLength(5)
    })
})
