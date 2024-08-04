import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

import { ReadNotificationUseCase } from './read-notification'

let notificationsRepository: InMemoryNotificationsRepository
let readNotification: ReadNotificationUseCase

describe('Read Notification', () => {
    beforeEach(() => {
        notificationsRepository = new InMemoryNotificationsRepository()
        readNotification = new ReadNotificationUseCase(notificationsRepository)
    })

    it('should be able to read a notification', async () => {
        const newNotification = makeNotification()

        await notificationsRepository.create(newNotification)

        const result = await readNotification.execute({
            recipientId: newNotification.recipientId.toString(),
            notificationId: newNotification.id.toString(),
        })

        expect(result.isRight()).toBe(true)
        expect(notificationsRepository.items[0].readAt).toEqual(expect.any(Date))
    })

    it('should not be able to read a notification from another user', async () => {
        const newNotification = makeNotification({
            recipientId: new UniqueEntityId('recipient-01'),
        })

        await notificationsRepository.create(newNotification)

        const result = await readNotification.execute({
            recipientId: 'recipient-02',
            notificationId: newNotification.id.toString(),
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
