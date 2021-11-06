// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Position extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Position entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Position entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Position", id.toString(), this);
  }

  static load(id: string): Position | null {
    return store.get("Position", id) as Position | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get key(): Bytes {
    let value = this.get("key");
    return value.toBytes();
  }

  set key(value: Bytes) {
    this.set("key", Value.fromBytes(value));
  }

  get account(): string {
    let value = this.get("account");
    return value.toString();
  }

  set account(value: string) {
    this.set("account", Value.fromString(value));
  }

  get size(): BigInt {
    let value = this.get("size");
    return value.toBigInt();
  }

  set size(value: BigInt) {
    this.set("size", Value.fromBigInt(value));
  }

  get collateral(): BigInt {
    let value = this.get("collateral");
    return value.toBigInt();
  }

  set collateral(value: BigInt) {
    this.set("collateral", Value.fromBigInt(value));
  }

  get collateralToken(): Bytes {
    let value = this.get("collateralToken");
    return value.toBytes();
  }

  set collateralToken(value: Bytes) {
    this.set("collateralToken", Value.fromBytes(value));
  }

  get indexToken(): Bytes {
    let value = this.get("indexToken");
    return value.toBytes();
  }

  set indexToken(value: Bytes) {
    this.set("indexToken", Value.fromBytes(value));
  }

  get isLong(): boolean {
    let value = this.get("isLong");
    return value.toBoolean();
  }

  set isLong(value: boolean) {
    this.set("isLong", Value.fromBoolean(value));
  }

  get averagePrice(): BigInt {
    let value = this.get("averagePrice");
    return value.toBigInt();
  }

  set averagePrice(value: BigInt) {
    this.set("averagePrice", Value.fromBigInt(value));
  }

  get entryFundingRate(): BigInt {
    let value = this.get("entryFundingRate");
    return value.toBigInt();
  }

  set entryFundingRate(value: BigInt) {
    this.set("entryFundingRate", Value.fromBigInt(value));
  }

  get reserveAmount(): BigInt {
    let value = this.get("reserveAmount");
    return value.toBigInt();
  }

  set reserveAmount(value: BigInt) {
    this.set("reserveAmount", Value.fromBigInt(value));
  }

  get realisedPnl(): BigInt {
    let value = this.get("realisedPnl");
    return value.toBigInt();
  }

  set realisedPnl(value: BigInt) {
    this.set("realisedPnl", Value.fromBigInt(value));
  }

  get lastIncreasedTime(): BigInt {
    let value = this.get("lastIncreasedTime");
    return value.toBigInt();
  }

  set lastIncreasedTime(value: BigInt) {
    this.set("lastIncreasedTime", Value.fromBigInt(value));
  }
}

