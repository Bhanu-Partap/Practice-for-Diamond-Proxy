/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../../common";

export type AddressDataStruct = {
  Data: PromiseOrValue<BytesLike>;
  Address: PromiseOrValue<string>;
};

export type AddressDataStructOutput = [string, string] & {
  Data: string;
  Address: string;
};

export type AddressNumberStruct = {
  Number: PromiseOrValue<BigNumberish>;
  Address: PromiseOrValue<string>;
};

export type AddressNumberStructOutput = [BigNumber, string] & {
  Number: BigNumber;
  Address: string;
};

export interface OurkadeHelperInterface extends utils.Interface {
  functions: {
    "addressDataToBytes32((bytes12,address))": FunctionFragment;
    "addressNumberToBytes32((uint96,address))": FunctionFragment;
    "addressToBytes32(address)": FunctionFragment;
    "bytes32ToAddress(bytes32)": FunctionFragment;
    "bytes32ToAddressData(bytes32)": FunctionFragment;
    "bytes32ToAddressNumber(bytes32)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addressDataToBytes32"
      | "addressNumberToBytes32"
      | "addressToBytes32"
      | "bytes32ToAddress"
      | "bytes32ToAddressData"
      | "bytes32ToAddressNumber"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addressDataToBytes32",
    values: [AddressDataStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "addressNumberToBytes32",
    values: [AddressNumberStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "addressToBytes32",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "bytes32ToAddress",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "bytes32ToAddressData",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "bytes32ToAddressNumber",
    values: [PromiseOrValue<BytesLike>]
  ): string;

  decodeFunctionResult(
    functionFragment: "addressDataToBytes32",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addressNumberToBytes32",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addressToBytes32",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "bytes32ToAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "bytes32ToAddressData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "bytes32ToAddressNumber",
    data: BytesLike
  ): Result;

  events: {};
}

export interface OurkadeHelper extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: OurkadeHelperInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    addressDataToBytes32(
      ad: AddressDataStruct,
      overrides?: CallOverrides
    ): Promise<[string]>;

    addressNumberToBytes32(
      ad: AddressNumberStruct,
      overrides?: CallOverrides
    ): Promise<[string]>;

    addressToBytes32(
      a: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    bytes32ToAddress(
      b: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    bytes32ToAddressData(
      b: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[AddressDataStructOutput]>;

    bytes32ToAddressNumber(
      b: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[AddressNumberStructOutput]>;
  };

  addressDataToBytes32(
    ad: AddressDataStruct,
    overrides?: CallOverrides
  ): Promise<string>;

  addressNumberToBytes32(
    ad: AddressNumberStruct,
    overrides?: CallOverrides
  ): Promise<string>;

  addressToBytes32(
    a: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>;

  bytes32ToAddress(
    b: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<string>;

  bytes32ToAddressData(
    b: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<AddressDataStructOutput>;

  bytes32ToAddressNumber(
    b: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<AddressNumberStructOutput>;

  callStatic: {
    addressDataToBytes32(
      ad: AddressDataStruct,
      overrides?: CallOverrides
    ): Promise<string>;

    addressNumberToBytes32(
      ad: AddressNumberStruct,
      overrides?: CallOverrides
    ): Promise<string>;

    addressToBytes32(
      a: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    bytes32ToAddress(
      b: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;

    bytes32ToAddressData(
      b: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<AddressDataStructOutput>;

    bytes32ToAddressNumber(
      b: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<AddressNumberStructOutput>;
  };

  filters: {};

  estimateGas: {
    addressDataToBytes32(
      ad: AddressDataStruct,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    addressNumberToBytes32(
      ad: AddressNumberStruct,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    addressToBytes32(
      a: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    bytes32ToAddress(
      b: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    bytes32ToAddressData(
      b: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    bytes32ToAddressNumber(
      b: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addressDataToBytes32(
      ad: AddressDataStruct,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    addressNumberToBytes32(
      ad: AddressNumberStruct,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    addressToBytes32(
      a: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    bytes32ToAddress(
      b: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    bytes32ToAddressData(
      b: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    bytes32ToAddressNumber(
      b: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
