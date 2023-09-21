/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  OurkadeHelper,
  OurkadeHelperInterface,
} from "../../../../../contracts/ourkade/ourkadeLogicContract/ourkadeHelper.sol/OurkadeHelper";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes12",
            name: "Data",
            type: "bytes12",
          },
          {
            internalType: "address",
            name: "Address",
            type: "address",
          },
        ],
        internalType: "struct AddressData",
        name: "ad",
        type: "tuple",
      },
    ],
    name: "addressDataToBytes32",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint96",
            name: "Number",
            type: "uint96",
          },
          {
            internalType: "address",
            name: "Address",
            type: "address",
          },
        ],
        internalType: "struct AddressNumber",
        name: "ad",
        type: "tuple",
      },
    ],
    name: "addressNumberToBytes32",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "a",
        type: "address",
      },
    ],
    name: "addressToBytes32",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "b",
        type: "bytes32",
      },
    ],
    name: "bytes32ToAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "b",
        type: "bytes32",
      },
    ],
    name: "bytes32ToAddressData",
    outputs: [
      {
        components: [
          {
            internalType: "bytes12",
            name: "Data",
            type: "bytes12",
          },
          {
            internalType: "address",
            name: "Address",
            type: "address",
          },
        ],
        internalType: "struct AddressData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "b",
        type: "bytes32",
      },
    ],
    name: "bytes32ToAddressNumber",
    outputs: [
      {
        components: [
          {
            internalType: "uint96",
            name: "Number",
            type: "uint96",
          },
          {
            internalType: "address",
            name: "Address",
            type: "address",
          },
        ],
        internalType: "struct AddressNumber",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506103fd806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c80632017d0b5146100675780635ced058e1461008d5780637b287895146100b857806382c947b7146100cb578063c012eb0d146100de578063efbe1b8e1461011f575b600080fd5b61007a6100753660046102c4565b61015f565b6040519081526020015b60405180910390f35b6100a061009b366004610310565b610170565b6040516001600160a01b039091168152602001610084565b61007a6100c6366004610329565b610178565b61007a6100d936600461035a565b610183565b6100f16100ec366004610310565b610194565b6040805182516001600160a01b03191681526020928301516001600160a01b03169281019290925201610084565b61013261012d366004610310565b6101dd565b6040805182516001600160601b031681526020928301516001600160a01b03169281019290925201610084565b600061016a82610217565b92915050565b60008161016a565b600061016a8261024f565b60006001600160a01b03821661016a565b60408051808201909152600080825260208201526040518060400160405280836001600160a01b03191681526020016101cc84610170565b6001600160a01b0316905292915050565b604080518082019091526000808252602082015260405180604001604052808360a01c6001600160601b031681526020016101cc84610170565b60008160000151826020015160601b60405160200161023792919061037c565b60405160208183030381529060405261016a906103a0565b6000816000015160a01b826020015160601b60405160200161023792919061037c565b604080519081016001600160401b03811182821017156102a257634e487b7160e01b600052604160045260246000fd5b60405290565b80356001600160a01b03811681146102bf57600080fd5b919050565b6000604082840312156102d657600080fd5b6102de610272565b82356001600160a01b0319811681146102f657600080fd5b8152610304602084016102a8565b60208201529392505050565b60006020828403121561032257600080fd5b5035919050565b60006040828403121561033b57600080fd5b610343610272565b82356001600160601b03811681146102f657600080fd5b60006020828403121561036c57600080fd5b610375826102a8565b9392505050565b6001600160a01b03199290921682526001600160601b031916600c82015260200190565b805160208083015191908110156103c1576000198160200360031b1b821691505b5091905056fea2646970667358221220e7509b02896f0eee15f1cad3205b5709e0a8b14c3d05200e4920a97790fcdbf164736f6c63430008110033";

type OurkadeHelperConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: OurkadeHelperConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class OurkadeHelper__factory extends ContractFactory {
  constructor(...args: OurkadeHelperConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<OurkadeHelper> {
    return super.deploy(overrides || {}) as Promise<OurkadeHelper>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): OurkadeHelper {
    return super.attach(address) as OurkadeHelper;
  }
  override connect(signer: Signer): OurkadeHelper__factory {
    return super.connect(signer) as OurkadeHelper__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): OurkadeHelperInterface {
    return new utils.Interface(_abi) as OurkadeHelperInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): OurkadeHelper {
    return new Contract(address, _abi, signerOrProvider) as OurkadeHelper;
  }
}