import { Address, ethereum, BigInt, Bytes } from "@graphprotocol/graph-ts";

export const createAddressEventParameter = (
  event: ethereum.Event,
  eventValue: Address
): void => {
  let eventParam = new ethereum.EventParam();
  eventParam.value = ethereum.Value.fromAddress(eventValue);
  event.parameters.push(eventParam);
};

export const createBytesEventParameter = (
  event: ethereum.Event,
  eventValue: Bytes
): void => {
  let eventParam = new ethereum.EventParam();
  eventParam.value = ethereum.Value.fromBytes(eventValue);
  event.parameters.push(eventParam);
};

export const createUnsignedBigIntEventParameter = (
  event: ethereum.Event,
  eventValue: BigInt
): void => {
  let eventParam = new ethereum.EventParam();
  eventParam.value = ethereum.Value.fromUnsignedBigInt(eventValue);
  event.parameters.push(eventParam);
};

export const createBooleanEventParameter = (
  event: ethereum.Event,
  eventValue: boolean
): void => {
  let eventParam = new ethereum.EventParam();
  eventParam.value = ethereum.Value.fromBoolean(eventValue);
  event.parameters.push(eventParam);
};
