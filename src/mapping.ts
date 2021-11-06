import {
  Address,
  BigInt,
  Bytes,
  ethereum,
  ByteArray,
  store,
} from "@graphprotocol/graph-ts";
// import { Swap as RouterSwap } from "../generated/Router/Router";
import { Account, Action, Collateral, LP, Position } from "../generated/schema";

import {
  IncreasePosition as IncreasePositionEvent,
  ClosePosition as ClosePositionEvent,
  DecreasePosition as DecreasePositionEvent,
  LiquidatePosition as LiquidatePositionEvent,
  UpdatePosition as UpdatePositionEvent,
  VaultFacet,
} from "../generated/VaultFacet/VaultFacet";

import {
  CollectMarginFees as CollectMarginFeesEvent,
  CollectSwapFees as CollectSwapFeesEvent,
  UpdateFundingRate as UpdateFundingRateEvent,
  IncreaseGuaranteedUsd as IncreaseGuaranteedUsdEvent,
  IncreaseNUSDAmount as IncreaseNUSDAmountEvent,
  IncreasePoolAmount as IncreasePoolAmountEvent,
  IncreaseReservedAmount as IncreaseReservedAmountEvent,
} from "../generated/VaultLib/VaultLib";

import { DirectPoolDeposit as DirectPoolDepositEvent } from "../generated/VaultConfigFacet/VaultConfigFacet";

import {
  BuyNUSD as BuyNUSDEvent,
  SellNUSD as SellNUSDEvent,
  Swap as VaultSwapEvent,
  VaultNUSDFacet,
} from "../generated/VaultNUSDFacet/VaultNUSDFacet";

import { DirectPoolDeposit } from "../generated/schema";

import {
  createAddressEventParameter,
  createBooleanEventParameter,
  createBytesEventParameter,
  createUnsignedBigIntEventParameter,
} from "./create-event-parameter";

export function createSellNUSDEvent(
  account: Address,
  token: Address,
  tokenAmount: BigInt,
  nusdAmount: BigInt
): SellNUSDEvent {
  let event = new SellNUSDEvent();
  event.parameters = new Array();

  createAddressEventParameter(event, account);
  createAddressEventParameter(event, token);
  createUnsignedBigIntEventParameter(event, tokenAmount);
  createUnsignedBigIntEventParameter(event, nusdAmount);

  return event;
}

export function createBuyNUSDEvent(
  account: Address,
  token: Address,
  tokenAmount: BigInt,
  nusdAmount: BigInt
): BuyNUSDEvent {
  let event = new BuyNUSDEvent();
  event.parameters = new Array();

  createAddressEventParameter(event, account);
  createAddressEventParameter(event, token);
  createUnsignedBigIntEventParameter(event, tokenAmount);
  createUnsignedBigIntEventParameter(event, nusdAmount);

  return event;
}

