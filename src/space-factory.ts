import { Create as CreateEvent } from "../generated/SpaceFactory/SpaceFactory"
import { SpaceFactoryCreate, Space } from "../generated/schema"
import { getOrCreateAsset, getOrCreateUser } from "./store"
import { Space as SpaceContract } from '../generated/templates'

function newSpaceFactoryCreate(event: CreateEvent): void {
  let spaceFactoryCreate = new SpaceFactoryCreate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  spaceFactoryCreate.spaceId = event.params.spaceId
  spaceFactoryCreate.spaceAddress = event.params.spaceAddress
  spaceFactoryCreate.assetId = event.params.assetId
  spaceFactoryCreate.creator = event.params.creator

  spaceFactoryCreate.blockNumber = event.block.number
  spaceFactoryCreate.blockTimestamp = event.block.timestamp
  spaceFactoryCreate.transactionHash = event.transaction.hash

  spaceFactoryCreate.save()
}

export function handleSpaceCreate(event: CreateEvent): void {
  newSpaceFactoryCreate(event)
  
  let space = new Space(event.params.spaceAddress.toHexString())
  const asset = getOrCreateAsset(event.params.assetId)
  const creator = getOrCreateUser(event.params.creator)
  space.asset = asset.id
  space.creator = creator.id
  space.spaceId = event.params.spaceId
  space.spaceAddress = event.params.spaceAddress
  space.save()
  
  SpaceContract.create(event.params.spaceAddress)
}
