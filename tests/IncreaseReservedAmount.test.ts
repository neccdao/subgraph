import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  clearStore,
  test,
  assert,
  newMockEvent,
  createMockedFunction,
} from "matchstick-as/assembly/index";
import { IncreaseReservedAmount } from "../generated/VaultLib/VaultLib";
import {
  createIncreaseReservedAmountEvent,
  handleIncreaseReservedAmount,
} from "../src/mapping";
import { addMetadata } from "matchstick-as/assembly/event";
import { VAULT_ADDRESS } from "../src/constants";

export function runTests(): void {
  test("Collateral entity is created/updated after querying Vault.reservedAmounts[token] after IncreaseReservedAmount event is emitted.", () => {
    let account = Address.fromString(
      "0xC16081F360e3847006dB660bae1c6d1b2e17eC2A"
    );
    let token = account;
    let amount = BigInt.fromI32(42);

    let mockIncreaseReservedAmountEvent = createIncreaseReservedAmountEvent(
      token,
      amount
    );

    addMetadata(mockIncreaseReservedAmountEvent);
    let _timestamp = BigInt.fromString("1994");
    mockIncreaseReservedAmountEvent.block.timestamp = _timestamp;

    let IncreaseReservedAmountEvent = newMockEvent(
      mockIncreaseReservedAmountEvent
    );
    let vaultContractAddress = Address.fromString(VAULT_ADDRESS);

    createMockedFunction(
      vaultContractAddress,
      "reservedAmounts",
      "reservedAmounts(address):(uint256)"
    )
      .withArgs([
        ethereum.Value.fromAddress(Address.fromString(token.toHexString())),
      ])
      .returns([ethereum.Value.fromI32(amount.toI32())]);

    createMockedFunction(
      vaultContractAddress,
      "getUtilisation",
      "getUtilisation(address):(uint256)"
    )
      .withArgs([
        ethereum.Value.fromAddress(Address.fromString(token.toHexString())),
      ])
      .returns([ethereum.Value.fromI32(amount.toI32())]);
    handleIncreaseReservedAmount(
      IncreaseReservedAmountEvent as IncreaseReservedAmount
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
      "reservedAmounts",
      amount.toString()
    );
    assert.fieldEquals(
      "Collateral",
      token.toHexString(),
      "utilisationRate",
      amount.toString()
    );
    clearStore();
  });
}
