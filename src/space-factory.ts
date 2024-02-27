import { Create as CreateEvent } from "../generated/SpaceFactory/SpaceFactory"
import { SpaceCreateEvent, Space } from "../generated/schema"
import { getOrCreateAsset, getOrCreateUser } from "./store"
import { Space as SpaceContract } from '../generated/templates'
import { BI_ZERO } from "./number"

function newSpaceCreateEvent(event: CreateEvent): void {
  let spaceCreateEvent = new SpaceCreateEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  spaceCreateEvent.spaceId = event.params.spaceId
  spaceCreateEvent.spaceAddress = event.params.spaceAddress
  spaceCreateEvent.assetId = event.params.assetId
  spaceCreateEvent.creator = event.params.creator
  spaceCreateEvent.blockNumber = event.block.number
  spaceCreateEvent.blockTimestamp = event.block.timestamp
  spaceCreateEvent.transactionHash = event.transaction.hash
  spaceCreateEvent.save()
}

function newSpace(event: CreateEvent): void {
  let space = new Space(event.params.spaceAddress.toHexString())
  
  const asset = getOrCreateAsset(event.params.assetId)
  space.asset = asset.id
  
  const creator = getOrCreateUser(event.params.creator)
  space.creator = creator.id
  
  const spaceAsUser = getOrCreateUser(event.params.spaceAddress)
  space.user = spaceAsUser.id
  
  space.spaceId = event.params.spaceId
  space.spaceAddress = event.params.spaceAddress
  space.totalPosts = BI_ZERO
  space.save()
}

export function handleSpaceCreate(event: CreateEvent): void {
  newSpaceCreateEvent(event)
  newSpace(event)
  SpaceContract.create(event.params.spaceAddress)  // Space contract instance
}
