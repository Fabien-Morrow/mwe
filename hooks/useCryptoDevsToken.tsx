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
      args: [address],
    });
  }

  const { data } = useContractReads({
    // the line below raises :
    // Type 'ContractConfig[]' is not assignable to type 'readonly
    // ContractConfig<Omit<{ chainId?: number | undefined; }, OmitConfigProperties>, Abi, string (...)
    contracts: contracts,
  });

  return { data };
}
