import { Bytes } from "@graphprotocol/graph-ts";
import { SafeBuy as SafeBuyEvent } from "../generated/BodhiTradeHelper/BodhiTradeHelper";
import { fromWei } from "./number";
import { SafeBuy } from "../generated/schema";

function newSafeBuy(event: SafeBuyEvent): void {
  let entity = new SafeBuy(
    event.transaction.hash
      .concat(Bytes.fromUTF8("-"))
      .concatI32(event.logIndex.toI32())
  );
  entity.assetId = event.params.assetId;
  entity.sender = event.params.sender;
  entity.tokenAmount = fromWei(event.params.tokenAmount);
  entity.ethAmount = fromWei(event.params.ethAmount);

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleSafeBuy(event: SafeBuyEvent): void {
  newSafeBuy(event);
}
