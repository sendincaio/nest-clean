import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

import { SendNotificationUseCase } from './send-notification'

let notificationsRepository: InMemoryNotificationsRepository
let sendNotification: SendNotificationUseCase

describe('Send Notification', () => {
    beforeEach(() => {
        notificationsRepository = new InMemoryNotificationsRepository()
        sendNotification = new SendNotificationUseCase(notificationsRepository)
    })

    it('should be able to send a notification', async () => {
        const result = await sendNotification.execute({
            title: 'Notification Title',
            content: 'Notification Content',
            recipientId: 'recipient-01',
        })

        expect(result.isRight()).toBe(true)
        expect(notificationsRepository.items[0]).toEqual(result.value?.notification)
    })
})
