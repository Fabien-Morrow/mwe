import React from "react";
import Image from "next/image";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { CRYPTODEVSTOKEN_GOERLI_ADDRESS } from "../constants";
import CryptoDevsToken from "../constants/CryptoDevsToken.json";

import styles from "../styles/Home.module.css";

import { useCryptoDevs } from "../hooks/useCryptoDevs";
import { useCryptoDevsToken } from "../hooks/useCryptoDevsToken";
import { useHasMounted } from "../hooks/useHasMounted";

import { ethers } from "ethers";

const ShowInfos = ({ address }: { address: string }) => {
  const { isCryptoDevsReadSuccess, nftBalance } = useCryptoDevs(address);
  const { maxSupply, balanceOf, totalSupply } = useCryptoDevsToken(address);
  return (
    <div>
      <div className={styles.description}>CryptoDevs (CD) token is live !</div>
      <div className={styles.labelNftMinted}>
        {totalSupply} CD out of {maxSupply} has been minted !
      </div>
      {address === undefined ? (
        <div>Connect to see your balance</div>
      ) : (
        <>
          <div className={styles.labelNftMinted}>You own {balanceOf} CD !</div>
          <div className={styles.labelNftMinted}>
            you own {isCryptoDevsReadSuccess ? nftBalance : "error"} CryptoDevs
            NFTs and can claim
            {isCryptoDevsReadSuccess ? nftBalance * 10 : "error"} CD !
          </div>
        </>
      )}
    </div>
  );
};

function Mint({
  type = "mint",
  address,
  nftBalance = 0,
}: {
  type: string;
  address: string;
  nftBalance: number;
}) {
  const { price } = useCryptoDevsToken(address);
  const { config, error } = usePrepareContractWrite({
    address: CRYPTODEVSTOKEN_GOERLI_ADDRESS,
    abi: CryptoDevsToken.abi,
    functionName: type,
    args: type == "mint" ? [30] : [],
    enabled: Boolean(price),
    overrides: {
      value:
        price && type == "mint"
          ? ethers.utils.parseUnits(price).mul(30)
          : undefined,
    },
  });
  const {
    data,
    write: mintOrClaim,
    status: writeStatus,
  } = useContractWrite(config);
  const { isLoading, status: txStatus } = useWaitForTransaction({
    hash: data?.hash,
  });

  let buttonText;
  if (type == "mint") {
    buttonText = isLoading ? "Minting..." : "Mint 30 tokens";
  } else {
    buttonText = isLoading ? "Minting..." : `Claim up to ${10 * nftBalance}`;
  }

  return (
    <div>
      <button
        className={styles.button}
        onClick={() => mintOrClaim?.()}
        disabled={!mintOrClaim || isLoading}
      >
        {buttonText}
      </button>
      <div> tx Status : {txStatus}</div>
      <div> Error : {error?.reason} </div>
      {data?.hash && (
        <div>
          Check tx on{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://goerli.etherscan.io//tx/${data?.hash}`}
          >
            Etherscan
          </a>
        </div>
      )}
    </div>
  );
}

function ClaimOrMint({ address }: { address: string }) {
  const { nftBalance } = useCryptoDevs(address);

  return (
    <div>
      <Mint type={"mint"} address={address} nftBalance={nftBalance} />
      {nftBalance && (
        <Mint type={"claim"} address={address} nftBalance={nftBalance} />
      )}
    </div>
  );
}

export default function Home() {
  const { hasMounted } = useHasMounted();

  const { isConnected, address } = useAccount();
  return (
    <div className={styles.appContainer}>
      <div className={styles.contentContainer}>
        <h1 className={styles.title}>Welcome to CryptoDevs ICO !</h1>
        <div className={styles.description}>
          You can claim or buy CryptoDevs tokens here
        </div>
        {hasMounted && <ShowInfos address={address} />}
        <ConnectButton />
        {hasMounted && isConnected && <ClaimOrMint address={address} />}
      </div>
      <div className={styles.nftContainer}>
        <Image src="/0.svg" width="423" height="532" alt="CryptoDevs Img" />
      </div>
    </div>
  );
}
