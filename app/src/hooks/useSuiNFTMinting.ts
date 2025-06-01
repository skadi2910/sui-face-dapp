import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, REGISTRY_ID, RANDOM_OBJECT_ID, CLOCK_OBJECT_ID } from "../utils/utils";
// Your contract constants


export const useSuiNFTMinting = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState<"idle" | "success" | "error">("idle");
  const [txDigest, setTxDigest] = useState<string | null>(null);

  const mintNFT = async () => {
    if (!currentAccount) {
      throw new Error("Wallet not connected");
    }

    setIsMinting(true);
    setMintStatus("idle");
    setTxDigest(null);

    try {
      // console.log("🎨 Starting Face Passport NFT mint on Sui...");
      
      // Create transaction for NFT minting
      const tx = new Transaction();
      
      // Call your simplified mint function
      tx.moveCall({
        target: `${PACKAGE_ID}::sui_face_passport_nft::mint_proof_nft`,
        arguments: [
          tx.object(REGISTRY_ID),    // MintRegistry
          tx.object(RANDOM_OBJECT_ID), // Random object
          tx.object(CLOCK_OBJECT_ID),   // Clock object
        ],
      });

      // Execute the transaction
      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            // console.log("✅ Face Passport NFT minted successfully!", result);
            setTxDigest(result.digest);
            setMintStatus("success");
            
            // Extract NFT object ID from created objects
            // For now, just log the result to see the structure
            // console.log("Transaction result structure:", JSON.stringify(result, null, 2));
            
            // We'll extract the NFT ID later once we see the actual structure
            // setMintedNFTId("will-extract-from-result");
              // TEMPORARY: Manually set a test NFT ID
            // setMintedNFTId("0x8d5f2d20881446d5d6101fcf59b7b7ae7e28b555753019f3deb9cb09bdd67dfd");
          },
          onError: (error) => {
            // console.error("❌ Transaction failed:", error);
            setMintStatus("error");
          },
        }
      );
      
    } catch (error) {
      // console.error("❌ NFT minting failed:", error);
      setMintStatus("error");
      setIsMinting(false);
    }
  };

  const resetMinting = () => {
    setMintStatus("idle");
    setTxDigest(null);
  };

  return {
    // State
    isMinting,
    mintStatus,
    txDigest,

    isWalletConnected: !!currentAccount,
    walletAddress: currentAccount?.address,
    
    // Actions
    mintNFT,
    resetMinting,
    
  };
};