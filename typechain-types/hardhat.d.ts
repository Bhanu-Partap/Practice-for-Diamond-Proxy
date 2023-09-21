/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "IERC1271",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1271__factory>;
    getContractFactory(
      name: "Initializable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Initializable__factory>;
    getContractFactory(
      name: "DoubleEndedQueue",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DoubleEndedQueue__factory>;
    getContractFactory(
      name: "Diamond",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Diamond__factory>;
    getContractFactory(
      name: "DiamondCutFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DiamondCutFacet__factory>;
    getContractFactory(
      name: "DiamondLoupeFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DiamondLoupeFacet__factory>;
    getContractFactory(
      name: "OwnershipFacet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OwnershipFacet__factory>;
    getContractFactory(
      name: "IDiamondCut",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDiamondCut__factory>;
    getContractFactory(
      name: "IDiamondLoupe",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDiamondLoupe__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "IERC173",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC173__factory>;
    getContractFactory(
      name: "LibDiamond",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LibDiamond__factory>;
    getContractFactory(
      name: "DiamondInit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DiamondInit__factory>;
    getContractFactory(
      name: "Accesslib",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Accesslib__factory>;
    getContractFactory(
      name: "Ourkadelib",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ourkadelib__factory>;
    getContractFactory(
      name: "Newfuc",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Newfuc__factory>;
    getContractFactory(
      name: "OurkadeAdmin",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OurkadeAdmin__factory>;
    getContractFactory(
      name: "OurkadeCompetition",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OurkadeCompetition__factory>;
    getContractFactory(
      name: "OurkadeGame",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OurkadeGame__factory>;
    getContractFactory(
      name: "OurkadeHelper",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OurkadeHelper__factory>;
    getContractFactory(
      name: "OurkadeNode",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OurkadeNode__factory>;
    getContractFactory(
      name: "OurkadePlayer",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OurkadePlayer__factory>;

    getContractAt(
      name: "IERC1271",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1271>;
    getContractAt(
      name: "Initializable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Initializable>;
    getContractAt(
      name: "DoubleEndedQueue",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DoubleEndedQueue>;
    getContractAt(
      name: "Diamond",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Diamond>;
    getContractAt(
      name: "DiamondCutFacet",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DiamondCutFacet>;
    getContractAt(
      name: "DiamondLoupeFacet",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DiamondLoupeFacet>;
    getContractAt(
      name: "OwnershipFacet",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OwnershipFacet>;
    getContractAt(
      name: "IDiamondCut",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IDiamondCut>;
    getContractAt(
      name: "IDiamondLoupe",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IDiamondLoupe>;
    getContractAt(
      name: "IERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "IERC173",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC173>;
    getContractAt(
      name: "LibDiamond",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.LibDiamond>;
    getContractAt(
      name: "DiamondInit",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DiamondInit>;
    getContractAt(
      name: "Accesslib",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Accesslib>;
    getContractAt(
      name: "Ourkadelib",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ourkadelib>;
    getContractAt(
      name: "Newfuc",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Newfuc>;
    getContractAt(
      name: "OurkadeAdmin",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OurkadeAdmin>;
    getContractAt(
      name: "OurkadeCompetition",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OurkadeCompetition>;
    getContractAt(
      name: "OurkadeGame",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OurkadeGame>;
    getContractAt(
      name: "OurkadeHelper",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OurkadeHelper>;
    getContractAt(
      name: "OurkadeNode",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OurkadeNode>;
    getContractAt(
      name: "OurkadePlayer",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OurkadePlayer>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}