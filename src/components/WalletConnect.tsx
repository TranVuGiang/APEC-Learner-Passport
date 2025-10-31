"use client";

import { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { truncatePublicKey } from "@/lib/solana";

export const WalletConnect: FC = () => {
  const { publicKey, connected } = useWallet();

  return (
    <div className="flex items-center gap-4">
      {connected && publicKey && (
        <div className="hidden md:block text-sm text-gray-600 dark:text-gray-300">
          {truncatePublicKey(publicKey.toString(), 4)}
        </div>
      )}
      <WalletMultiButton className="!bg-primary-600 hover:!bg-primary-700 !rounded-lg" />
    </div>
  );
};
