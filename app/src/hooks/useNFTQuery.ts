import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

interface UseNFTQueryProps {
  txDigest?: string | null;
  enabled?: boolean;
}

export const useNFTQuery = ({ txDigest, enabled = true }: UseNFTQueryProps) => {
  const [extractedNFTId, setExtractedNFTId] = useState<string | null>(null);

  // Query transaction to extract NFT ID from digest
  const { data: txData } = useSuiClientQuery(
    "getTransactionBlock",
    {
      digest: txDigest!,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    },
    {
      enabled: !!txDigest && enabled,
    }
  );

  // Extract NFT ID from transaction effects
  useEffect(() => {
    // console.log("🔍 Full Transaction Data:", txData);
    
    if (txData?.objectChanges) {
      // console.log("🔍 Object changes from transaction:", txData.objectChanges);
      
      // Method 1: Find the object with SuiFacePassportNFT type (updated struct name)
      const nftObject = txData.objectChanges.find((change: any) => 
        'objectId' in change && 
        change.objectType && 
        (change.objectType.includes("sui_face_passport_nft::SuiFacePassportNFT") ||
         change.objectType.includes("SuiFacePassportNFT"))
      );
      
      if (nftObject && 'objectId' in nftObject) {
        // console.log("🎯 Found NFT by type:", nftObject.objectId);
        // console.log("🎯 NFT Object Type:", nftObject.objectType);
        setExtractedNFTId(nftObject.objectId);
        return;
      }
      
      // Method 2: Fallback - look for any object with our package ID
      const packageNFT = txData.objectChanges.find((change: any) => 
        'objectId' in change && 
        change.objectType && 
        change.objectType.includes("sui_face_passport_nft::")
      );
      
      if (packageNFT && 'objectId' in packageNFT) {
        // console.log("🎯 Found NFT by package:", packageNFT.objectId);
        // console.log("🎯 Package NFT Type:", packageNFT.objectType);
        setExtractedNFTId(packageNFT.objectId);
        return;
      }
      
      // Method 3: Final fallback - take the last created object (excluding system objects)
      const createdObjects = txData.objectChanges.filter((change: any) => 
        'objectId' in change && 
        change.objectId && 
        !change.objectType?.includes("::package::") &&
        !change.objectType?.includes("::Publisher")
      );
      const lastCreated = createdObjects[createdObjects.length - 1];
      
      if (lastCreated && 'objectId' in lastCreated) {
        // console.log("🎯 Found NFT as last created object:", lastCreated.objectId);
        // console.log("🎯 Last Created Type:", lastCreated.objectType);
        setExtractedNFTId(lastCreated.objectId);
      }
    }
  }, [txData]);

  // Use either provided nftId or extracted ID
  const finalNFTId = extractedNFTId;

  // Query for NFT object data with display
  const { data: nftData, isLoading, error, refetch } = useSuiClientQuery(
    "getObject",
    {
      id: finalNFTId!,
      options: {
        showContent: true,
        showDisplay: true,  // This is crucial for Display data!
        showOwner: true,
        showType: true,
      },
    },
    {
      enabled: !!finalNFTId && enabled,
    }
  );

  // // Log NFT data when available with detailed display logging
  // useEffect(() => {
  //   if (nftData) {
  //     // console.log("🔍 Complete NFT Data:", nftData);
      
  //     // Log raw fields
  //     if (nftData.data?.content && 'fields' in nftData.data.content) {
  //       // console.log("🏷️ Raw NFT Fields:", nftData.data.content.fields);
  //     }
      
  //     // Log display data
  //     if (nftData.data?.display) {
  //       console.log("🖼️ Display Object:", nftData.data.display);
  //       if (nftData.data.display.data) {
  //         console.log("🖼️ Display Data:", nftData.data.display.data);
  //         console.log("🖼️ Image URL from Display:", nftData.data.display.data.image_url);
  //         console.log("🖼️ Name from Display:", nftData.data.display.data.name);
  //         console.log("🖼️ Description from Display:", nftData.data.display.data.description);
  //         console.log("🖼️ UUID from Display:", nftData.data.display.data.uuid);
  //       }
  //     } else {
  //       console.log("⚠️ No display data found - check if Display was properly set up in Move contract");
  //     }
  //   }
  // }, [nftData]);

  // Parse and structure the NFT data
  const parsedNFTData = nftData?.data ? {
    objectId: nftData.data.objectId,
    version: nftData.data.version,
    digest: nftData.data.digest,
    type: nftData.data.type,
    owner: nftData.data.owner,
    content: nftData.data.content,
    fields: nftData.data.content && 'fields' in nftData.data.content ? nftData.data.content.fields : null,
    display: nftData.data.display,
  } : null;

  return {
    // IDs
    nftId: finalNFTId,
    
    // Raw data
    nftData,
    
    // Parsed data
    parsedData: parsedNFTData,
    
    // Status
    isLoading,
    error,
    
    // Actions
    refetch,
    
    // Helper flags
    hasData: !!nftData?.data,
    hasFields: !!parsedNFTData?.fields,
    hasDisplay: !!parsedNFTData?.display,
  };
};