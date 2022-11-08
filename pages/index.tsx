import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCryptoDevsToken } from "../hooks/useCryptoDevsToken";
import { useAccount } from "wagmi";
export default function Home() {
  const { address } = useAccount();
  const { data } = useCryptoDevsToken(address);
  console.log(data);
  return <ConnectButton />;
}
