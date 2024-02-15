import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { Create } from "../generated/schema"
import { Create as CreateEvent } from "../generated/SpaceFactory/SpaceFactory"
import { handleCreate } from "../src/space-factory"
import { createCreateEvent } from "./space-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let spaceId = BigInt.fromI32(234)
    let spaceAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let assetId = BigInt.fromI32(234)
    let creator = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newCreateEvent = createCreateEvent(
      spaceId,
      spaceAddress,
      assetId,
      creator
    )
    handleCreate(newCreateEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Create created and stored", () => {
    assert.entityCount("Create", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Create",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "spaceId",
      "234"
    )
    assert.fieldEquals(
      "Create",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "spaceAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Create",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "assetId",
      "234"
    )
    assert.fieldEquals(
      "Create",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "creator",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