// event BuyNUSD(
//   address account,
//   address token,
//   uint256 tokenAmount,
//   uint256 nusdAmount
// );
export function handleBuyNUSD(event: BuyNUSDEvent): void {
  let account = Account.load(event.params.account.toHexString());
  if (account == null) {
    account = new Account(event.params.account.toHexString());
    account.save();
  }

  let action = new Action(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  action.type = "BuyNUSD";
  action.account = event.params.account.toHexString();
  action.timestamp = event.block.timestamp;

  action.token = event.params.token;
  action.tokenAmount = event.params.tokenAmount;
  action.nusdAmount = event.params.nusdAmount;
  let lp = LP.load(
    event.params.account.toHex() + "-" + event.params.token.toHexString()
  );
  if (lp == null) {
    lp = new LP(
      event.params.account.toHex() + "-" + event.params.token.toHexString()
    );
    lp.account = event.params.account.toHexString();
    lp.token = event.params.token;
    lp.tokenAmount = event.params.tokenAmount;
    lp.nusdAmount = event.params.nusdAmount;
  } else {
    lp.tokenAmount = lp.tokenAmount.plus(event.params.tokenAmount);
    lp.nusdAmount = lp.nusdAmount.plus(event.params.nusdAmount);
  }

  lp.save();
  action.save();
}

// event ClosePosition(
//   bytes32 key,
//   uint256 size,
//   uint256 collateral,
//   uint256 averagePrice,
//   uint256 entryFundingRate,
//   uint256 reserveAmount,
//   int256 realisedPnl
// );
export function handleClosePosition(event: ClosePositionEvent): void {
  let position = Position.load(event.params.key.toHexString());
  let action = new Action(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  );
  action.account = position.account;
  action.type = "ClosePosition";
  action.timestamp = event.block.timestamp;

  action.size = event.params.size;
  action.collateral = event.params.collateral;
  action.averagePrice = event.params.averagePrice;
  action.entryFundingRate = event.params.entryFundingRate;
  action.reserveAmount = event.params.reserveAmount;
  action.realisedPnl = event.params.realisedPnl;

  let collateral = Collateral.load(position.indexToken.toHexString());
  if (collateral) {
    if (position.isLong) {
      collateral.longs = collateral.longs.minus(BigInt.fromI32(1));
    } else {
      collateral.shorts = collateral.shorts.minus(BigInt.fromI32(1));
    }
    collateral.save();
  }
  store.remove("Position", position.id);

  action.save();
}

export function createCollectMarginFeesEvent(
  token: Address,
  feeUsd: BigInt,
  feeTokens: BigInt
): CollectMarginFeesEvent {
  let event = new CollectMarginFeesEvent();
  event.parameters = new Array();

  createAddressEventParameter(event, token);
  createUnsignedBigIntEventParameter(event, feeUsd);
  createUnsignedBigIntEventParameter(event, feeTokens);

  return event;
}

/*
    event CollectMarginFees(address token, uint256 feeUsd, uint256 feeTokens);
*/
export function handleCollectMarginFees(event: CollectMarginFeesEvent): void {
  let vaultNUSD = VaultNUSDFacet.bind(event.address);
  let collateral = Collateral.load(event.params.token.toHexString());
  if (collateral == null) {
    collateral = new Collateral(event.params.token.toHexString());
    collateral.longOpenInterest = BigInt.fromI32(0);
    collateral.shortOpenInterest = BigInt.fromI32(0);
    collateral.longs = BigInt.fromI32(0);
    collateral.shorts = BigInt.fromI32(0);
    collateral.feeReserves = BigInt.fromI32(0);
    collateral.guaranteedUsd = BigInt.fromI32(0);
    collateral.nusdAmounts = BigInt.fromI32(0);
    collateral.cumulativeFundingRate = BigInt.fromI32(0);
    collateral.lastFundingTime = BigInt.fromI32(0);
    collateral.utilisationRate = BigInt.fromI32(0);
    collateral.reservedAmounts = BigInt.fromI32(0);
    collateral.poolAmounts = BigInt.fromI32(0);
    collateral.longLiquidations = BigInt.fromI32(0);
    collateral.shortLiquidations = BigInt.fromI32(0);
  }
  let feeReserves = vaultNUSD.try_feeReserves(event.params.token);
  if (!feeReserves.reverted) {
    collateral.feeReserves = feeReserves.value;
  }
  collateral.save();
}

export function createCollectSwapFeesEvent(
  token: Address,
  feeUsd: BigInt,
  feeTokens: BigInt
): CollectSwapFeesEvent {
  let event = new CollectSwapFeesEvent();
  event.parameters = new Array();

  createAddressEventParameter(event, token);
  createUnsignedBigIntEventParameter(event, feeUsd);
  createUnsignedBigIntEventParameter(event, feeTokens);

  return event;
}

export function handleCollectSwapFees(event: CollectSwapFeesEvent): void {
  let vaultNUSD = VaultNUSDFacet.bind(event.address);
  let collateral = Collateral.load(event.params.token.toHexString());
  if (collateral == null) {
    collateral = new Collateral(event.params.token.toHexString());
    collateral.longOpenInterest = BigInt.fromI32(0);
    collateral.shortOpenInterest = BigInt.fromI32(0);
    collateral.longs = BigInt.fromI32(0);
    collateral.shorts = BigInt.fromI32(0);
    collateral.feeReserves = BigInt.fromI32(0);
    collateral.guaranteedUsd = BigInt.fromI32(0);
    collateral.nusdAmounts = BigInt.fromI32(0);
    collateral.cumulativeFundingRate = BigInt.fromI32(0);
    collateral.lastFundingTime = BigInt.fromI32(0);
    collateral.utilisationRate = BigInt.fromI32(0);
    collateral.reservedAmounts = BigInt.fromI32(0);
    collateral.poolAmounts = BigInt.fromI32(0);
    collateral.longLiquidations = BigInt.fromI32(0);
    collateral.shortLiquidations = BigInt.fromI32(0);
  }

  let feeReserves = vaultNUSD.try_feeReserves(event.params.token);
  if (!feeReserves.reverted) {
    collateral.feeReserves = feeReserves.value;
  }

  collateral.save();
}

// emit DecreasePosition(
//   key,
//   _account,
//   _collateralToken,
//   _indexToken,
//   _collateralDelta,
//   _sizeDelta,
//   _isLong,
//   price,
//   usdOut.sub(usdOutAfterFee)
// );
export function handleDecreasePosition(event: DecreasePositionEvent): void {
  let account = Account.load(event.params.account.toHexString());
  if (account == null) {
    account = new Account(event.params.account.toHexString());
    account.save();
  }

  let action = new Action(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  action.type = "DecreasePosition";
  action.account = event.params.account.toHexString();
  action.timestamp = event.block.timestamp;

  action.collateralToken = Address.fromString(
    event.params.collateralToken.toHexString()
  );
  action.indexToken = Address.fromString(event.params.indexToken.toHexString());
  action.collateralDelta = event.params.collateralDelta;
  action.sizeDelta = event.params.sizeDelta;
  action.isLong = event.params.isLong;
  action.price = event.params.price;
  action.fee = event.params.fee;

  let position = Position.load(event.params.key.toHexString());
  let collateral = Collateral.load(position.indexToken.toHexString());
  if (collateral) {
    if (position.isLong) {
      collateral.longOpenInterest = collateral.longOpenInterest.minus(
        event.params.sizeDelta
      );
    } else {
      collateral.shortOpenInterest = collateral.shortOpenInterest.minus(
        event.params.sizeDelta
      );
    }
    collateral.save();
  }

  action.save();
}

export function handleDirectPoolDeposit(event: DirectPoolDepositEvent): void {
  let entity = new DirectPoolDeposit(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  entity.token = event.params.token;
  entity.amount = event.params.amount;
  entity.save();
}

export function createIncreaseGuaranteedUsdEvent(
  token: Address,
  amount: BigInt
): IncreaseGuaranteedUsdEvent {
  let event = new IncreaseGuaranteedUsdEvent();
  event.parameters = new Array();

  createAddressEventParameter(event, token);
  createUnsignedBigIntEventParameter(event, amount);

  return event;
}

// event IncreaseGuaranteedUsd(address token, uint256 amount);
export function handleIncreaseGuaranteedUsd(
  event: IncreaseGuaranteedUsdEvent
): void {
  let vaultNUSD = VaultNUSDFacet.bind(event.address);
  let collateral = Collateral.load(event.params.token.toHexString());
  if (collateral == null) {
    collateral = new Collateral(event.params.token.toHexString());
    collateral.feeReserves = BigInt.fromI32(0);
    collateral.guaranteedUsd = BigInt.fromI32(0);
    collateral.nusdAmounts = BigInt.fromI32(0);
    collateral.reservedAmounts = BigInt.fromI32(0);
    collateral.poolAmounts = BigInt.fromI32(0);
    collateral.cumulativeFundingRate = BigInt.fromI32(0);
    collateral.utilisationRate = BigInt.fromI32(0);
    collateral.longLiquidations = BigInt.fromI32(0);
    collateral.shortLiquidations = BigInt.fromI32(0);
    collateral.longs = BigInt.fromI32(0);
    collateral.shorts = BigInt.fromI32(0);
    collateral.lastFundingTime = BigInt.fromI32(0);
    collateral.longOpenInterest = BigInt.fromI32(0);
    collateral.shortOpenInterest = BigInt.fromI32(0);
  }
  let guaranteedUsd = vaultNUSD.try_guaranteedUsd(event.params.token);
  if (!guaranteedUsd.reverted) {
    collateral.guaranteedUsd = guaranteedUsd.value;
  }

  collateral.save();
}

export function createIncreaseNUSDAmountEvent(
  token: Address,
  amount: BigInt
): IncreaseNUSDAmountEvent {
  let event = new IncreaseNUSDAmountEvent();
  event.parameters = new Array();

  createAddressEventParameter(event, token);
  createUnsignedBigIntEventParameter(event, amount);

  return event;
}

// emit IncreaseNUSDAmount(_token, _amount);
export function handleIncreaseNUSDAmount(event: IncreaseNUSDAmountEvent): void {
  let vaultNUSD = VaultNUSDFacet.bind(event.address);
  let collateral = Collateral.load(event.params.token.toHexString());
  if (collateral == null) {
    collateral = new Collateral(event.params.token.toHexString());
    collateral.longOpenInterest = BigInt.fromI32(0);
    collateral.shortOpenInterest = BigInt.fromI32(0);
    collateral.longs = BigInt.fromI32(0);
    collateral.shorts = BigInt.fromI32(0);
    collateral.feeReserves = BigInt.fromI32(0);
    collateral.guaranteedUsd = BigInt.fromI32(0);
    collateral.nusdAmounts = BigInt.fromI32(0);
    collateral.cumulativeFundingRate = BigInt.fromI32(0);
    collateral.lastFundingTime = BigInt.fromI32(0);
    collateral.utilisationRate = BigInt.fromI32(0);
    collateral.reservedAmounts = BigInt.fromI32(0);
    collateral.poolAmounts = BigInt.fromI32(0);
    collateral.longLiquidations = BigInt.fromI32(0);
    collateral.shortLiquidations = BigInt.fromI32(0);
  }

  let nusdAmounts = vaultNUSD.try_nusdAmounts(event.params.token);
  if (!nusdAmounts.reverted) {
    collateral.nusdAmounts = nusdAmounts.value;
  }

  collateral.save();
}

export function createIncreasePoolAmountEvent(
  token: Address,
  amount: BigInt
): IncreasePoolAmountEvent {
  let event = new IncreasePoolAmountEvent();
  event.parameters = new Array();

  createAddressEventParameter(event, token);
  createUnsignedBigIntEventParameter(event, amount);

  return event;
}

export function handleIncreasePoolAmount(event: IncreasePoolAmountEvent): void {
  let vaultNUSD = VaultNUSDFacet.bind(event.address);
  let collateral = Collateral.load(event.params.token.toHexString());
  if (collateral == null) {
    collateral = new Collateral(event.params.token.toHexString());
    collateral.longOpenInterest = BigInt.fromI32(0);
    collateral.shortOpenInterest = BigInt.fromI32(0);
    collateral.longs = BigInt.fromI32(0);
    collateral.shorts = BigInt.fromI32(0);
    collateral.feeReserves = BigInt.fromI32(0);
    collateral.poolAmounts = BigInt.fromI32(0);
    collateral.longLiquidations = BigInt.fromI32(0);
    collateral.shortLiquidations = BigInt.fromI32(0);
    collateral.guaranteedUsd = BigInt.fromI32(0);
    collateral.nusdAmounts = BigInt.fromI32(0);
    collateral.cumulativeFundingRate = BigInt.fromI32(0);
    collateral.lastFundingTime = BigInt.fromI32(0);
    collateral.utilisationRate = BigInt.fromI32(0);
    collateral.reservedAmounts = BigInt.fromI32(0);
  }
  let poolAmounts = vaultNUSD.try_poolAmounts(event.params.token);
  if (!poolAmounts.reverted) {
    collateral.poolAmounts = poolAmounts.value;
  }

  collateral.save();
}

export function createDecreasePositionEvent(
  _key: Bytes,
  _account: Address,
  _collateralToken: Address,
  _indexToken: Address,
  _collateralDeltaUsd: BigInt,
  _sizeDelta: BigInt,
  _isLong: boolean,
  _price: BigInt,
  _fee: BigInt
): DecreasePositionEvent {
  let event = new DecreasePositionEvent();
  event.parameters = new Array();

  createBytesEventParameter(event, _key);
  createAddressEventParameter(event, _account);
  createAddressEventParameter(event, _collateralToken);
  createAddressEventParameter(event, _indexToken);
  createUnsignedBigIntEventParameter(event, _collateralDeltaUsd);
  createUnsignedBigIntEventParameter(event, _sizeDelta);
  createBooleanEventParameter(event, _isLong);
  createUnsignedBigIntEventParameter(event, _price);
  createUnsignedBigIntEventParameter(event, _fee);

  return event;
}

export function createClosePositionEvent(
  key: Bytes,
  size: BigInt,
  collateral: BigInt,
  averagePrice: BigInt,
  entryFundingRate: BigInt,
  reserveAmount: BigInt,
  realisedPnl: BigInt
): ClosePositionEvent {
  let event = new ClosePositionEvent();
  event.parameters = new Array();

  createBytesEventParameter(event, key);
  createUnsignedBigIntEventParameter(event, size);
  createUnsignedBigIntEventParameter(event, collateral);
  createUnsignedBigIntEventParameter(event, averagePrice);
  createUnsignedBigIntEventParameter(event, entryFundingRate);
  createUnsignedBigIntEventParameter(event, reserveAmount);
  createUnsignedBigIntEventParameter(event, realisedPnl);

  return event;
}

export function createUpdatePositionEvent(
  key: Bytes,
  size: BigInt,
  collateral: BigInt,
  averagePrice: BigInt,
  entryFundingRate: BigInt,
  reserveAmount: BigInt,
  realisedPnl: BigInt
): UpdatePositionEvent {
  let event = new UpdatePositionEvent();
  event.parameters = new Array();

  createBytesEventParameter(event, key);
  createUnsignedBigIntEventParameter(event, size);
  createUnsignedBigIntEventParameter(event, collateral);
  createUnsignedBigIntEventParameter(event, averagePrice);
  createUnsignedBigIntEventParameter(event, entryFundingRate);
  createUnsignedBigIntEventParameter(event, reserveAmount);
  createUnsignedBigIntEventParameter(event, realisedPnl);

  return event;
}

export function createIncreasePositionEvent(
  _key: Bytes,
  _account: Address,
  _collateralToken: Address,
  _indexToken: Address,
  _collateralDeltaUsd: BigInt,
  _sizeDelta: BigInt,
  _isLong: boolean,
  _price: BigInt,
  _fee: BigInt
): IncreasePositionEvent {
  let event = new IncreasePositionEvent();
  event.parameters = new Array();

  createBytesEventParameter(event, _key);
  createAddressEventParameter(event, _account);
  createAddressEventParameter(event, _collateralToken);
  createAddressEventParameter(event, _indexToken);
  createUnsignedBigIntEventParameter(event, _collateralDeltaUsd);
  createUnsignedBigIntEventParameter(event, _sizeDelta);
  createBooleanEventParameter(event, _isLong);
  createUnsignedBigIntEventParameter(event, _price);
  createUnsignedBigIntEventParameter(event, _fee);

  return event;
}

// emit IncreasePosition(
//   key,
//   _account,
//   _collateralToken,
//   _indexToken,
//   collateralDeltaUsd,
//   _sizeDelta,
//   _isLong,
//   price,
//   fee
// );
export function handleIncreasePosition(event: IncreasePositionEvent): void {
  let vaultFacet = VaultFacet.bind(event.address);
  let position = Position.load(event.params.key.toHexString());
  if (position == null) {
    position = new Position(event.params.key.toHexString());
    position.key = event.params.key;
    position.account = event.params.account.toHexString();
    position.size = BigInt.fromI32(0).plus(event.params.sizeDelta);
    position.collateral = BigInt.fromI32(0).plus(event.params.collateralDelta);
    position.collateralToken = Address.fromString(
      event.params.collateralToken.toHexString()
    );
    position.indexToken = Address.fromString(
      event.params.indexToken.toHexString()
    );
    position.isLong = event.params.isLong;
    position.averagePrice = BigInt.fromI32(0);
    position.reserveAmount = BigInt.fromI32(0);
    position.realisedPnl = BigInt.fromI32(0);
    position.lastIncreasedTime = event.block.timestamp;

    let cumulativeFundingRates = vaultFacet.try_cumulativeFundingRates(
      event.params.collateralToken
    );
    if (!cumulativeFundingRates.reverted) {
      position.entryFundingRate = cumulativeFundingRates.value;
    } else {
      position.entryFundingRate = BigInt.fromI32(0);
    }

    let collateral = Collateral.load(event.params.indexToken.toHexString());
    if (collateral) {
      if (position.isLong) {
        collateral.longs = collateral.longs.plus(BigInt.fromI32(1));
      } else {
        collateral.shorts = collateral.shorts.plus(BigInt.fromI32(1));
      }
      collateral.save();
    }
  }

  let account = Account.load(event.params.account.toHexString());
  if (account == null) {
    account = new Account(event.params.account.toHexString());
    account.save();
  }

  let action = new Action(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  action.account = event.params.account.toHexString();
  action.timestamp = event.block.timestamp;
  action.type = "IncreasePosition";
  action.collateralToken = Address.fromString(
    event.params.collateralToken.toHexString()
  );
  action.indexToken = Address.fromString(event.params.indexToken.toHexString());
  action.sizeDelta = event.params.sizeDelta;
  action.collateralDelta = event.params.collateralDelta;
  action.isLong = event.params.isLong;
  action.price = event.params.price;
  action.fee = event.params.fee;

  let collateral = Collateral.load(position.indexToken.toHexString());
  if (collateral) {
    if (position.isLong) {
      collateral.longOpenInterest = collateral.longOpenInterest.plus(
        event.params.sizeDelta
      );
    } else {
      collateral.shortOpenInterest = collateral.shortOpenInterest.plus(
        event.params.sizeDelta
      );
    }
    collateral.save();
  }

  position.save();
  action.save();
}

export function createIncreaseReservedAmountEvent(
  token: Address,
  amount: BigInt
): IncreaseReservedAmountEvent {
  let event = new IncreaseReservedAmountEvent();
  event.parameters = new Array();

  createAddressEventParameter(event, token);
  createUnsignedBigIntEventParameter(event, amount);

  return event;
}

// event IncreaseReservedAmount(address token, uint256 amount);
export function handleIncreaseReservedAmount(
  event: IncreaseReservedAmountEvent
): void {
  let vaultNUSDFacet = VaultNUSDFacet.bind(event.address);
  let vaultFacet = VaultFacet.bind(event.address);
  let collateral = Collateral.load(event.params.token.toHexString());
  if (collateral == null) {
    collateral = new Collateral(event.params.token.toHexString());
    collateral.longOpenInterest = BigInt.fromI32(0);
    collateral.shortOpenInterest = BigInt.fromI32(0);
    collateral.longs = BigInt.fromI32(0);
    collateral.shorts = BigInt.fromI32(0);
    collateral.reservedAmounts = BigInt.fromI32(0);
    collateral.feeReserves = BigInt.fromI32(0);
    collateral.poolAmounts = BigInt.fromI32(0);
    collateral.longLiquidations = BigInt.fromI32(0);
    collateral.shortLiquidations = BigInt.fromI32(0);
    collateral.guaranteedUsd = BigInt.fromI32(0);
    collateral.nusdAmounts = BigInt.fromI32(0);
    collateral.cumulativeFundingRate = BigInt.fromI32(0);
    collateral.lastFundingTime = BigInt.fromI32(0);
    collateral.utilisationRate = BigInt.fromI32(0);
  }
  let reservedAmounts = vaultNUSDFacet.try_reservedAmounts(event.params.token);
  if (!reservedAmounts.reverted) {
    collateral.reservedAmounts = reservedAmounts.value;
  }
  let utilisationRate = vaultFacet.try_getUtilisation(event.params.token);
  if (!utilisationRate.reverted) {
    collateral.utilisationRate = utilisationRate.value;
  }

  collateral.save();
}

export function createLiquidatePositionEvent(
  key: Bytes,
  account: Address,
  collateralToken: Address,
  indexToken: Address,
  isLong: boolean,
  size: BigInt,
  collateral: BigInt,
  reserveAmount: BigInt,
  realisedPnl: BigInt,
  markPrice: BigInt
): LiquidatePositionEvent {
  let event = new LiquidatePositionEvent();
  event.parameters = new Array();
  createBytesEventParameter(event, key);
  createAddressEventParameter(event, account);
  createAddressEventParameter(event, collateralToken);
  createAddressEventParameter(event, indexToken);
  createBooleanEventParameter(event, isLong);
  createUnsignedBigIntEventParameter(event, size);
  createUnsignedBigIntEventParameter(event, collateral);
  createUnsignedBigIntEventParameter(event, reserveAmount);
  createUnsignedBigIntEventParameter(event, realisedPnl);
  createUnsignedBigIntEventParameter(event, markPrice);

  return event;
}

export function handleLiquidatePosition(event: LiquidatePositionEvent): void {
  let account = Account.load(event.params.account.toHexString());
  if (account == null) {
    account = new Account(event.params.account.toHexString());
    account.save();
  }
  let collateral = Collateral.load(event.params.indexToken.toHexString());
  if (collateral) {
    if (event.params.isLong) {
      collateral.longLiquidations = collateral.longLiquidations.plus(
        event.params.collateral
      );
      collateral.longs = collateral.longs.minus(BigInt.fromI32(1));
      collateral.longOpenInterest = collateral.longOpenInterest.minus(
        event.params.size
      );
    } else {
      collateral.shortLiquidations = collateral.shortLiquidations.plus(
        event.params.collateral
      );
      collateral.shorts = collateral.shorts.minus(BigInt.fromI32(1));
      collateral.shortOpenInterest = collateral.shortOpenInterest.minus(
        event.params.size
      );
    }
    collateral.save();
  }

  let action = new Action(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  action.account = event.params.account.toHexString();
  action.type = "LiquidatePosition";
  action.timestamp = event.block.timestamp;

  action.key = event.params.key;
  action.collateralToken = event.params.collateralToken;
  action.indexToken = event.params.indexToken;
  action.isLong = event.params.isLong;
  action.size = event.params.size;
  action.collateral = event.params.collateral;
  action.reserveAmount = event.params.reserveAmount;
  action.realisedPnl = event.params.realisedPnl;
  action.markPrice = event.params.markPrice;

  let vaultFacet = VaultFacet.bind(event.address);
  let result = vaultFacet.validateLiquidation(
    event.params.account,
    event.params.collateralToken,
    event.params.indexToken,
    action.isLong,
    false
  );
  let liquidatedStatus = result.value0;
  let fee = result.value1;
  let position = new Position(event.params.key.toHexString());

  action.fee = fee;
  action.liquidatedStatus = liquidatedStatus;

  action.save();

  store.remove("Position", position.id);
}

// event SellNUSD(
//   address account,
//   address token,
//   uint256 tokenAmount,
//   uint256 nusdAmount
// );
export function handleSellNUSD(event: SellNUSDEvent): void {
  let account = Account.load(event.params.account.toHexString());
  if (account == null) {
    account = new Account(event.params.account.toHexString());
    account.save();
  }

  let action = new Action(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  action.type = "SellNUSD";
  action.account = event.params.account.toHexString();
  action.timestamp = event.block.timestamp;

  action.token = event.params.token;
  action.tokenAmount = event.params.tokenAmount;
  action.nusdAmount = event.params.nusdAmount;

  action.save();

  let lp = LP.load(
    event.params.account.toHex() + "-" + event.params.token.toHex()
  );
  if (lp == null) {
    lp = new LP(
      event.params.account.toHex() + "-" + event.params.token.toHex()
    );
    lp.account = event.params.account.toHexString();
    lp.token = event.params.token;
    lp.tokenAmount = BigInt.fromI32(0).minus(event.params.tokenAmount);
    lp.nusdAmount = BigInt.fromI32(0).minus(event.params.nusdAmount);
  } else {
    lp.tokenAmount = lp.tokenAmount.minus(event.params.tokenAmount);
    lp.nusdAmount = lp.nusdAmount.minus(event.params.nusdAmount);
  }

  if (
    lp.tokenAmount.equals(BigInt.fromI32(0)) ||
    lp.nusdAmount.equals(BigInt.fromI32(0))
  ) {
    store.remove(
      "LP",
      event.params.account.toHex() + "-" + event.params.token.toHex()
    );
  } else {
    lp.save();
  }
}

/*
  event Swap(
    address account,
    address tokenIn,
    address tokenOut,
    uint256 amountIn,
    uint256 amountOut
  );
*/
export function handleVaultSwap(event: VaultSwapEvent): void {
  let account = Account.load(event.params.account.toHexString());
  if (account == null) {
    account = new Account(event.params.account.toHexString());
    account.save();
  }

  let action = new Action(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  action.type = "Swap";
  action.account = event.params.account.toHexString();
  action.timestamp = event.block.timestamp;
  action.tokenIn = event.params.tokenIn;
  action.tokenOut = event.params.tokenOut;
  action.amountIn = event.params.amountIn;
  action.amountOut = event.params.amountOut;
  action.save();
}

// emit Swap(_receiver, _tokenIn, _tokenOut, amountIn, amountOutAfterFees);
export function createVaultSwapEvent(
  account: Address,
  tokenIn: Address,
  tokenOut: Address,
  amountIn: BigInt,
  amountOut: BigInt
): VaultSwapEvent {
  let event = new VaultSwapEvent();
  event.parameters = new Array();

  let receiver = new ethereum.EventParam();
  receiver.value = ethereum.Value.fromAddress(account);
  event.parameters.push(receiver);

  let tokenInP = new ethereum.EventParam();
  tokenInP.value = ethereum.Value.fromAddress(tokenIn);
  event.parameters.push(tokenInP);

  let tokenOutP = new ethereum.EventParam();
  tokenOutP.value = ethereum.Value.fromAddress(tokenOut);
  event.parameters.push(tokenOutP);

  let amountInP = new ethereum.EventParam();
  amountInP.value = ethereum.Value.fromUnsignedBigInt(amountIn);
  event.parameters.push(amountInP);

  let amountOutP = new ethereum.EventParam();
  amountOutP.value = ethereum.Value.fromUnsignedBigInt(amountOut);
  event.parameters.push(amountOutP);

  return event;
}

export function createUpdateFundingRateEvent(
  token: Address,
  amount: BigInt
): UpdateFundingRateEvent {
  let event = new UpdateFundingRateEvent();
  event.parameters = new Array();

  createAddressEventParameter(event, token);
  createUnsignedBigIntEventParameter(event, amount);

  return event;
}

export function handleUpdateFundingRate(event: UpdateFundingRateEvent): void {
  let vaultFacet = VaultFacet.bind(event.address);
  let collateral = Collateral.load(event.params.token.toHexString());
  if (collateral == null) {
    collateral = new Collateral(event.params.token.toHexString());
    collateral.longOpenInterest = BigInt.fromI32(0);
    collateral.shortOpenInterest = BigInt.fromI32(0);
    collateral.longs = BigInt.fromI32(0);
    collateral.shorts = BigInt.fromI32(0);
    collateral.reservedAmounts = BigInt.fromI32(0);
    collateral.feeReserves = BigInt.fromI32(0);
    collateral.poolAmounts = BigInt.fromI32(0);
    collateral.longLiquidations = BigInt.fromI32(0);
    collateral.shortLiquidations = BigInt.fromI32(0);
    collateral.guaranteedUsd = BigInt.fromI32(0);
    collateral.nusdAmounts = BigInt.fromI32(0);
    collateral.cumulativeFundingRate = BigInt.fromI32(0);
    collateral.lastFundingTime = BigInt.fromI32(0);
    collateral.utilisationRate = BigInt.fromI32(0);
  }
  let cumulativeFundingRates = vaultFacet.try_cumulativeFundingRates(
    event.params.token
  );
  if (!cumulativeFundingRates.reverted) {
    collateral.cumulativeFundingRate = cumulativeFundingRates.value;
  }
  let lastFundingTime = vaultFacet.try_lastFundingTimes(event.params.token);
  if (!lastFundingTime.reverted) {
    collateral.lastFundingTime = lastFundingTime.value;
  }

  collateral.save();
}

// NOTE - Keeping this for now, but it's not used
// // event UpdatePnl(bytes32 key, bool hasProfit, uint256 delta);
// export function handleUpdatePnl(event: UpdatePnlEvent): void {
//   let entity = new UpdatePnl(
//     event.transaction.hash.toHex() + "-" + event.logIndex.toString()
//   );
//   entity.key = event.params.key;
//   entity.hasProfit = event.params.hasProfit;
//   entity.delta = event.params.delta;
//   entity.save();
// }

// emit UpdatePosition(
//   key,
//   position.size,
//   position.collateral,
//   position.averagePrice,
//   position.entryFundingRate,
//   position.reserveAmount,
//   position.realisedPnl
// );
export function handleUpdatePosition(event: UpdatePositionEvent): void {
  let position = Position.load(event.params.key.toHexString());
  position.size = event.params.size;
  position.collateral = event.params.collateral;
  position.averagePrice = event.params.averagePrice;
  position.entryFundingRate = event.params.entryFundingRate;
  position.reserveAmount = event.params.reserveAmount;
  position.realisedPnl = event.params.realisedPnl;

  position.lastIncreasedTime = event.block.timestamp;

  position.save();
}

/* Router */

// export function handleSwap(event: RouterSwap): void {
//   // Entities can be loaded from the store using a string ID; this ID
//   // needs to be unique across all entities of the same type
//   let entity = ExampleEntity.load(event.transaction.from.toHex());

//   // Entities only exist after they have been saved to the store;
//   // `null` checks allow to create entities on demand
//   if (entity == null) {
//     entity = new ExampleEntity(event.transaction.from.toHex());

//     // Entity fields can be set using simple assignments
//     entity.count = BigInt.fromI32(0);
//   }

//   // BigInt and BigDecimal math are supported
//   entity.count = entity.count.plus(BigInt.fromI32(1));

//   // Entity fields can be set based on event parameters
//   entity.account = event.params.account;
//   entity.tokenIn = event.params.tokenIn;

//   // Entities can be written to the store with `.save()`
//   entity.save();

// Comment out the lines below when done :)
// export { runTests } from "../tests/VaultSwap.test";
// export { runTests } from "../tests/IncreasePosition.test";
// export { runTests } from "../tests/DecreasePosition.test";
// export { runTests } from "../tests/ClosePosition.test";
// export { runTests } from "../tests/BuyNUSD.test";
// export { runTests } from "../tests/SellNUSD.test";
// export { runTests } from "../tests/SellNUSD-CloseLP.test";
// export { runTests } from "../tests/LiquidatePosition.test";
// export { runTests } from "../tests/CollectMarginFees.test";
// export { runTests } from "../tests/CollectSwapFees.test";
// export { runTests } from "../tests/IncreaseGuaranteedUsd.test";
// export { runTests } from "../tests/IncreaseNUSDAmount.test";
// export { runTests } from "../tests/IncreaseReservedAmount.test";
// export { runTests } from "../tests/IncreasePoolAmount.test";
// export { runTests } from "../tests/UpdateFundingRate.test";
// NOTE - Decrease tests not required as mapping to Increase functions result in identical logic
