import {
  Create as CreateEvent,
  SubmitSolution as SubmitSolutionEvent,
  Complete as CompleteEvent
} from "../generated/Wishpool4/Wishpool4"
import { Pool, Solution, Asset, PoolCreateEvent, SubmitSolutionEvent as SubmitSolutionEventEntity, PoolCompleteEvent } from "../generated/schema"
import { fromWei } from "./number"

export function handleCreate(event: CreateEvent): void {
  let pool = new Pool(event.params.poolId.toString())
  pool.asset = event.params.poolId.toString()
  pool.creator = event.params.creator
  pool.solver = event.params.solver
  pool.completed = false
  pool.createdAt = event.block.timestamp
  pool.save()

  let createEvent = new PoolCreateEvent(event.transaction.hash.concatI32(event.logIndex.toI32()))
  createEvent.poolId = event.params.poolId
  createEvent.creator = event.params.creator
  createEvent.solver = event.params.solver
  createEvent.blockNumber = event.block.number
  createEvent.blockTimestamp = event.block.timestamp
  createEvent.transactionHash = event.transaction.hash
  createEvent.save()
}

export function handleSubmitSolution(event: SubmitSolutionEvent): void {
  let solution = new Solution(event.params.solutionId.toString())
  solution.pool = event.params.poolId.toString()
  solution.solver = event.params.solver
  solution.asset = event.params.solutionId.toString()
  solution.submittedAt = event.block.timestamp
  solution.save()

  let submitEvent = new SubmitSolutionEventEntity(event.transaction.hash.concatI32(event.logIndex.toI32()))
  submitEvent.poolId = event.params.poolId
  submitEvent.solver = event.params.solver
  submitEvent.solutionId = event.params.solutionId
  submitEvent.blockNumber = event.block.number
  submitEvent.blockTimestamp = event.block.timestamp
  submitEvent.transactionHash = event.transaction.hash
  submitEvent.save()
}

export function handleComplete(event: CompleteEvent): void {
  let pool = Pool.load(event.params.poolId.toString())
  if (pool) {
    pool.completed = true
    pool.solver = event.params.solver
    pool.completedAt = event.block.timestamp
    pool.completedSolution = event.params.solutionId.toString()
    pool.ethAmount = fromWei(event.params.ethAmount);
    pool.save()
  }

  let completeEvent = new PoolCompleteEvent(event.transaction.hash.concatI32(event.logIndex.toI32()))
  completeEvent.poolId = event.params.poolId
  completeEvent.solver = event.params.solver
  completeEvent.solutionId = event.params.solutionId
  completeEvent.tokenAmount = fromWei(event.params.tokenAmount);
  completeEvent.ethAmount = fromWei(event.params.ethAmount);
  completeEvent.blockNumber = event.block.number
  completeEvent.blockTimestamp = event.block.timestamp
  completeEvent.transactionHash = event.transaction.hash
  completeEvent.save()
}