import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  clearStore,
  test,
  assert,
  newMockEvent,
  createMockedFunction,
} from "matchstick-as/assembly/index";
import { CollectSwapFees } from "../generated/VaultLib/VaultLib";
import {
  createBuyNDOLEvent,
  createCollectSwapFeesEvent,
  handleBuyNDOL,
  handleCollectSwapFees,
} from "../src/mapping";
import { addMetadata } from "matchstick-as/assembly/event";
import { VAULT_ADDRESS } from "../src/constants";

export function runTests(): void {
  test("Collateral entity is created/updated after querying Vault.feeReserves[token] after CollectSwapFee event is emitted.", () => {
    let account = Address.fromString(
      "0xC16081F360e3847006dB660bae1c6d1b2e17eC2A"
    );
    let token = account;
    let feeTokens = BigInt.fromI32(42);
    let feeUsd = BigInt.fromI32(42);

    let mockCollectSwapFeesEvent = createCollectSwapFeesEvent(
      token,
      feeUsd,
      feeTokens
    );

    addMetadata(mockCollectSwapFeesEvent);
    let _timestamp = BigInt.fromString("1994");
    mockCollectSwapFeesEvent.block.timestamp = _timestamp;

    let collectSwapFeesEvent = newMockEvent(mockCollectSwapFeesEvent);
    let vaultContractAddress = Address.fromString(VAULT_ADDRESS);

    createMockedFunction(
      vaultContractAddress,
      "feeReserves",
      "feeReserves(address):(uint256)"
    )
      .withArgs([
        ethereum.Value.fromAddress(Address.fromString(token.toHexString())),
      ])
      .returns([ethereum.Value.fromI32(feeTokens.toI32())]);

    handleCollectSwapFees(collectSwapFeesEvent as CollectSwapFees);

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
      "feeReserves",
      feeTokens.toString()
    );

    clearStore();
  });
}
