// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class ClearTokenConfig extends ethereum.Event {
  get params(): ClearTokenConfig__Params {
    return new ClearTokenConfig__Params(this);
  }
}

export class ClearTokenConfig__Params {
  _event: ClearTokenConfig;

  constructor(event: ClearTokenConfig) {
    this._event = event;
  }

  get _token(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class DirectPoolDeposit extends ethereum.Event {
  get params(): DirectPoolDeposit__Params {
    return new DirectPoolDeposit__Params(this);
  }
}

export class DirectPoolDeposit__Params {
  _event: DirectPoolDeposit;

  constructor(event: DirectPoolDeposit) {
    this._event = event;
  }

  get token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class SetPriceSpreadBasisPoints extends ethereum.Event {
  get params(): SetPriceSpreadBasisPoints__Params {
    return new SetPriceSpreadBasisPoints__Params(this);
  }
}

export class SetPriceSpreadBasisPoints__Params {
  _event: SetPriceSpreadBasisPoints;

  constructor(event: SetPriceSpreadBasisPoints) {
    this._event = event;
  }

  get _token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _priceSpreadBasisPoints(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class SetRedemptionBasisPoints extends ethereum.Event {
  get params(): SetRedemptionBasisPoints__Params {
    return new SetRedemptionBasisPoints__Params(this);
  }
}

export class SetRedemptionBasisPoints__Params {
  _event: SetRedemptionBasisPoints;

  constructor(event: SetRedemptionBasisPoints) {
    this._event = event;
  }

  get _token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _basisPoints(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class SetTokenConfig extends ethereum.Event {
  get params(): SetTokenConfig__Params {
    return new SetTokenConfig__Params(this);
  }
}

export class SetTokenConfig__Params {
  _event: SetTokenConfig;

  constructor(event: SetTokenConfig) {
    this._event = event;
  }

  get _token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _tokenDecimals(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get _minProfitBasisPoints(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get _priceFeed(): Address {
    return this._event.parameters[3].value.toAddress();
  }

  get _priceDecimals(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get _priceSpreadBasisPoints(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get _tokenWeight(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }

  get _baseTokenPair(): Address {
    return this._event.parameters[7].value.toAddress();
  }

  get _tokenPair(): Address {
    return this._event.parameters[8].value.toAddress();
  }
}

export class WithdrawFees extends ethereum.Event {
  get params(): WithdrawFees__Params {
    return new WithdrawFees__Params(this);
  }
}

export class WithdrawFees__Params {
  _event: WithdrawFees;

  constructor(event: WithdrawFees) {
    this._event = event;
  }

  get _token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get _receiver(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get _amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class VaultConfigFacet extends ethereum.SmartContract {
  static bind(address: Address): VaultConfigFacet {
    return new VaultConfigFacet("VaultConfigFacet", address);
  }

  gov(): Address {
    let result = super.call("gov", "gov():(address)", []);

    return result[0].toAddress();
  }

  try_gov(): ethereum.CallResult<Address> {
    let result = super.tryCall("gov", "gov():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  isInitialized(): boolean {
    let result = super.call("isInitialized", "isInitialized():(bool)", []);

    return result[0].toBoolean();
  }

  try_isInitialized(): ethereum.CallResult<boolean> {
    let result = super.tryCall("isInitialized", "isInitialized():(bool)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  minProfitBasisPoints(_token: Address): BigInt {
    let result = super.call(
      "minProfitBasisPoints",
      "minProfitBasisPoints(address):(uint256)",
      [ethereum.Value.fromAddress(_token)]
    );

    return result[0].toBigInt();
  }

  try_minProfitBasisPoints(_token: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "minProfitBasisPoints",
      "minProfitBasisPoints(address):(uint256)",
      [ethereum.Value.fromAddress(_token)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  redemptionBasisPoints(_token: Address): BigInt {
    let result = super.call(
      "redemptionBasisPoints",
      "redemptionBasisPoints(address):(uint256)",
      [ethereum.Value.fromAddress(_token)]
    );

    return result[0].toBigInt();
  }

  try_redemptionBasisPoints(_token: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "redemptionBasisPoints",
      "redemptionBasisPoints(address):(uint256)",
      [ethereum.Value.fromAddress(_token)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  tokenDecimals(_token: Address): BigInt {
    let result = super.call(
      "tokenDecimals",
      "tokenDecimals(address):(uint256)",
      [ethereum.Value.fromAddress(_token)]
    );

    return result[0].toBigInt();
  }

  try_tokenDecimals(_token: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "tokenDecimals",
      "tokenDecimals(address):(uint256)",
      [ethereum.Value.fromAddress(_token)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  tokenWeights(_token: Address): BigInt {
    let result = super.call("tokenWeights", "tokenWeights(address):(uint256)", [
      ethereum.Value.fromAddress(_token)
    ]);

    return result[0].toBigInt();
  }

  try_tokenWeights(_token: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "tokenWeights",
      "tokenWeights(address):(uint256)",
      [ethereum.Value.fromAddress(_token)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  totalTokenWeight(): BigInt {
    let result = super.call(
      "totalTokenWeight",
      "totalTokenWeight():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_totalTokenWeight(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "totalTokenWeight",
      "totalTokenWeight():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  whitelistedTokenCount(): BigInt {
    let result = super.call(
      "whitelistedTokenCount",
      "whitelistedTokenCount():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_whitelistedTokenCount(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "whitelistedTokenCount",
      "whitelistedTokenCount():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  whitelistedTokens(_token: Address): boolean {
    let result = super.call(
      "whitelistedTokens",
      "whitelistedTokens(address):(bool)",
      [ethereum.Value.fromAddress(_token)]
    );

    return result[0].toBoolean();
  }

  try_whitelistedTokens(_token: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "whitelistedTokens",
      "whitelistedTokens(address):(bool)",
      [ethereum.Value.fromAddress(_token)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  withdrawFees(_token: Address, _receiver: Address): BigInt {
    let result = super.call(
      "withdrawFees",
      "withdrawFees(address,address):(uint256)",
      [
        ethereum.Value.fromAddress(_token),
        ethereum.Value.fromAddress(_receiver)
      ]
    );

    return result[0].toBigInt();
  }

  try_withdrawFees(
    _token: Address,
    _receiver: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "withdrawFees",
      "withdrawFees(address,address):(uint256)",
      [
        ethereum.Value.fromAddress(_token),
        ethereum.Value.fromAddress(_receiver)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ClearTokenConfigCall extends ethereum.Call {
  get inputs(): ClearTokenConfigCall__Inputs {
    return new ClearTokenConfigCall__Inputs(this);
  }

  get outputs(): ClearTokenConfigCall__Outputs {
    return new ClearTokenConfigCall__Outputs(this);
  }
}

export class ClearTokenConfigCall__Inputs {
  _call: ClearTokenConfigCall;

  constructor(call: ClearTokenConfigCall) {
    this._call = call;
  }

  get _token(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ClearTokenConfigCall__Outputs {
  _call: ClearTokenConfigCall;

  constructor(call: ClearTokenConfigCall) {
    this._call = call;
  }
}

export class DirectPoolDepositCall extends ethereum.Call {
  get inputs(): DirectPoolDepositCall__Inputs {
    return new DirectPoolDepositCall__Inputs(this);
  }

  get outputs(): DirectPoolDepositCall__Outputs {
    return new DirectPoolDepositCall__Outputs(this);
  }
}

export class DirectPoolDepositCall__Inputs {
  _call: DirectPoolDepositCall;

  constructor(call: DirectPoolDepositCall) {
    this._call = call;
  }

  get _token(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class DirectPoolDepositCall__Outputs {
  _call: DirectPoolDepositCall;

  constructor(call: DirectPoolDepositCall) {
    this._call = call;
  }
}

export class InitializeCall extends ethereum.Call {
  get inputs(): InitializeCall__Inputs {
    return new InitializeCall__Inputs(this);
  }

  get outputs(): InitializeCall__Outputs {
    return new InitializeCall__Outputs(this);
  }
}

export class InitializeCall__Inputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }

  get _weth(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _nusd(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class InitializeCall__Outputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class SetGovCall extends ethereum.Call {
  get inputs(): SetGovCall__Inputs {
    return new SetGovCall__Inputs(this);
  }

  get outputs(): SetGovCall__Outputs {
    return new SetGovCall__Outputs(this);
  }
}

export class SetGovCall__Inputs {
  _call: SetGovCall;

  constructor(call: SetGovCall) {
    this._call = call;
  }

  get _newGov(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetGovCall__Outputs {
  _call: SetGovCall;

  constructor(call: SetGovCall) {
    this._call = call;
  }
}

export class SetPriceSpreadBasisPointsCall extends ethereum.Call {
  get inputs(): SetPriceSpreadBasisPointsCall__Inputs {
    return new SetPriceSpreadBasisPointsCall__Inputs(this);
  }

  get outputs(): SetPriceSpreadBasisPointsCall__Outputs {
    return new SetPriceSpreadBasisPointsCall__Outputs(this);
  }
}

export class SetPriceSpreadBasisPointsCall__Inputs {
  _call: SetPriceSpreadBasisPointsCall;

  constructor(call: SetPriceSpreadBasisPointsCall) {
    this._call = call;
  }

  get _token(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _priceSpreadBasisPoints(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class SetPriceSpreadBasisPointsCall__Outputs {
  _call: SetPriceSpreadBasisPointsCall;

  constructor(call: SetPriceSpreadBasisPointsCall) {
    this._call = call;
  }
}

export class SetRedemptionBasisPointsCall extends ethereum.Call {
  get inputs(): SetRedemptionBasisPointsCall__Inputs {
    return new SetRedemptionBasisPointsCall__Inputs(this);
  }

  get outputs(): SetRedemptionBasisPointsCall__Outputs {
    return new SetRedemptionBasisPointsCall__Outputs(this);
  }
}

export class SetRedemptionBasisPointsCall__Inputs {
  _call: SetRedemptionBasisPointsCall;

  constructor(call: SetRedemptionBasisPointsCall) {
    this._call = call;
  }

  get _token(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _redemptionBasisPoints(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class SetRedemptionBasisPointsCall__Outputs {
  _call: SetRedemptionBasisPointsCall;

  constructor(call: SetRedemptionBasisPointsCall) {
    this._call = call;
  }
}

export class SetTokenConfigCall extends ethereum.Call {
  get inputs(): SetTokenConfigCall__Inputs {
    return new SetTokenConfigCall__Inputs(this);
  }

  get outputs(): SetTokenConfigCall__Outputs {
    return new SetTokenConfigCall__Outputs(this);
  }
}

export class SetTokenConfigCall__Inputs {
  _call: SetTokenConfigCall;

  constructor(call: SetTokenConfigCall) {
    this._call = call;
  }

  get _token(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _tokenDecimals(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get _minProfitBasisPoints(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _priceFeed(): Address {
    return this._call.inputValues[3].value.toAddress();
  }

  get _priceDecimals(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get _priceSpreadBasisPoints(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }

  get _tokenWeight(): BigInt {
    return this._call.inputValues[6].value.toBigInt();
  }

  get _baseTokenPair(): Address {
    return this._call.inputValues[7].value.toAddress();
  }

  get _tokenPair(): Address {
    return this._call.inputValues[8].value.toAddress();
  }
}

export class SetTokenConfigCall__Outputs {
  _call: SetTokenConfigCall;

  constructor(call: SetTokenConfigCall) {
    this._call = call;
  }
}

export class WithdrawFeesCall extends ethereum.Call {
  get inputs(): WithdrawFeesCall__Inputs {
    return new WithdrawFeesCall__Inputs(this);
  }

  get outputs(): WithdrawFeesCall__Outputs {
    return new WithdrawFeesCall__Outputs(this);
  }
}

export class WithdrawFeesCall__Inputs {
  _call: WithdrawFeesCall;

  constructor(call: WithdrawFeesCall) {
    this._call = call;
  }

  get _token(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _receiver(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class WithdrawFeesCall__Outputs {
  _call: WithdrawFeesCall;

  constructor(call: WithdrawFeesCall) {
    this._call = call;
  }

  get value0(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}