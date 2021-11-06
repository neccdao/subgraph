import {
  Address,
  BigInt,
  ethereum,
  Bytes,
  Value,
} from "@graphprotocol/graph-ts";
import {
  clearStore,
  test,
  assert,
  newMockEvent,
  createMockedFunction,
} from "matchstick-as/assembly/index";
import {
  IncreasePosition,
  UpdatePosition,
  DecreasePosition,
} from "../generated/VaultFacet/VaultFacet";
import {
  createIncreasePositionEvent,
  handleIncreasePosition,
  createUpdatePositionEvent,
  handleUpdatePosition,
  createDecreasePositionEvent,
  handleDecreasePosition,
} from "../src/mapping";
import { log } from "matchstick-as/assembly/log";
import { VAULT_ADDRESS } from "../src/constants";
import { addMetadata } from "matchstick-as/assembly/event";

export function runTests(): void {
  test("Position, entity is updated after IncreasePosition and UpdatePosition then DecreasePosition and UpdatePosition events. Account and Action entity created and derived", () => {
    let _key = Bytes.fromHexString(
      "0xC16081F360e3847006dB660bae1c6d1b2e17eC2A"
    ) as Bytes;

    let _account = Address.fromString(
      "0xC16081F360e3847006dB660bae1c6d1b2e17eC2A"
    );
    let _collateralToken = _account;
    let _indexToken = _account;
    let _collateralDeltaUsd = BigInt.fromI32(42);
    let _sizeDelta = BigInt.fromI32(42);
    let _isLong = true;
    let _price = BigInt.fromI32(42);
    let _fee = BigInt.fromI32(42);

    let mockIncreasePositionEvent = createIncreasePositionEvent(
      _key,
      _account,
      _collateralToken,
      _indexToken,
      _collateralDeltaUsd,
      _sizeDelta,
      _isLong,
      _price,
      _fee
    );

    addMetadata(mockIncreasePositionEvent);
    let increaseTimestamp = BigInt.fromString("1994");
    mockIncreasePositionEvent.block.timestamp = increaseTimestamp;

    let vaultContractAddress = Address.fromString(VAULT_ADDRESS);

    createMockedFunction(
      vaultContractAddress,
      "cumulativeFundingRates",
      "cumulativeFundingRates(address):(uint256)"
    )
      .withArgs([
        ethereum.Value.fromBytes(Address.fromString(_collateralToken.toHex())),
      ])
      .returns([ethereum.Value.fromI32(1337)]);

    let increasePositionEvent = newMockEvent(mockIncreasePositionEvent);

    handleIncreasePosition(increasePositionEvent as IncreasePosition);

    // Account - Position entity
    assert.fieldEquals("Position", _key.toHex(), "key", _key.toHex());
    assert.fieldEquals("Position", _key.toHex(), "averagePrice", "0");
    assert.fieldEquals(
      "Position",
      _key.toHex(),
      "account",
      _account.toHexString()
    );
    assert.fieldEquals("Position", _key.toHex(), "size", "42");
    assert.fieldEquals("Position", _key.toHex(), "collateral", "42");
    assert.fieldEquals(
      "Position",
      _key.toHex(),
      "collateralToken",
      _collateralToken.toHexString()
    );
    assert.fieldEquals(
      "Position",
      _key.toHex(),
      "indexToken",
      _indexToken.toHexString()
    );
    assert.fieldEquals(
      "Position",
      _key.toHexString(),
      "isLong",
      _isLong.toString()
    );
    assert.fieldEquals("Position", _key.toHexString(), "averagePrice", "0");
    assert.fieldEquals("Position", _key.toHexString(), "reserveAmount", "0");
    assert.fieldEquals(
      "Position",
      _key.toHexString(),
      "entryFundingRate",
      "1337"
    );
    assert.fieldEquals("Position", _key.toHexString(), "realisedPnl", "0");
    assert.fieldEquals(
      "Position",
      _key.toHexString(),
      "lastIncreasedTime",
      "1994"
    );

    assert.fieldEquals("Account", _key.toHex(), "id", _account.toHexString());

    // Account - Action entity

    let actionId =
      increasePositionEvent.transaction.hash.toHexString() +
      "-" +
      increasePositionEvent.logIndex.toString();

    assert.fieldEquals("Action", actionId, "id", actionId);
    assert.fieldEquals(
      "Action",
      actionId,
      "timestamp",
      increaseTimestamp.toString()
    );
    assert.fieldEquals("Action", actionId, "account", _account.toHexString());
    assert.fieldEquals("Action", actionId, "type", "IncreasePosition");
    assert.fieldEquals(
      "Action",
      actionId,
      "collateralToken",
      _collateralToken.toHexString()
    );
    assert.fieldEquals(
      "Action",
      actionId,
      "indexToken",
      _indexToken.toHexString()
    );
    assert.fieldEquals("Action", actionId, "sizeDelta", _sizeDelta.toString());
    assert.fieldEquals(
      "Action",
      actionId,
      "collateralDelta",
      _collateralDeltaUsd.toString()
    );
    assert.fieldEquals("Action", actionId, "isLong", _isLong.toString());
    assert.fieldEquals("Action", actionId, "price", _price.toString());
    assert.fieldEquals("Action", actionId, "fee", _fee.toString());

    //
    // UpdatePosition
    //

    let size = _sizeDelta;
    let collateral = _sizeDelta;
    let averagePrice = _sizeDelta;
    let entryFundingRate = _sizeDelta;
    let reserveAmount = _sizeDelta;
    let realisedPnl = _sizeDelta;

    let mockUpdatePositionEvent = createUpdatePositionEvent(
      _key,
      size,
      collateral,
      averagePrice,
      entryFundingRate,
      reserveAmount,
      realisedPnl
    );

    addMetadata(mockUpdatePositionEvent);
    let updateTimestamp = BigInt.fromString("1995");
    mockUpdatePositionEvent.block.timestamp = updateTimestamp;

    let updatePositionEvent = newMockEvent(mockUpdatePositionEvent);

    handleUpdatePosition(updatePositionEvent as UpdatePosition);

    assert.fieldEquals("Position", _key.toHexString(), "averagePrice", "42");
    assert.fieldEquals("Position", _key.toHexString(), "size", "42");
    assert.fieldEquals("Position", _key.toHexString(), "collateral", "42");
    assert.fieldEquals("Position", _key.toHexString(), "averagePrice", "42");
    assert.fieldEquals(
      "Position",
      _key.toHexString(),
      "entryFundingRate",
      "42"
    );
    assert.fieldEquals("Position", _key.toHexString(), "reserveAmount", "42");
    assert.fieldEquals("Position", _key.toHexString(), "realisedPnl", "42");

    assert.fieldEquals(
      "Position",
      _key.toHexString(),
      "lastIncreasedTime",
      "1995"
    );

    //
    // DecreasePosition - Action entity
    //

    let mockDecreasePositionEvent = createDecreasePositionEvent(
      _key,
      _account,
      _collateralToken,
      _indexToken,
      _collateralDeltaUsd,
      _sizeDelta,
      _isLong,
      _price,
      _fee
    );

    addMetadata(mockDecreasePositionEvent);
    let decreaseTimestamp = BigInt.fromString("1996");
    mockDecreasePositionEvent.block.timestamp = decreaseTimestamp;

    let decreasePositionEvent = newMockEvent(mockDecreasePositionEvent);

    handleDecreasePosition(decreasePositionEvent as DecreasePosition);

    actionId =
      decreasePositionEvent.transaction.hash.toHexString() +
      "-" +
      decreasePositionEvent.logIndex.toString();

    assert.fieldEquals("Action", actionId, "id", actionId);
    assert.fieldEquals(
      "Action",
      actionId,
      "timestamp",
      decreaseTimestamp.toString()
    );
    assert.fieldEquals("Action", actionId, "account", _account.toHexString());
    assert.fieldEquals("Action", actionId, "type", "DecreasePosition");
    assert.fieldEquals(
      "Action",
      actionId,
      "collateralToken",
      _collateralToken.toHexString()
    );
    assert.fieldEquals(
      "Action",
      actionId,
      "indexToken",
      _indexToken.toHexString()
    );
    assert.fieldEquals("Action", actionId, "sizeDelta", _sizeDelta.toString());
    assert.fieldEquals(
      "Action",
      actionId,
      "collateralDelta",
      _collateralDeltaUsd.toString()
    );
    assert.fieldEquals("Action", actionId, "isLong", _isLong.toString());
    assert.fieldEquals("Action", actionId, "price", _price.toString());
    assert.fieldEquals("Action", actionId, "fee", _fee.toString());

    //
    // UpdatePosition
    //

    mockUpdatePositionEvent = createUpdatePositionEvent(
      _key,
      size,
      collateral,
      averagePrice,
      entryFundingRate,
      reserveAmount,
      realisedPnl
    );

    addMetadata(mockUpdatePositionEvent);
    updateTimestamp = BigInt.fromString("1997");
    mockUpdatePositionEvent.block.timestamp = updateTimestamp;

    updatePositionEvent = newMockEvent(mockUpdatePositionEvent);

    handleUpdatePosition(updatePositionEvent as UpdatePosition);

    assert.fieldEquals("Position", _key.toHexString(), "averagePrice", "42");
    assert.fieldEquals("Position", _key.toHexString(), "size", "42");
    assert.fieldEquals("Position", _key.toHexString(), "collateral", "42");
    assert.fieldEquals("Position", _key.toHexString(), "averagePrice", "42");
    assert.fieldEquals(
      "Position",
      _key.toHexString(),
      "entryFundingRate",
      "42"
    );
    assert.fieldEquals("Position", _key.toHexString(), "reserveAmount", "42");
    assert.fieldEquals("Position", _key.toHexString(), "realisedPnl", "42");

    assert.fieldEquals(
      "Position",
      _key.toHexString(),
      "lastIncreasedTime",
      "1997"
    );

    clearStore();
  });
}
