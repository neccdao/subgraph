import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  clearStore,
  test,
  assert,
  newMockEvent,
} from "matchstick-as/assembly/index";
import { BuyNDOL } from "../generated/VaultNDOLFacet/VaultNDOLFacet";
import { createBuyNDOLEvent, handleBuyNDOL } from "../src/mapping";
import { addMetadata } from "matchstick-as/assembly/event";

export function runTests(): void {
  test("LP entity is created/updated after BuyNDOL event is emitted. Account and Action entity created too", () => {
    let account = Address.fromString(
      "0xC16081F360e3847006dB660bae1c6d1b2e17eC2A"
    );
    let token = account;
    let tokenAmount = BigInt.fromI32(42);
    let ndolAmount = BigInt.fromI32(42);

    let mockBuyNDOLEvent = createBuyNDOLEvent(
      account,
      token,
      tokenAmount,
      ndolAmount
    );

    addMetadata(mockBuyNDOLEvent);
    let _timestamp = BigInt.fromString("1994");
    mockBuyNDOLEvent.block.timestamp = _timestamp;

    let buyNDOLEvent = newMockEvent(mockBuyNDOLEvent);

    handleBuyNDOL(buyNDOLEvent as BuyNDOL);

    // Account entity
    assert.fieldEquals(
      "Account",
      account.toHexString(),
      "id",
      account.toHexString()
    );

    // Account - Action entity
    let actionId =
      buyNDOLEvent.transaction.hash.toHex() +
      "-" +
      buyNDOLEvent.logIndex.toString();

    assert.fieldEquals("Action", actionId, "id", actionId);
    assert.fieldEquals("Action", actionId, "type", "BuyNDOL");
    assert.fieldEquals("Action", actionId, "account", account.toHexString());
    assert.fieldEquals(
      "Action",
      actionId,
      "timestamp",
      mockBuyNDOLEvent.block.timestamp.toString()
    );
    assert.fieldEquals("Action", actionId, "token", token.toHexString());
    assert.fieldEquals(
      "Action",
      actionId,
      "tokenAmount",
      tokenAmount.toString()
    );
    assert.fieldEquals("Action", actionId, "ndolAmount", ndolAmount.toString());
    // LP Entity
    let lpId = account.toHex() + "-" + token.toHex();

    assert.fieldEquals("LP", lpId, "id", lpId);
    assert.fieldEquals("LP", lpId, "account", account.toHexString());
    assert.fieldEquals("LP", lpId, "token", token.toHexString());
    assert.fieldEquals("LP", lpId, "tokenAmount", tokenAmount.toString());
    assert.fieldEquals("LP", lpId, "ndolAmount", ndolAmount.toString());

    clearStore();
  });
}
