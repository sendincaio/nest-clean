import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Notification, NotificationProps } from '@/domain/notification/enterprise/entities/notification'

export function makeNotification(override: Partial<NotificationProps> = {}, id?: UniqueEntityId) {
    const notification = Notification.create(
        {
            recipientId: new UniqueEntityId(),
            title: faker.lorem.sentence(3),
            content: faker.lorem.sentence(5),
            ...override,
        },
        id,
    )

    return notification
}