export class Action extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Action entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Action entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Action", id.toString(), this);
  }

  static load(id: string): Action | null {
    return store.get("Action", id) as Action | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get type(): string {
    let value = this.get("type");
    return value.toString();
  }

  set type(value: string) {
    this.set("type", Value.fromString(value));
  }

  get account(): string {
    let value = this.get("account");
    return value.toString();
  }

  set account(value: string) {
    this.set("account", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get collateralToken(): Bytes | null {
    let value = this.get("collateralToken");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set collateralToken(value: Bytes | null) {
    if (value === null) {
      this.unset("collateralToken");
    } else {
      this.set("collateralToken", Value.fromBytes(value as Bytes));
    }
  }

  get indexToken(): Bytes | null {
    let value = this.get("indexToken");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set indexToken(value: Bytes | null) {
    if (value === null) {
      this.unset("indexToken");
    } else {
      this.set("indexToken", Value.fromBytes(value as Bytes));
    }
  }

  get collateralDelta(): BigInt | null {
    let value = this.get("collateralDelta");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set collateralDelta(value: BigInt | null) {
    if (value === null) {
      this.unset("collateralDelta");
    } else {
      this.set("collateralDelta", Value.fromBigInt(value as BigInt));
    }
  }

  get sizeDelta(): BigInt | null {
    let value = this.get("sizeDelta");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set sizeDelta(value: BigInt | null) {
    if (value === null) {
      this.unset("sizeDelta");
    } else {
      this.set("sizeDelta", Value.fromBigInt(value as BigInt));
    }
  }

  get isLong(): boolean {
    let value = this.get("isLong");
    return value.toBoolean();
  }

  set isLong(value: boolean) {
    this.set("isLong", Value.fromBoolean(value));
  }

  get price(): BigInt | null {
    let value = this.get("price");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set price(value: BigInt | null) {
    if (value === null) {
      this.unset("price");
    } else {
      this.set("price", Value.fromBigInt(value as BigInt));
    }
  }

  get fee(): BigInt | null {
    let value = this.get("fee");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set fee(value: BigInt | null) {
    if (value === null) {
      this.unset("fee");
    } else {
      this.set("fee", Value.fromBigInt(value as BigInt));
    }
  }

  get realisedPnl(): BigInt | null {
    let value = this.get("realisedPnl");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set realisedPnl(value: BigInt | null) {
    if (value === null) {
      this.unset("realisedPnl");
    } else {
      this.set("realisedPnl", Value.fromBigInt(value as BigInt));
    }
  }

  get key(): Bytes | null {
    let value = this.get("key");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set key(value: Bytes | null) {
    if (value === null) {
      this.unset("key");
    } else {
      this.set("key", Value.fromBytes(value as Bytes));
    }
  }

  get size(): BigInt | null {
    let value = this.get("size");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set size(value: BigInt | null) {
    if (value === null) {
      this.unset("size");
    } else {
      this.set("size", Value.fromBigInt(value as BigInt));
    }
  }

  get collateral(): BigInt | null {
    let value = this.get("collateral");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set collateral(value: BigInt | null) {
    if (value === null) {
      this.unset("collateral");
    } else {
      this.set("collateral", Value.fromBigInt(value as BigInt));
    }
  }

  get reserveAmount(): BigInt | null {
    let value = this.get("reserveAmount");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set reserveAmount(value: BigInt | null) {
    if (value === null) {
      this.unset("reserveAmount");
    } else {
      this.set("reserveAmount", Value.fromBigInt(value as BigInt));
    }
  }

  get markPrice(): BigInt | null {
    let value = this.get("markPrice");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set markPrice(value: BigInt | null) {
    if (value === null) {
      this.unset("markPrice");
    } else {
      this.set("markPrice", Value.fromBigInt(value as BigInt));
    }
  }

  get liquidatedStatus(): BigInt | null {
    let value = this.get("liquidatedStatus");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set liquidatedStatus(value: BigInt | null) {
    if (value === null) {
      this.unset("liquidatedStatus");
    } else {
      this.set("liquidatedStatus", Value.fromBigInt(value as BigInt));
    }
  }

  get averagePrice(): BigInt | null {
    let value = this.get("averagePrice");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set averagePrice(value: BigInt | null) {
    if (value === null) {
      this.unset("averagePrice");
    } else {
      this.set("averagePrice", Value.fromBigInt(value as BigInt));
    }
  }

  get entryFundingRate(): BigInt | null {
    let value = this.get("entryFundingRate");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set entryFundingRate(value: BigInt | null) {
    if (value === null) {
      this.unset("entryFundingRate");
    } else {
      this.set("entryFundingRate", Value.fromBigInt(value as BigInt));
    }
  }

  get tokenIn(): Bytes | null {
    let value = this.get("tokenIn");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set tokenIn(value: Bytes | null) {
    if (value === null) {
      this.unset("tokenIn");
    } else {
      this.set("tokenIn", Value.fromBytes(value as Bytes));
    }
  }

  get tokenOut(): Bytes | null {
    let value = this.get("tokenOut");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set tokenOut(value: Bytes | null) {
    if (value === null) {
      this.unset("tokenOut");
    } else {
      this.set("tokenOut", Value.fromBytes(value as Bytes));
    }
  }

  get amountIn(): BigInt | null {
    let value = this.get("amountIn");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set amountIn(value: BigInt | null) {
    if (value === null) {
      this.unset("amountIn");
    } else {
      this.set("amountIn", Value.fromBigInt(value as BigInt));
    }
  }

  get amountOut(): BigInt | null {
    let value = this.get("amountOut");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set amountOut(value: BigInt | null) {
    if (value === null) {
      this.unset("amountOut");
    } else {
      this.set("amountOut", Value.fromBigInt(value as BigInt));
    }
  }

  get token(): Bytes | null {
    let value = this.get("token");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set token(value: Bytes | null) {
    if (value === null) {
      this.unset("token");
    } else {
      this.set("token", Value.fromBytes(value as Bytes));
    }
  }

  get tokenAmount(): BigInt | null {
    let value = this.get("tokenAmount");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set tokenAmount(value: BigInt | null) {
    if (value === null) {
      this.unset("tokenAmount");
    } else {
      this.set("tokenAmount", Value.fromBigInt(value as BigInt));
    }
  }

  get nusdAmount(): BigInt | null {
    let value = this.get("nusdAmount");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set nusdAmount(value: BigInt | null) {
    if (value === null) {
      this.unset("nusdAmount");
    } else {
      this.set("nusdAmount", Value.fromBigInt(value as BigInt));
    }
  }

  get amount(): BigInt | null {
    let value = this.get("amount");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set amount(value: BigInt | null) {
    if (value === null) {
      this.unset("amount");
    } else {
      this.set("amount", Value.fromBigInt(value as BigInt));
    }
  }
}

export class LP extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save LP entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save LP entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("LP", id.toString(), this);
  }

  static load(id: string): LP | null {
    return store.get("LP", id) as LP | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get account(): string {
    let value = this.get("account");
    return value.toString();
  }

  set account(value: string) {
    this.set("account", Value.fromString(value));
  }

  get token(): Bytes | null {
    let value = this.get("token");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytes();
    }
  }

  set token(value: Bytes | null) {
    if (value === null) {
      this.unset("token");
    } else {
      this.set("token", Value.fromBytes(value as Bytes));
    }
  }

  get tokenAmount(): BigInt | null {
    let value = this.get("tokenAmount");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set tokenAmount(value: BigInt | null) {
    if (value === null) {
      this.unset("tokenAmount");
    } else {
      this.set("tokenAmount", Value.fromBigInt(value as BigInt));
    }
  }

  get nusdAmount(): BigInt | null {
    let value = this.get("nusdAmount");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set nusdAmount(value: BigInt | null) {
    if (value === null) {
      this.unset("nusdAmount");
    } else {
      this.set("nusdAmount", Value.fromBigInt(value as BigInt));
    }
  }
}

export class Collateral extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Collateral entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Collateral entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Collateral", id.toString(), this);
  }

  static load(id: string): Collateral | null {
    return store.get("Collateral", id) as Collateral | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get feeReserves(): BigInt {
    let value = this.get("feeReserves");
    return value.toBigInt();
  }

  set feeReserves(value: BigInt) {
    this.set("feeReserves", Value.fromBigInt(value));
  }

  get guaranteedUsd(): BigInt {
    let value = this.get("guaranteedUsd");
    return value.toBigInt();
  }

  set guaranteedUsd(value: BigInt) {
    this.set("guaranteedUsd", Value.fromBigInt(value));
  }

  get nusdAmounts(): BigInt {
    let value = this.get("nusdAmounts");
    return value.toBigInt();
  }

  set nusdAmounts(value: BigInt) {
    this.set("nusdAmounts", Value.fromBigInt(value));
  }

  get reservedAmounts(): BigInt {
    let value = this.get("reservedAmounts");
    return value.toBigInt();
  }

  set reservedAmounts(value: BigInt) {
    this.set("reservedAmounts", Value.fromBigInt(value));
  }

  get poolAmounts(): BigInt {
    let value = this.get("poolAmounts");
    return value.toBigInt();
  }

  set poolAmounts(value: BigInt) {
    this.set("poolAmounts", Value.fromBigInt(value));
  }

  get cumulativeFundingRate(): BigInt {
    let value = this.get("cumulativeFundingRate");
    return value.toBigInt();
  }

  set cumulativeFundingRate(value: BigInt) {
    this.set("cumulativeFundingRate", Value.fromBigInt(value));
  }

  get lastFundingTime(): BigInt {
    let value = this.get("lastFundingTime");
    return value.toBigInt();
  }

  set lastFundingTime(value: BigInt) {
    this.set("lastFundingTime", Value.fromBigInt(value));
  }

  get utilisationRate(): BigInt {
    let value = this.get("utilisationRate");
    return value.toBigInt();
  }

  set utilisationRate(value: BigInt) {
    this.set("utilisationRate", Value.fromBigInt(value));
  }

  get longLiquidations(): BigInt {
    let value = this.get("longLiquidations");
    return value.toBigInt();
  }

  set longLiquidations(value: BigInt) {
    this.set("longLiquidations", Value.fromBigInt(value));
  }

  get shortLiquidations(): BigInt {
    let value = this.get("shortLiquidations");
    return value.toBigInt();
  }

  set shortLiquidations(value: BigInt) {
    this.set("shortLiquidations", Value.fromBigInt(value));
  }

  get longs(): BigInt {
    let value = this.get("longs");
    return value.toBigInt();
  }

  set longs(value: BigInt) {
    this.set("longs", Value.fromBigInt(value));
  }

  get shorts(): BigInt {
    let value = this.get("shorts");
    return value.toBigInt();
  }

  set shorts(value: BigInt) {
    this.set("shorts", Value.fromBigInt(value));
  }

  get longOpenInterest(): BigInt {
    let value = this.get("longOpenInterest");
    return value.toBigInt();
  }

  set longOpenInterest(value: BigInt) {
    this.set("longOpenInterest", Value.fromBigInt(value));
  }

  get shortOpenInterest(): BigInt {
    let value = this.get("shortOpenInterest");
    return value.toBigInt();
  }

  set shortOpenInterest(value: BigInt) {
    this.set("shortOpenInterest", Value.fromBigInt(value));
  }
}

export class Account extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Account entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Account entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Account", id.toString(), this);
  }

  static load(id: string): Account | null {
    return store.get("Account", id) as Account | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get actions(): Array<string> {
    let value = this.get("actions");
    return value.toStringArray();
  }

  set actions(value: Array<string>) {
    this.set("actions", Value.fromStringArray(value));
  }

  get positions(): Array<string> {
    let value = this.get("positions");
    return value.toStringArray();
  }

  set positions(value: Array<string>) {
    this.set("positions", Value.fromStringArray(value));
  }

  get lps(): Array<string> {
    let value = this.get("lps");
    return value.toStringArray();
  }

  set lps(value: Array<string>) {
    this.set("lps", Value.fromStringArray(value));
  }
}

export class DirectPoolDeposit extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save DirectPoolDeposit entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save DirectPoolDeposit entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("DirectPoolDeposit", id.toString(), this);
  }

  static load(id: string): DirectPoolDeposit | null {
    return store.get("DirectPoolDeposit", id) as DirectPoolDeposit | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get token(): Bytes {
    let value = this.get("token");
    return value.toBytes();
  }

  set token(value: Bytes) {
    this.set("token", Value.fromBytes(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }
}
