import {
  CreateWish as CreateWishEvent,
  Submit as SubmitEvent,
  Reward as RewardEvent,
} from "../generated/Wishpool7/Wishpool7";
import { Wish, Submission } from "../generated/schema";
import { fromWei } from "./number";
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
  wish.save();
}

export function handleSubmit(event: SubmitEvent): void {
  let submissionId = event.params.submissionId.toString();
  
  const asset = getOrCreateAsset(event.params.submissionId);
  asset.app = AppSource.WISHPOOL;
  asset.assetType = AssetType.SUBMISSION;
  asset.realCreator = event.params.creator;
  asset.save();
  
  let submission = new Submission(submissionId);
  submission.wish = event.params.wishId.toString();
  submission.creator = event.params.creator;
  submission.asset = submissionId;
  submission.createdAt = event.block.timestamp;
  submission.isRewarded = false;
  submission.save();
}

export function handleReward(event: RewardEvent): void {
  let wishId = event.params.wishId.toString();
  let submissionId = event.params.submissionId.toString();

  let wish = Wish.load(wishId);
  if (wish) {
    wish.closedAt = event.block.timestamp;
    wish.selectedSubmission = submissionId;
    wish.ethAmount = fromWei(event.params.ethAmount);
    wish.tokenAmount = fromWei(event.params.tokenAmount);
    wish.save();
  }

  let submission = Submission.load(submissionId);
  if (submission) {
    submission.isRewarded = true;
    submission.save();
  }
}
