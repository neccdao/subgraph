import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  clearStore,
  test,
  assert,
  newMockEvent,
  createMockedFunction,
} from "matchstick-as/assembly/index";
import { IncreasePoolAmount } from "../generated/VaultLib/VaultLib";
import {
  createBuyNDOLEvent,
  createIncreasePoolAmountEvent,
  handleBuyNDOL,
  handleIncreasePoolAmount,
} from "../src/mapping";
import { addMetadata } from "matchstick-as/assembly/event";
import { VAULT_ADDRESS } from "../src/constants";

export function runTests(): void {
  test("Collateral entity is created/updated after querying Vault.PoolAmounts[token] after IncreasePoolAmount event is emitted.", () => {
    let account = Address.fromString(
      "0xC16081F360e3847006dB660bae1c6d1b2e17eC2A"
    );
    let token = account;
    let amount = BigInt.fromI32(42);

    let mockIncreasePoolAmountEvent = createIncreasePoolAmountEvent(
      token,
      amount
    );

    addMetadata(mockIncreasePoolAmountEvent);
    let _timestamp = BigInt.fromString("1994");
    mockIncreasePoolAmountEvent.block.timestamp = _timestamp;

    let IncreasePoolAmountEvent = newMockEvent(mockIncreasePoolAmountEvent);
    let vaultContractAddress = Address.fromString(VAULT_ADDRESS);

    createMockedFunction(
      vaultContractAddress,
      "poolAmounts",
      "poolAmounts(address):(uint256)"
    )
      .withArgs([
        ethereum.Value.fromAddress(Address.fromString(token.toHexString())),
      ])
      .returns([ethereum.Value.fromI32(amount.toI32())]);

    handleIncreasePoolAmount(IncreasePoolAmountEvent as IncreasePoolAmount);

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
      "poolAmounts",
      amount.toString()
    );

    clearStore();
  });
}
