import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Network, Alchemy } from "alchemy-sdk";

import { CRYPTODEVS_GOERLI_ADDRESS } from "../constants";

const alchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_GOERLI_RPC_KEY,
  network: Network.ETH_GOERLI,
});

export function useCryptoDevs(address) {
  const { isSuccess: isCryptoDevsReadSuccess, data } = useQuery(
    [address],
    () =>
      alchemy.nft.getNftsForOwner(address, {
        contractAddresses: [CRYPTODEVS_GOERLI_ADDRESS],
      }),
    { enabled: address ? true : false }
  );
  const nftBalance = data?.totalCount;
  return useMemo(
    () => ({ isCryptoDevsReadSuccess, nftBalance }),
    [isCryptoDevsReadSuccess, nftBalance]
  );
}
