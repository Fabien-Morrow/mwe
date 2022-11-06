import { useContractReads, useContractEvent } from "wagmi";
import { useMemo } from "react";
import { ethers } from "ethers";

import { CRYPTODEVSTOKEN_GOERLI_ADDRESS } from "../constants";
import CryptoDevsToken from "../constants/CryptoDevsToken.json";

export function useCryptoDevsToken(address) {
  const configCryptoDevsToken = {
    address: CRYPTODEVSTOKEN_GOERLI_ADDRESS,
    abi: CryptoDevsToken.abi,
  };

  let contracts = [
    {
      ...configCryptoDevsToken,
      functionName: "maxSupply",
    },
    {
      ...configCryptoDevsToken,
      functionName: "totalSupply",
    },
    {
      ...configCryptoDevsToken,
      functionName: "price",
    },
    {
      ...configCryptoDevsToken,
      functionName: "airdropAmount",
    },
  ];

  if (address) {
    contracts.push({
      ...configCryptoDevsToken,
      functionName: "balanceOf",
      args: [address],
    });
  }

  const {
    data,
    isSuccess: isCryptoDevsTokenReadSuccess,
    isLoading,
    isError,
    error,
    refetch,
  } = useContractReads({
    contracts: contracts,
    allowFailure: true,
    // returns everything with 18 digits, in string
    select: (data) => {
      const kikoo = data.map((item) =>
        item ? ethers.utils.formatUnits(item) : undefined
      );
      return kikoo;
    },
  });
  // console.log(data, isError, error, isCryptoDevsTokenReadSuccess, isLoading);
  useContractEvent({
    ...configCryptoDevsToken,
    eventName: "Transfer",
    listener: (event) => refetch(),
  });

  const maxSupply = data?.[0];
  const totalSupply = data?.[1];
  const price = data?.[2];
  const airdropAmount = data?.[3];
  const balanceOf = data?.[4];

  return {
    isCryptoDevsTokenReadSuccess,
    maxSupply,
    totalSupply,
    price,
    airdropAmount,
    balanceOf,
  };
}
