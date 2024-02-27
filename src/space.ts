import { Create as CreateEvent, Remove as RemoveEvent } from "../generated/templates/Space/Space"
import { SpacePostCreateEvent, Space, SpacePost, User } from "../generated/schema"
import { getOrCreateUser, getOrCreateAsset } from "./store"
import { BI_ZERO, BI_ONE } from "./number";

function newSpacePostCreateEvent(event: CreateEvent, space: Space, creator: User): void {
  let postEvent = new SpacePostCreateEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
    )

  postEvent.topicId = event.params.topicId
  postEvent.assetId = event.params.assetId
  postEvent.creator = creator.id
  postEvent.space = space.id;
  postEvent.spaceId = space.spaceId;
  postEvent.blockNumber = event.block.number
  postEvent.blockTimestamp = event.block.timestamp
  postEvent.transactionHash = event.transaction.hash
  postEvent.save()
}

function newSpacePost(event: CreateEvent, space: Space, creator: User): void {
  const asset = getOrCreateAsset(event.params.assetId)
  let post = new SpacePost(event.params.assetId.toString())
  post.spaceId = space.spaceId  // changed to spaceId from space
  post.asset = asset.id
  post.creator = creator.id
  post.isTopic = event.params.assetId == event.params.topicId
  post.toTopic = event.params.topicId
  post.totalReplies = BI_ZERO
  post.save()
}

function updateTotalReplies(event: CreateEvent): void {
  if (event.params.assetId != event.params.topicId) {
    let topic = SpacePost.load(event.params.topicId.toString())
    if (topic == null) return
    topic.totalReplies = topic.totalReplies.plus(BI_ONE)
    topic.save()
  }
}

export function handlePostCreate(event: CreateEvent): void {
  let space = Space.load(event.address.toHexString());
  if (space == null) return;
  space.totalPosts = space.totalPosts.plus(BI_ONE)
  space.save()

  const creator = getOrCreateUser(event.params.sender)
  newSpacePostCreateEvent(event, space, creator)
  newSpacePost(event, space, creator)
  updateTotalReplies(event)
}

// TODO handle post remove
export function handlePostRemove(event: RemoveEvent): void {
}
