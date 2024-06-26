import {
  Create as CreateEvent,
  Remove as RemoveEvent,
} from "../generated/templates/Space/Space";
import {
  SpacePostCreateEvent,
  SpacePostRemoveEvent,
  Space,
  SpacePost,
  User,
} from "../generated/schema";
import {
  ProxyType,
  getOrCreateProxyTrade, 
  getOrCreateUser,
  getOrCreateAsset,
} from "./store";
import { BI_ZERO, BI_ONE } from "./number";

function newSpacePostCreateEvent(
  event: CreateEvent,
  space: Space,
  creator: User
): void {
  let postEvent = new SpacePostCreateEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  postEvent.parentId = event.params.parentId;
  postEvent.assetId = event.params.assetId;
  postEvent.creator = creator.id;
  postEvent.space = space.id;
  postEvent.spaceId = space.spaceId;
  postEvent.blockNumber = event.block.number;
  postEvent.blockTimestamp = event.block.timestamp;
  postEvent.transactionHash = event.transaction.hash;
  postEvent.save();
}

function handleSpacePostRelation(event: CreateEvent, post: SpacePost): void {
  post.isRoot = event.params.assetId == event.params.parentId;
  if (post.isRoot) {
    post.rootId = post.assetId;
  } else {
    let parentPost = SpacePost.load(event.params.parentId.toString());
    if (!parentPost) return;
    post.rootId = parentPost.rootId;
    post.parent = parentPost.id;

    updateTotalReplies(parentPost);
    if (!parentPost.isRoot) {
      let rootPost = SpacePost.load(parentPost.rootId.toString());
      if (rootPost) updateTotalReplies(rootPost);
    }
  }
}

function updateTotalReplies(post: SpacePost): void {
  post.totalReplies = post.totalReplies.plus(BI_ONE);
  post.save();
}

function newSpacePost(event: CreateEvent, space: Space, creator: User): void {
  const asset = getOrCreateAsset(event.params.assetId);
  let post = new SpacePost(event.params.assetId.toString());
  post.assetId = event.params.assetId;
  post.spaceId = space.spaceId;
  post.asset = asset.id;
  post.creator = creator.id;
  post.parentId = event.params.parentId;
  post.totalReplies = BI_ZERO;
  post.removedFromSpace = false;
  handleSpacePostRelation(event, post);
  post.save();

  asset.spacePost = post.id;
  asset.realCreator = event.params.sender;
  asset.save();
}

export function handlePostCreate(event: CreateEvent): void {
  let space = Space.load(event.address.toHexString());
  if (space == null) return;
  space.totalPosts = space.totalPosts.plus(BI_ONE);
  space.save();

  const creator = getOrCreateUser(event.params.sender);
  newSpacePostCreateEvent(event, space, creator);
  newSpacePost(event, space, creator);
  getOrCreateProxyTrade(
    event.transaction.hash,
    event.params.sender,
    ProxyType.SPACE_POST_CREATE
  )
}

export function handlePostRemove(event: RemoveEvent): void {
  let postEvent = new SpacePostRemoveEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  let space = Space.load(event.address.toHexString());
  if (space == null) return;
  postEvent.space = space.id;
  postEvent.spaceId = space.spaceId;
  postEvent.assetId = event.params.assetId;
  postEvent.blockNumber = event.block.number;
  postEvent.blockTimestamp = event.block.timestamp;
  postEvent.transactionHash = event.transaction.hash;
  postEvent.save();

  let post = SpacePost.load(event.params.assetId.toString());
  if (post == null) return;
  post.removedFromSpace = true;
  post.save();
}
