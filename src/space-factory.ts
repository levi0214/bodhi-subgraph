import { Create as CreateEvent } from "../generated/SpaceFactory/SpaceFactory"
import { Space } from "../generated/schema"
import { getOrCreateAsset, getOrCreateUser } from "./store"
import { Space as SpaceContract } from '../generated/templates'
import { BI_ZERO } from "./number"
import { AppSource, AssetType } from './types'

function newSpace(event: CreateEvent): void {
  let space = new Space(event.params.spaceAddress.toHexString())
  
  const asset = getOrCreateAsset(event.params.assetId)
  asset.app = AppSource.SPACE
  asset.assetType = AssetType.SPACE
  asset.save()
  
  space.asset = asset.id
  
  const creator = getOrCreateUser(event.params.creator)
  space.creator = creator.id
  
  const spaceAsUser = getOrCreateUser(event.params.spaceAddress)
  space.user = spaceAsUser.id
  
  space.spaceId = event.params.spaceId
  space.spaceAddress = event.params.spaceAddress
  space.spaceName = event.params.spaceName
  space.totalPosts = BI_ZERO
  space.save()
}

export function handleSpaceCreate(event: CreateEvent): void {
  newSpace(event)
  SpaceContract.create(event.params.spaceAddress)  // Space contract instance
}
