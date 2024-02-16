import { Create as CreateEvent, Remove as RemoveEvent } from "../generated/templates/Space/Space"
import { SpaceCreate, Space } from "../generated/schema"
import { getOrCreateUser } from "./store"

export function handlePostCreate(event: CreateEvent): void {
  let spaceCreate = new SpaceCreate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    
  spaceCreate.topicId = event.params.topicId
  spaceCreate.assetId = event.params.assetId
  
  const creator = getOrCreateUser(event.params.sender)
  spaceCreate.creator = creator.id
  
  let space = Space.load(event.address.toHexString());
  if (space == null) return;
  spaceCreate.space = space.id;
  spaceCreate.spaceId = space.spaceId;

  spaceCreate.blockNumber = event.block.number
  spaceCreate.blockTimestamp = event.block.timestamp
  spaceCreate.transactionHash = event.transaction.hash

  spaceCreate.save()
}

export function handlePostRemove(event: RemoveEvent): void {
}
