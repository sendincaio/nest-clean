import { DomainEvent } from '../events/domain-event'
import { DomainEvents } from '../events/domain-events'
import { Entity } from './entity'

export abstract class AggregateRoot<Props> extends Entity<Props> {
    private events: DomainEvent[] = []

    get domainEvents(): DomainEvent[] {
        return this.events
    }

    protected addDomainEvent(domainEvent: DomainEvent): void {
        this.events.push(domainEvent)
        DomainEvents.markAggregateForDispatch(this)
    }

    public clearEvents() {
        this.events = []
    }
}
