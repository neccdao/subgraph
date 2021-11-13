import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  clearStore,
  test,
  assert,
  newMockEvent,
  createMockedFunction,
} from "matchstick-as/assembly/index";
import { IncreaseNDOLAmount } from "../generated/VaultLib/VaultLib";
import {
  createIncreaseNDOLAmountEvent,
  handleIncreaseNDOLAmount,
} from "../src/mapping";
import { addMetadata } from "matchstick-as/assembly/event";
import { VAULT_ADDRESS } from "../src/constants";

export function runTests(): void {
  test("Collateral entity is created/updated after querying Vault.ndolAmounts[token] and Vault.getMaxNDOLAmount() after IncreaseNDOLAmount event is emitted", () => {
    let account = Address.fromString(
      "0xC16081F360e3847006dB660bae1c6d1b2e17eC2A"
    );
    let token = account;
    let amount = BigInt.fromI32(42);

    let mockIncreaseNDOLAmountEvent = createIncreaseNDOLAmountEvent(
      token,
      amount
    );

    addMetadata(mockIncreaseNDOLAmountEvent);
    let _timestamp = BigInt.fromString("1994");
    mockIncreaseNDOLAmountEvent.block.timestamp = _timestamp;

    let IncreaseNDOLAmountEvent = newMockEvent(mockIncreaseNDOLAmountEvent);
    let vaultContractAddress = Address.fromString(VAULT_ADDRESS);

    createMockedFunction(
      vaultContractAddress,
      "ndolAmounts",
      "ndolAmounts(address):(uint256)"
    )
      .withArgs([
        ethereum.Value.fromAddress(Address.fromString(token.toHexString())),
      ])
      .returns([ethereum.Value.fromI32(amount.toI32())]);

    createMockedFunction(
      vaultContractAddress,
      "getMaxNDOLAmount",
      "getMaxNDOLAmount():(uint256)"
    ).returns([ethereum.Value.fromI32(100)]);

    handleIncreaseNDOLAmount(IncreaseNDOLAmountEvent as IncreaseNDOLAmount);

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
      "ndolAmounts",
      amount.toString()
    );
    clearStore();
  });
}
