import { UniqueEntityId } from './unique-entity-id'

export abstract class Entity<Props> {
    private entityId: UniqueEntityId
    protected props: Props

    get id() {
        return this.entityId
    }

    protected constructor(props: Props, id?: UniqueEntityId) {
        this.entityId = id ?? new UniqueEntityId()
        this.props = props
    }

    public equals(entity: Entity<any>) {
        if (entity === this) {
            return true
        }

        if (entity.id === this.entityId) {
            return true
        }

        return false
    }
}
