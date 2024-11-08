import {
  CreateWish as CreateWishEvent,
  CreateResponse as CreateResponseEvent,
  CloseWish as CloseWishEvent,
} from "../generated/Wishpool6/Wishpool6";
import { Wish, Response } from "../generated/schema";
import { fromWei } from "./number";
import { getOrCreateAsset } from "./store";
import { AppSource, AssetType } from './types'

export function handleCreateWish(event: CreateWishEvent): void {
  let wishId = event.params.wishId.toString();
  let wish = new Wish(wishId);

  const asset = getOrCreateAsset(event.params.wishId);
  asset.app = AppSource.WISHPOOL;
  asset.assetType = AssetType.WISH;
  asset.save();

  wish.asset = wishId;
  wish.creator = event.params.creator;
  wish.solver = event.params.solver;
  wish.isOpen = true;
  wish.createdAt = event.block.timestamp;
  wish.save();
}

export function handleCreateResponse(event: CreateResponseEvent): void {
  let responseId = event.params.responseId.toString();
  
  const asset = getOrCreateAsset(event.params.responseId);
  asset.app = AppSource.WISHPOOL;
  asset.assetType = AssetType.RESPONSE;
  asset.save();
  
  let response = new Response(responseId);

  response.wish = event.params.wishId.toString();
  response.creator = event.params.solver;
  response.asset = responseId;
  response.submittedAt = event.block.timestamp;
  response.isRewarded = false;
  response.save();
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
}
