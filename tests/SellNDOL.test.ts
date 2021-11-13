import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  clearStore,
  test,
  assert,
  newMockEvent,
} from "matchstick-as/assembly/index";
import { BuyNDOL, SellNDOL } from "../generated/VaultNDOLFacet/VaultNDOLFacet";
import {
  createBuyNDOLEvent,
  createSellNDOLEvent,
  handleBuyNDOL,
  handleSellNDOL,
} from "../src/mapping";
import { addMetadata } from "matchstick-as/assembly/event";

export function runTests(): void {
  test("LP entity is updated after BuyNDOL and SellNDOL event is emitted. Account and Action entities created too", () => {
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

    //
    // SellNDOL event
    //

    let sellTokenAmount = tokenAmount.minus(BigInt.fromI32(1));
    let sellNDOLAmount = ndolAmount.minus(BigInt.fromI32(1));

    let mockSellNDOLEvent = createSellNDOLEvent(
      account,
      token,
      sellTokenAmount,
      sellNDOLAmount
    );

    addMetadata(mockSellNDOLEvent);
    let sellNDOLTimeStamp = BigInt.fromString("1995");
    mockSellNDOLEvent.block.timestamp = sellNDOLTimeStamp;

    let sellNDOLEvent = newMockEvent(mockSellNDOLEvent);

    handleSellNDOL(sellNDOLEvent as SellNDOL);

    // Account - Action entity
    actionId =
      sellNDOLEvent.transaction.hash.toHex() +
      "-" +
      sellNDOLEvent.logIndex.toString();

    assert.fieldEquals("Action", actionId, "id", actionId);
    assert.fieldEquals("Action", actionId, "type", "SellNDOL");
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
      sellTokenAmount.toString()
    );
    assert.fieldEquals(
      "Action",
      actionId,
      "ndolAmount",
      sellNDOLAmount.toString()
    );

    // LP Entity updated

    assert.fieldEquals("LP", lpId, "id", lpId);
    assert.fieldEquals("LP", lpId, "account", account.toHexString());
    assert.fieldEquals("LP", lpId, "token", token.toHexString());
    assert.fieldEquals("LP", lpId, "tokenAmount", "1");
    assert.fieldEquals("LP", lpId, "ndolAmount", "1");

    clearStore();
  });
}
