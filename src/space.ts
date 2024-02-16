import { Create as CreateEvent, Remove as RemoveEvent } from "../generated/templates/Space/Space"
import { SpacePostCreateEvent, Space } from "../generated/schema"
import { getOrCreateUser } from "./store"

export function handlePostCreate(event: CreateEvent): void {
  let spacePostCreateEvent = new SpacePostCreateEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    
  spacePostCreateEvent.topicId = event.params.topicId
  spacePostCreateEvent.assetId = event.params.assetId
  
  const creator = getOrCreateUser(event.params.sender)
  spacePostCreateEvent.creator = creator.id
  
  let space = Space.load(event.address.toHexString());
  if (space == null) return;
  spacePostCreateEvent.space = space.id;
  spacePostCreateEvent.spaceId = space.spaceId;

  spacePostCreateEvent.blockNumber = event.block.number
  spacePostCreateEvent.blockTimestamp = event.block.timestamp
  spacePostCreateEvent.transactionHash = event.transaction.hash
  spacePostCreateEvent.save()
}

// TODO handle post remove
export function handlePostRemove(event: RemoveEvent): void {
}
