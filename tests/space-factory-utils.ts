import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import { Create } from "../generated/SpaceFactory/SpaceFactory"

export function createCreateEvent(
  spaceId: BigInt,
  spaceAddress: Address,
  assetId: BigInt,
  creator: Address
): Create {
  let createEvent = changetype<Create>(newMockEvent())

  createEvent.parameters = new Array()

  createEvent.parameters.push(
    new ethereum.EventParam(
      "spaceId",
      ethereum.Value.fromUnsignedBigInt(spaceId)
    )
  )
  createEvent.parameters.push(
    new ethereum.EventParam(
      "spaceAddress",
      ethereum.Value.fromAddress(spaceAddress)
    )
  )
  createEvent.parameters.push(
    new ethereum.EventParam(
      "assetId",
      ethereum.Value.fromUnsignedBigInt(assetId)
    )
  )
  createEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )

  return createEvent
}
