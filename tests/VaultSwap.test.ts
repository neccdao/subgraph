import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { addMetadata } from "matchstick-as/assembly/event";
import {
  clearStore,
  test,
  assert,
  newMockEvent,
} from "matchstick-as/assembly/index";
import { Swap as VaultSwapEvent } from "../generated/VaultNDOLFacet/VaultNDOLFacet";
import { handleVaultSwap, createVaultSwapEvent } from "../src/mapping";

export function runTests(): void {
  test("Account and Action entity is saved after vault swap event is emitted", () => {
    let mockVaultSwapEvent = createVaultSwapEvent(
      Address.fromString("0xbfecec47dd8bf5f6264a9830a9d26ef387c38a67"),
      Address.fromString("0xbfecec47dd8bf5f6264a9830a9d26ef387c38a67"),
      Address.fromString("0xbfecec47dd8bf5f6264a9830a9d26ef387c38a67"),
      BigInt.fromI32(1000),
      BigInt.fromI32(1000)
    );
    addMetadata(mockVaultSwapEvent);
    let _timestamp = BigInt.fromString("1994");
    mockVaultSwapEvent.block.timestamp = _timestamp;
    let vaultSwapEvent = newMockEvent(mockVaultSwapEvent);
    handleVaultSwap(vaultSwapEvent as VaultSwapEvent);

    // event.transaction.hash.toHex() + "-" + event.logIndex.toString()
    let id =
      vaultSwapEvent.transaction.hash.toHex() +
      "-" +
      vaultSwapEvent.logIndex.toString();

    let accountId = Address.fromString(
      "0xbfecec47dd8bf5f6264a9830a9d26ef387c38a67"
    ).toHexString();

    // Assert the state of the store
    assert.fieldEquals(
      "Account",
      accountId,
      "id",
      "0xbfecec47dd8bf5f6264a9830a9d26ef387c38a67"
    );
    assert.fieldEquals("Action", id, "type", "Swap");
    assert.fieldEquals(
      "Action",
      id,
      "timestamp",
      vaultSwapEvent.block.timestamp.toString()
    );
    assert.fieldEquals(
      "Action",
      id,
      "account",
      "0xbfecec47dd8bf5f6264a9830a9d26ef387c38a67"
    );
    assert.fieldEquals(
      "Action",
      id,
      "tokenIn",
      "0xbfecec47dd8bf5f6264a9830a9d26ef387c38a67"
    );
    assert.fieldEquals(
      "Action",
      id,
      "tokenOut",
      "0xbfecec47dd8bf5f6264a9830a9d26ef387c38a67"
    );
    assert.fieldEquals("Action", id, "amountIn", "1000");
    assert.fieldEquals("Action", id, "amountOut", "1000");

    clearStore();
  });
}
