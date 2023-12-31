/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  Newfuc,
  NewfucInterface,
} from "../../../../../contracts/ourkade/ourkadeLogicContract/newfuc.sol/Newfuc";

const _abi = [
  {
    inputs: [],
    name: "readRepGuiltyLimit",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_guiltylimit",
        type: "uint8",
      },
    ],
    name: "setRepGuiltyLimit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50610159806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063557d57941461003b578063c450396314610050575b600080fd5b61004e6100493660046100f9565b61006e565b005b61005861007a565b60405160ff909116815260200160405180910390f35b61007781610089565b50565b60006100846100b6565b905090565b60006100936100d5565b602d01805460ff909316600160e01b0260ff60e01b199093169290921790915550565b6000806100c16100d5565b602d0154600160e01b900460ff1692915050565b7f3811155c0a13998f1918d4b7c42705baf10874a2b3c97697256081485ee6634790565b60006020828403121561010b57600080fd5b813560ff8116811461011c57600080fd5b939250505056fea2646970667358221220f46af588d6347d0aa5151907d345121c945962eb30ee2c59a5bf51f55e05c68664736f6c63430008110033";

type NewfucConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: NewfucConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Newfuc__factory extends ContractFactory {
  constructor(...args: NewfucConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Newfuc> {
    return super.deploy(overrides || {}) as Promise<Newfuc>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Newfuc {
    return super.attach(address) as Newfuc;
  }
  override connect(signer: Signer): Newfuc__factory {
    return super.connect(signer) as Newfuc__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): NewfucInterface {
    return new utils.Interface(_abi) as NewfucInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Newfuc {
    return new Contract(address, _abi, signerOrProvider) as Newfuc;
  }
}
