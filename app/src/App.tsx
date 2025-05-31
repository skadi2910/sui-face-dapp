import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { useState } from "react";
import { WalletStatus } from "./WalletStatus";
import { FaceDetection } from "./FaceDetection";
import { useSuiNFTMinting } from "./hooks/useSuiNFTMinting";

function App() {
  const [isVerified, setIsVerified] = useState(false);
  const {
    isMinting,
    mintStatus,
    txDigest,
    isWalletConnected,
    walletAddress,
    mintNFT,
    resetMinting,
  } = useSuiNFTMinting();

  const handleVerificationComplete = () => {
    setIsVerified(true);
    resetMinting();
  };

  const handleVerificationReset = () => {
    setIsVerified(false);
    resetMinting();
  };

  const handleMintNFT = async () => {
    try {
      await mintNFT();
    } catch (error) {
      console.error("Minting error:", error);
      if (error instanceof Error && error.message === "Wallet not connected") {
        alert("Please connect your wallet first!");
      }
    }
  };

  const handleStartOver = () => {
    setIsVerified(false);
    resetMinting();
  };

  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>SuiFace - Verified NFT Minting</Heading>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          <WalletStatus />
          
          {/* Show NFT Minting Section after verification */}
          {isVerified && (
            <div className="mb-5 p-6 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200 rounded-lg text-center">
              <h4 className="text-xl font-bold text-purple-800 mb-3">🎨 Ready to Mint Your Verified NFT!</h4>
              
              {!isWalletConnected ? (
                <p className="text-red-700 font-bold mb-4">
                  Please connect your Sui wallet to mint your NFT
                </p>
              ) : mintStatus === "success" ? (
                <div>
                  <p className="text-green-700 font-bold mb-4">🎉 NFT Minted Successfully on Sui!</p>
                  {txDigest && (
                    <p className="text-sm text-gray-600 mb-4">
                      Transaction: <code className="bg-gray-200 px-2 py-1 rounded">{txDigest}</code>
                    </p>
                  )}
                  <button
                    onClick={handleStartOver}
                    className="px-6 py-4 text-lg font-bold rounded-lg bg-blue-500 hover:bg-blue-600 text-white cursor-pointer transition-colors duration-200"
                  >
                    🔄 Mint Another
                  </button>
                </div>
              ) : mintStatus === "error" ? (
                <div>
                  <p className="text-red-700 font-bold mb-4">❌ Minting Failed. Please try again.</p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={handleMintNFT}
                      className="px-6 py-4 text-lg font-bold rounded-lg bg-purple-600 hover:bg-purple-700 text-white cursor-pointer transition-colors duration-200"
                    >
                      🔄 Retry Mint
                    </button>
                    <button
                      onClick={handleStartOver}
                      className="px-6 py-4 text-lg font-bold rounded-lg bg-gray-500 hover:bg-gray-600 text-white cursor-pointer transition-colors duration-200"
                    >
                      🔄 Start Over
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-purple-700 mb-4">
                    Your identity has been verified! Mint your unique Sui NFT.
                  </p>
                  {walletAddress && (
                    <p className="text-sm text-gray-600 mb-4">
                      Wallet: <code className="bg-gray-200 px-2 py-1 rounded">{walletAddress}</code>
                    </p>
                  )}
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={handleMintNFT}
                      disabled={isMinting}
                      className={`
                        px-8 py-4 text-lg font-bold rounded-lg transition-all duration-200
                        ${isMinting 
                          ? "bg-gray-400 cursor-not-allowed" 
                          : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 cursor-pointer"
                        } text-white
                      `}
                    >
                      {isMinting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Minting on Sui...
                        </>
                      ) : (
                        "🎨 Mint NFT on Sui"
                      )}
                    </button>
                    
                    <button
                      onClick={handleStartOver}
                      className="px-6 py-4 text-lg font-bold rounded-lg bg-gray-500 hover:bg-gray-600 text-white cursor-pointer transition-colors duration-200"
                    >
                      🔄 Start Over
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* Face Detection Component - hidden when showing mint section */}
          {!isVerified && (
            <FaceDetection 
              onVerificationComplete={handleVerificationComplete}
              onVerificationReset={handleVerificationReset}
            />
          )}
        </Container>
      </Container>
    </>
  );
}

export default App;