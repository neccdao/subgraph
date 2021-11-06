import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  clearStore,
  test,
  assert,
  newMockEvent,
  createMockedFunction,
} from "matchstick-as/assembly/index";
import { IncreaseGuaranteedUsd } from "../generated/VaultLib/VaultLib";
import {
  createBuyNUSDEvent,
  createIncreaseGuaranteedUsdEvent,
  handleBuyNUSD,
  handleIncreaseGuaranteedUsd,
} from "../src/mapping";
import { addMetadata } from "matchstick-as/assembly/event";
import { VAULT_ADDRESS } from "../src/constants";

export function runTests(): void {
  test("Collateral entity is created/updated after querying Vault.guaranteedUsd[token] after IncreaseGuaranteedUsd event is emitted.", () => {
    let account = Address.fromString(
      "0xC16081F360e3847006dB660bae1c6d1b2e17eC2A"
    );
    let token = account;
    let amount = BigInt.fromI32(42);

    let mockIncreaseGuaranteedUsdEvent = createIncreaseGuaranteedUsdEvent(
      token,
      amount
    );

    addMetadata(mockIncreaseGuaranteedUsdEvent);
    let _timestamp = BigInt.fromString("1994");
    mockIncreaseGuaranteedUsdEvent.block.timestamp = _timestamp;

    let IncreaseGuaranteedUsdEvent = newMockEvent(
      mockIncreaseGuaranteedUsdEvent
    );
    let vaultContractAddress = Address.fromString(VAULT_ADDRESS);

    createMockedFunction(
      vaultContractAddress,
      "guaranteedUsd",
      "guaranteedUsd(address):(uint256)"
    )
      .withArgs([
        ethereum.Value.fromAddress(Address.fromString(token.toHexString())),
      ])
      .returns([ethereum.Value.fromI32(amount.toI32())]);

    handleIncreaseGuaranteedUsd(
      IncreaseGuaranteedUsdEvent as IncreaseGuaranteedUsd
    );

    // Collateral entity
    assert.fieldEquals(
      "Collateral",
      token.toHexString(),
      "id",
      token.toHexString()
    );
    assert.fieldEquals(
      "Collateral",
      token.toHexString(),
      "guaranteedUsd",
      amount.toString()
    );

    clearStore();
  });
}
