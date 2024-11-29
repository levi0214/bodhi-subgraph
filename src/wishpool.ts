import {
  CreateWish as CreateWishEvent,
  Submit as SubmitEvent,
  Reward as RewardEvent,
} from "../generated/Wishpool7/Wishpool7";
import { Wish, Submission } from "../generated/schema";
import { fromWei, BD_ZERO, BI_ZERO, BI_ONE } from "./number";
import { getOrCreateAsset } from "./store";
import { AppSource, AssetType } from './types'

export function handleCreateWish(event: CreateWishEvent): void {
  let wishId = event.params.wishId.toString();
  let wish = new Wish(wishId);

  const asset = getOrCreateAsset(event.params.wishId);
  asset.app = AppSource.WISHPOOL;
  asset.assetType = AssetType.WISH;
  asset.realCreator = event.params.creator;
  asset.save();

  wish.asset = wishId;
  wish.creator = event.params.creator;
  wish.solver = event.params.solver;
  wish.createdAt = event.block.timestamp;
  wish.ethAmount = BD_ZERO;
  wish.tokenAmount = BD_ZERO;
  wish.totalSubmissions = BI_ZERO;
  wish.totalRewarded = BI_ZERO;
  wish.save();
}

export function handleSubmit(event: SubmitEvent): void {
  let wishId = event.params.wishId.toString();
  let submissionId = event.params.submissionId.toString();
  
  const asset = getOrCreateAsset(event.params.submissionId);
  asset.app = AppSource.WISHPOOL;
  asset.assetType = AssetType.SUBMISSION;
  asset.realCreator = event.params.creator;
  asset.save();
  
  let submission = new Submission(submissionId);
  submission.wish = wishId;
  submission.creator = event.params.creator;
  submission.asset = submissionId;
  submission.createdAt = event.block.timestamp;
  submission.isRewarded = false;
  submission.save();

  // Increment total submissions counter
  let wish = Wish.load(wishId);
  if (wish) {
    wish.totalSubmissions = wish.totalSubmissions.plus(BI_ONE);
    wish.save();
  }
}

export function handleReward(event: RewardEvent): void {
  let wishId = event.params.wishId.toString();
  let submissionId = event.params.submissionId.toString();

  let wish = Wish.load(wishId);
  if (wish) {
    let ethAmount = fromWei(event.params.ethAmount);
    let tokenAmount = fromWei(event.params.tokenAmount);
    
    // Update accumulated amounts
    wish.ethAmount = wish.ethAmount.plus(ethAmount);
    wish.tokenAmount = wish.tokenAmount.plus(tokenAmount);
    
    // Increment total rewarded counter
    wish.totalRewarded = wish.totalRewarded.plus(BI_ONE);
    wish.save();
  }

  let submission = Submission.load(submissionId);
  if (submission) {
    submission.isRewarded = true;
    submission.rewardedAt = event.block.timestamp;
    submission.ethAmount = fromWei(event.params.ethAmount);
    submission.tokenAmount = fromWei(event.params.tokenAmount);
    submission.save();
  }
}
