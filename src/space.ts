import { Create as CreateEvent, Remove as RemoveEvent } from "../generated/templates/Space/Space"
import { SpacePostCreateEvent, Space, SpacePost } from "../generated/schema"
import { getOrCreateUser, getOrCreateAsset } from "./store"

export function handlePostCreate(event: CreateEvent): void {
  // Space Post Create Event
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

  // Space Post
  const asset = getOrCreateAsset(event.params.assetId)
  let post = new SpacePost(event.params.assetId.toString())
  post.spaceId = space.spaceId  // changed to spaceId from space
  post.asset = asset.id
  post.creator = creator.id
  post.isTopic = event.params.assetId == event.params.topicId
  post.toTopic = event.params.topicId
  post.save()
}

// TODO handle post remove
export function handlePostRemove(event: RemoveEvent): void {
}
