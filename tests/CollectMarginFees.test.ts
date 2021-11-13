import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  clearStore,
  test,
  assert,
  newMockEvent,
  createMockedFunction,
} from "matchstick-as/assembly/index";
import { CollectMarginFees } from "../generated/VaultLib/VaultLib";
import {
  createBuyNDOLEvent,
  createCollectMarginFeesEvent,
  handleBuyNDOL,
  handleCollectMarginFees,
} from "../src/mapping";
import { addMetadata } from "matchstick-as/assembly/event";
import { VAULT_ADDRESS } from "../src/constants";

export function runTests(): void {
  test("Collateral entity is created/updated after querying Vault.feeReserves[token] after CollectMarginFee event is emitted.", () => {
    let account = Address.fromString(
      "0xC16081F360e3847006dB660bae1c6d1b2e17eC2A"
    );
    let token = account;
    let feeTokens = BigInt.fromI32(42);
    let feeUsd = BigInt.fromI32(42);

    let mockCollectMarginFeesEvent = createCollectMarginFeesEvent(
      token,
      feeUsd,
      feeTokens
    );

    addMetadata(mockCollectMarginFeesEvent);
    let _timestamp = BigInt.fromString("1994");
    mockCollectMarginFeesEvent.block.timestamp = _timestamp;

    let collectMarginFeesEvent = newMockEvent(mockCollectMarginFeesEvent);
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

    handleCollectMarginFees(collectMarginFeesEvent as CollectMarginFees);

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
