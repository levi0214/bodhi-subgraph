import { Create as CreateEvent, Remove as RemoveEvent } from "../generated/templates/Space/Space"
import { SpacePostCreateEvent, Space, SpacePost, User } from "../generated/schema"
import { getOrCreateUser, getOrCreateAsset } from "./store"
import { BI_ZERO, BI_ONE } from "./number";

function newSpacePostCreateEvent(event: CreateEvent, space: Space, creator: User): void {
  let postEvent = new SpacePostCreateEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
    )

  postEvent.parentId = event.params.parentId
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
  post.assetId = event.params.assetId
  post.spaceId = space.spaceId
  post.asset = asset.id
  post.creator = creator.id
  
  // post relation
  post.isRoot = event.params.assetId == event.params.parentId
  post.parentId = event.params.parentId
  
  if (post.isRoot) {
    post.rootId = post.assetId
    post.parent = null
  } else {
    let parentPost = SpacePost.load(event.params.parentId.toString())
    if (parentPost == null) return
    post.rootId = parentPost.rootId
    post.parent = parentPost.id

    parentPost.totalReplies = parentPost.totalReplies.plus(BI_ONE)
    parentPost.save()
    
    if(!parentPost.isRoot){ 
      let rootPost = SpacePost.load(parentPost.rootId.toString())
      if (rootPost == null) return
      rootPost.totalReplies = rootPost.totalReplies.plus(BI_ONE)
      rootPost.save()
    }
  }

  post.totalReplies = BI_ZERO
  post.save()
}

export function handlePostCreate(event: CreateEvent): void {
  let space = Space.load(event.address.toHexString());
  if (space == null) return;
  space.totalPosts = space.totalPosts.plus(BI_ONE)
  space.save()

  const creator = getOrCreateUser(event.params.sender)
  newSpacePostCreateEvent(event, space, creator)
  newSpacePost(event, space, creator)
}

// TODO handle post remove
export function handlePostRemove(event: RemoveEvent): void {
}
