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

export class CollectMarginFees extends ethereum.Event {
  get params(): CollectMarginFees__Params {
    return new CollectMarginFees__Params(this);
  }
}

export class CollectMarginFees__Params {
  _event: CollectMarginFees;

  constructor(event: CollectMarginFees) {
    this._event = event;
  }

  get token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get feeUsd(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get feeTokens(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class CollectSwapFees extends ethereum.Event {
  get params(): CollectSwapFees__Params {
    return new CollectSwapFees__Params(this);
  }
}

export class CollectSwapFees__Params {
  _event: CollectSwapFees;

  constructor(event: CollectSwapFees) {
    this._event = event;
  }

  get token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get feeUsd(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get feeTokens(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class DecreaseGuaranteedUsd extends ethereum.Event {
  get params(): DecreaseGuaranteedUsd__Params {
    return new DecreaseGuaranteedUsd__Params(this);
  }
}

export class DecreaseGuaranteedUsd__Params {
  _event: DecreaseGuaranteedUsd;

  constructor(event: DecreaseGuaranteedUsd) {
    this._event = event;
  }

  get token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class DecreaseNDOLAmount extends ethereum.Event {
  get params(): DecreaseNDOLAmount__Params {
    return new DecreaseNDOLAmount__Params(this);
  }
}

export class DecreaseNDOLAmount__Params {
  _event: DecreaseNDOLAmount;

  constructor(event: DecreaseNDOLAmount) {
    this._event = event;
  }

  get token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class DecreasePoolAmount extends ethereum.Event {
  get params(): DecreasePoolAmount__Params {
    return new DecreasePoolAmount__Params(this);
  }
}

export class DecreasePoolAmount__Params {
  _event: DecreasePoolAmount;

  constructor(event: DecreasePoolAmount) {
    this._event = event;
  }

  get token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class DecreaseReservedAmount extends ethereum.Event {
  get params(): DecreaseReservedAmount__Params {
    return new DecreaseReservedAmount__Params(this);
  }
}

export class DecreaseReservedAmount__Params {
  _event: DecreaseReservedAmount;

  constructor(event: DecreaseReservedAmount) {
    this._event = event;
  }

  get token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class IncreaseGuaranteedUsd extends ethereum.Event {
  get params(): IncreaseGuaranteedUsd__Params {
    return new IncreaseGuaranteedUsd__Params(this);
  }
}

export class IncreaseGuaranteedUsd__Params {
  _event: IncreaseGuaranteedUsd;

  constructor(event: IncreaseGuaranteedUsd) {
    this._event = event;
  }

  get token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class IncreaseNDOLAmount extends ethereum.Event {
  get params(): IncreaseNDOLAmount__Params {
    return new IncreaseNDOLAmount__Params(this);
  }
}

export class IncreaseNDOLAmount__Params {
  _event: IncreaseNDOLAmount;

  constructor(event: IncreaseNDOLAmount) {
    this._event = event;
  }

  get token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class IncreasePoolAmount extends ethereum.Event {
  get params(): IncreasePoolAmount__Params {
    return new IncreasePoolAmount__Params(this);
  }
}

export class IncreasePoolAmount__Params {
  _event: IncreasePoolAmount;

  constructor(event: IncreasePoolAmount) {
    this._event = event;
  }

  get token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class IncreaseReservedAmount extends ethereum.Event {
  get params(): IncreaseReservedAmount__Params {
    return new IncreaseReservedAmount__Params(this);
  }
}

export class IncreaseReservedAmount__Params {
  _event: IncreaseReservedAmount;

  constructor(event: IncreaseReservedAmount) {
    this._event = event;
  }

  get token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class UpdateFundingRate extends ethereum.Event {
  get params(): UpdateFundingRate__Params {
    return new UpdateFundingRate__Params(this);
  }
}

export class UpdateFundingRate__Params {
  _event: UpdateFundingRate;

  constructor(event: UpdateFundingRate) {
    this._event = event;
  }

  get token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get fundingRate(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class UpdatePnl extends ethereum.Event {
  get params(): UpdatePnl__Params {
    return new UpdatePnl__Params(this);
  }
}

export class UpdatePnl__Params {
  _event: UpdatePnl;

  constructor(event: UpdatePnl) {
    this._event = event;
  }

  get key(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get hasProfit(): boolean {
    return this._event.parameters[1].value.toBoolean();
  }

  get delta(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class VaultLib extends ethereum.SmartContract {
  static bind(address: Address): VaultLib {
    return new VaultLib("VaultLib", address);
  }
}
