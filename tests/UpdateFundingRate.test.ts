import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  clearStore,
  test,
  assert,
  newMockEvent,
  createMockedFunction,
} from "matchstick-as/assembly/index";
import { UpdateFundingRate } from "../generated/VaultLib/VaultLib";
import {
  createUpdateFundingRateEvent,
  handleUpdateFundingRate,
} from "../src/mapping";
import { addMetadata } from "matchstick-as/assembly/event";
import { VAULT_ADDRESS } from "../src/constants";

export function runTests(): void {
  test("Collateral entity is created/updated after querying Vault.cumulativeFundingRates[token] and lastFundingTimes[_token] after UpdateFundingRate event is emitted.", () => {
    let account = Address.fromString(
      "0xC16081F360e3847006dB660bae1c6d1b2e17eC2A"
    );
    let token = account;
    let amount = BigInt.fromI32(42);
    let lastFundingTime = BigInt.fromI32(1994);

    let mockUpdateFundingRateEvent = createUpdateFundingRateEvent(
      token,
      amount
    );

    addMetadata(mockUpdateFundingRateEvent);
    let _timestamp = BigInt.fromString("1994");
    mockUpdateFundingRateEvent.block.timestamp = _timestamp;

    let UpdateFundingRateEvent = newMockEvent(mockUpdateFundingRateEvent);
    let vaultContractAddress = Address.fromString(VAULT_ADDRESS);

    createMockedFunction(
      vaultContractAddress,
      "cumulativeFundingRates",
      "cumulativeFundingRates(address):(uint256)"
    )
      .withArgs([
        ethereum.Value.fromAddress(Address.fromString(token.toHexString())),
      ])
      .returns([ethereum.Value.fromI32(amount.toI32())]);
    createMockedFunction(
      vaultContractAddress,
      "lastFundingTimes",
      "lastFundingTimes(address):(uint256)"
    )
      .withArgs([
        ethereum.Value.fromAddress(Address.fromString(token.toHexString())),
      ])
      .returns([ethereum.Value.fromI32(lastFundingTime.toI32())]);

    handleUpdateFundingRate(UpdateFundingRateEvent as UpdateFundingRate);

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
      "cumulativeFundingRate",
      amount.toString()
    );
    assert.fieldEquals(
      "Collateral",
      token.toHexString(),
      "lastFundingTime",
      lastFundingTime.toString()
    );

    clearStore();
  });
}
