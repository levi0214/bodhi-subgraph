import {
  CreateWish as CreateWishEvent,
  CreateResponse as CreateResponseEvent,
  CloseWish as CloseWishEvent,
} from "../generated/Wishpool6/Wishpool6";
import {
  Wish,
  Response,
  CreateWishEvent as CreateWishEventEntity,
  CreateResponseEvent as CreateResponseEventEntity,
  CloseWishEvent as CloseWishEventEntity,
} from "../generated/schema";
import { fromWei } from "./number";

export function handleCreateWish(event: CreateWishEvent): void {
  let wishId = event.params.wishId.toString();
  let wish = new Wish(wishId);
  
  wish.asset = wishId;
  wish.creator = event.params.creator;
  wish.solver = event.params.solver;
  wish.isOpen = true;
  wish.createdAt = event.block.timestamp;
  wish.save();

  let createEvent = new CreateWishEventEntity(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  createEvent.wishId = event.params.wishId;
  createEvent.creator = event.params.creator;
  createEvent.solver = event.params.solver;
  createEvent.blockNumber = event.block.number;
  createEvent.blockTimestamp = event.block.timestamp;
  createEvent.transactionHash = event.transaction.hash;
  createEvent.save();
}

export function handleCreateResponse(event: CreateResponseEvent): void {
  let responseId = event.params.responseId.toString();
  let response = new Response(responseId);
  
  response.wish = event.params.wishId.toString();
  response.creator = event.params.solver;
  response.asset = responseId;
  response.submittedAt = event.block.timestamp;
  response.isRewarded = false;
  response.save();

  let createEvent = new CreateResponseEventEntity(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  createEvent.wishId = event.params.wishId;
  createEvent.solver = event.params.solver;
  createEvent.responseId = event.params.responseId;
  createEvent.blockNumber = event.block.number;
  createEvent.blockTimestamp = event.block.timestamp;
  createEvent.transactionHash = event.transaction.hash;
  createEvent.save();
}

export function handleCloseWish(event: CloseWishEvent): void {
  let wishId = event.params.wishId.toString();
  let responseId = event.params.responseId.toString();
  
  let wish = Wish.load(wishId);
  if (wish) {
    wish.isOpen = false;
    wish.solver = event.params.solver;
    wish.closedAt = event.block.timestamp;
    wish.selectedResponse = responseId;
    wish.ethAmount = fromWei(event.params.ethAmount);
    wish.tokenAmount = fromWei(event.params.tokenAmount);
    wish.save();
  }

  let response = Response.load(responseId);
  if (response) {
    response.isRewarded = true;
    response.save();
  }

  let closeEvent = new CloseWishEventEntity(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  closeEvent.wishId = event.params.wishId;
  closeEvent.solver = event.params.solver;
  closeEvent.responseId = event.params.responseId;
  closeEvent.tokenAmount = fromWei(event.params.tokenAmount);
  closeEvent.ethAmount = fromWei(event.params.ethAmount);
  closeEvent.blockNumber = event.block.number;
  closeEvent.blockTimestamp = event.block.timestamp;
  closeEvent.transactionHash = event.transaction.hash;
  closeEvent.save();
}
