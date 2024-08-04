import { Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'

interface SendNotificationUseCaseRequest {
    title: string
    content: string
    recipientId: string
}

type SendNotificationUseCaseResponse = Either<
    null,
    {
        notification: Notification
    }
>

export class SendNotificationUseCase {
    constructor(private notificationsRepository: NotificationsRepository) {}

    async execute({
        title,
        content,
        recipientId,
    }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
        const notification = Notification.create({
            title,
            content,
            recipientId: new UniqueEntityId(recipientId),
        })

        await this.notificationsRepository.create(notification)

        return right({ notification })
    }
}
