import { abi } from "../constants/CryptoDevsToken";
import { useContractReads } from "wagmi";

export function useCryptoDevsToken(address: string | undefined) {
  const configCryptoDevsToken = {
    address: "CRYPTODEVSTOKEN_GOERLI_ADDRESS",
    abi: abi,
  };
  let contracts = [
    {
      ...configCryptoDevsToken,
      functionName: "maxSupply",
    },
  ];
  if (address) {
    contracts.push({
      ...configCryptoDevsToken,
      functionName: "balanceOf",
      args: [address], // throwing an error, see below
    });
  }
  const { data } = useContractReads({
    contracts: contracts,
  });
  return { data };
}

// Argument of type '{ functionName: string; args: string[]; address: string; abi: ({ inputs: { internalType: string; name: string; type: string; }[]; stateMutability: string; type: string; anonymous?: undefined; name?: undefined; outputs?: undefined; } | { ...; } | { ...; } | { ...; })[]; }' is not assignable to parameter of type '{ functionName: string; address: string; abi: ({ inputs: { internalType: string; name: string; type: string; }[]; stateMutability: string; type: string; anonymous?: undefined; name?: undefined; outputs?: undefined; } | { ...; } | { ...; } | { ...; })[]; }'.
// Object literal may only specify known properties, and 'args' does not exist in type '{ functionName: string; address: string; abi: ({ inputs: { internalType: string; name: string; type: string; }[]; stateMutability: string; type: string; anonymous?: undefined; name?: undefined; outputs?: undefined; } | { ...; } | { ...; } | { ...; })[]; }'.
