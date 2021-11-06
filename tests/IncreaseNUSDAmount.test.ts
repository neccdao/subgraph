import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  clearStore,
  test,
  assert,
  newMockEvent,
  createMockedFunction,
} from "matchstick-as/assembly/index";
import { IncreaseNUSDAmount } from "../generated/VaultLib/VaultLib";
import {
  createIncreaseNUSDAmountEvent,
  handleIncreaseNUSDAmount,
} from "../src/mapping";
import { addMetadata } from "matchstick-as/assembly/event";
import { VAULT_ADDRESS } from "../src/constants";

export function runTests(): void {
  test("Collateral entity is created/updated after querying Vault.nusdAmounts[token] and Vault.getMaxNUSDAmount() after IncreaseNUSDAmount event is emitted", () => {
    let account = Address.fromString(
      "0xC16081F360e3847006dB660bae1c6d1b2e17eC2A"
    );
    let token = account;
    let amount = BigInt.fromI32(42);

    let mockIncreaseNUSDAmountEvent = createIncreaseNUSDAmountEvent(
      token,
      amount
    );

    addMetadata(mockIncreaseNUSDAmountEvent);
    let _timestamp = BigInt.fromString("1994");
    mockIncreaseNUSDAmountEvent.block.timestamp = _timestamp;

    let IncreaseNUSDAmountEvent = newMockEvent(mockIncreaseNUSDAmountEvent);
    let vaultContractAddress = Address.fromString(VAULT_ADDRESS);

    createMockedFunction(
      vaultContractAddress,
      "nusdAmounts",
      "nusdAmounts(address):(uint256)"
    )
      .withArgs([
        ethereum.Value.fromAddress(Address.fromString(token.toHexString())),
      ])
      .returns([ethereum.Value.fromI32(amount.toI32())]);

    createMockedFunction(
      vaultContractAddress,
      "getMaxNUSDAmount",
      "getMaxNUSDAmount():(uint256)"
    ).returns([ethereum.Value.fromI32(100)]);

    handleIncreaseNUSDAmount(IncreaseNUSDAmountEvent as IncreaseNUSDAmount);

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
      "nusdAmounts",
      amount.toString()
    );
    clearStore();
  });
}
