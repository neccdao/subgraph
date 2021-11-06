import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  clearStore,
  test,
  assert,
  newMockEvent,
} from "matchstick-as/assembly/index";
import { BuyNUSD } from "../generated/VaultNUSDFacet/VaultNUSDFacet";
import { createBuyNUSDEvent, handleBuyNUSD } from "../src/mapping";
import { addMetadata } from "matchstick-as/assembly/event";

export function runTests(): void {
  test("LP entity is created/updated after BuyNUSD event is emitted. Account and Action entity created too", () => {
    let account = Address.fromString(
      "0xC16081F360e3847006dB660bae1c6d1b2e17eC2A"
    );
    let token = account;
    let tokenAmount = BigInt.fromI32(42);
    let nusdAmount = BigInt.fromI32(42);

    let mockBuyNUSDEvent = createBuyNUSDEvent(
      account,
      token,
      tokenAmount,
      nusdAmount
    );

    addMetadata(mockBuyNUSDEvent);
    let _timestamp = BigInt.fromString("1994");
    mockBuyNUSDEvent.block.timestamp = _timestamp;

    let buyNUSDEvent = newMockEvent(mockBuyNUSDEvent);

    handleBuyNUSD(buyNUSDEvent as BuyNUSD);

    // Account entity
    assert.fieldEquals(
      "Account",
      account.toHexString(),
      "id",
      account.toHexString()
    );

    // Account - Action entity
    let actionId =
      buyNUSDEvent.transaction.hash.toHex() +
      "-" +
      buyNUSDEvent.logIndex.toString();

    assert.fieldEquals("Action", actionId, "id", actionId);
    assert.fieldEquals("Action", actionId, "type", "BuyNUSD");
    assert.fieldEquals("Action", actionId, "account", account.toHexString());
    assert.fieldEquals(
      "Action",
      actionId,
      "timestamp",
      mockBuyNUSDEvent.block.timestamp.toString()
    );
    assert.fieldEquals("Action", actionId, "token", token.toHexString());
    assert.fieldEquals(
      "Action",
      actionId,
      "tokenAmount",
      tokenAmount.toString()
    );
    assert.fieldEquals("Action", actionId, "nusdAmount", nusdAmount.toString());
    // LP Entity
    let lpId = account.toHex() + "-" + token.toHex();

    assert.fieldEquals("LP", lpId, "id", lpId);
    assert.fieldEquals("LP", lpId, "account", account.toHexString());
    assert.fieldEquals("LP", lpId, "token", token.toHexString());
    assert.fieldEquals("LP", lpId, "tokenAmount", tokenAmount.toString());
    assert.fieldEquals("LP", lpId, "nusdAmount", nusdAmount.toString());

    clearStore();
  });
}
