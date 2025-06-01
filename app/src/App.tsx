// import { Container } from "@radix-ui/themes";
// import { useState } from "react";
// import { FaceDetection } from "./Components/FaceDetection";
// import { useSuiNFTMinting } from "./hooks/useSuiNFTMinting";
// import { useNFTQuery } from "./hooks/useNFTQuery";
// import DisplayNFT from "./Components/DisplayNFT";
// import { Footer } from "./Components/Footer";
// import { Header } from "./Components/Header";
// // Import the animations CSS
// import "./styles/animations.css";

// function App() {
//   const [isVerified, setIsVerified] = useState(false);
//   const [showNFTDisplay, setShowNFTDisplay] = useState(false);
//   const [showFireworks, setShowFireworks] = useState(false);
//   const {
//     isMinting,
//     mintStatus,
//     txDigest,
//     isWalletConnected,
//     walletAddress,
//     mintNFT,
//     resetMinting,
//   } = useSuiNFTMinting();

//   // Query NFT data for the current minted NFT
//   const { parsedData: currentNFTData, isLoading: currentNFTLoading } = useNFTQuery({ 
//     txDigest: txDigest,
//     enabled: !!txDigest 
//   });

//   const handleVerificationComplete = () => {
//     setIsVerified(true);
//     setShowNFTDisplay(false);
//     resetMinting();
//   };

//   const handleVerificationReset = () => {
//     setIsVerified(false);
//     setShowNFTDisplay(false);
//     resetMinting();
//   };

//   const handleDisplayNFT = () => {
//     // Start fireworks celebration!
//     setShowFireworks(true);
    
//     // Show NFT after a short delay to let fireworks play
//     setTimeout(() => {
//       setShowNFTDisplay(true);
//       // Stop fireworks after NFT modal opens
//       setTimeout(() => {
//         setShowFireworks(false);
//       }, 2000);
//     }, 1000);
//   };

//   const handleMintNFT = async () => {
//     try {
//       await mintNFT();
//     } catch (error) {
//       console.error("Minting error:", error);
//       if (error instanceof Error && error.message === "Wallet not connected") {
//         alert("Whoa there! 🛑 Please connect your wallet first to join the NFT party!");
//       }
//     }
//   };

//   const handleStartOver = () => {
//     setIsVerified(false);
//     resetMinting();
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 relative overflow-hidden">
//       {/* Fireworks Animation */}
//       {showFireworks && (
//         <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
//           {/* Multiple firework bursts with varied sizes */}
//           {[...Array(8)].map((_, i) => {
//             const size = Math.random() > 0.5 ? 'big' : Math.random() > 0.3 ? 'normal' : 'small';
//             const animationClass = size === 'big' ? 'animate-firework-big' : 
//                                  size === 'small' ? 'animate-firework-small' : 
//                                  'animate-firework';
            
//             return (
//               <div
//                 key={i}
//                 className={`absolute ${animationClass}`}
//                 style={{
//                   left: `${Math.random() * 100}%`,
//                   top: `${Math.random() * 60 + 20}%`,
//                   animationDelay: `${Math.random() * 2}s`,
//                   animationDuration: `${2 + Math.random() * 2}s`
//                 }}
//               >
//                 {/* Firework center */}
//                 <div className="relative">
//                   {/* Sparkles radiating out */}
//                   {[...Array(12)].map((_, j) => (
//                     <div
//                       key={j}
//                       className="absolute w-2 h-2 rounded-full animate-sparkle"
//                       style={{
//                         background: `hsl(${Math.random() * 360}, 70%, 60%)`,
//                         transform: `rotate(${j * 30}deg) translateY(-${20 + Math.random() * 40}px)`,
//                         animationDelay: `${Math.random() * 0.5}s`,
//                         animationDuration: `${1 + Math.random()}s`
//                       }}
//                     />
//                   ))}
//                   {/* Center burst with rainbow glow */}
//                   <div 
//                     className="w-4 h-4 rounded-full animate-rainbowGlow"
//                     style={{
//                       background: `hsl(${Math.random() * 360}, 80%, 70%)`,
//                     }}
//                   />
//                 </div>
//               </div>
//             );
//           })}
          
//           {/* Celebration text */}
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text animate-bounce">
//               🎉 AMAZING! 🎉
//             </div>
//           </div>

//           {/* Additional twinkling stars */}
//           {[...Array(15)].map((_, i) => (
//             <div
//               key={`star-${i}`}
//               className="absolute animate-starTwinkle"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 animationDelay: `${Math.random() * 3}s`,
//                 fontSize: `${0.5 + Math.random() * 1.5}rem`
//               }}
//             >
//               ⭐
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Header */}
//       <Header />

//       {/* Main Content */}
//       <Container size="4" className="py-16 min-h-[80vh]">
//         <div className="space-y-12 text-center">

//           {/* Status Bar - Made more fun! */}
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
//             <div className="flex items-center justify-center">
//               <div className="flex items-center gap-6">
//                 <span className="text-base font-medium text-gray-600">🎯 Mission Status:</span>
//                 <div className="flex items-center gap-3">
//                   <div className={`w-3 h-3 rounded-full ${isVerified ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
//                   <span className="text-base font-medium text-gray-900">
//                     {isVerified ? '✅ Verified Superstar!' : '⏳ Awaiting Verification'}
//                   </span>
//                 </div>
//                 {mintStatus === "success" && (
//                   <div className="flex items-center gap-3">
//                     <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
//                     <span className="text-base font-medium text-gray-900">🎨 NFT Masterpiece Created!</span>
//                   </div>
//                 )}
//                 {isWalletConnected && walletAddress && (
//                   <div className="flex items-center gap-3">
//                     <span className="text-base text-gray-600">👛 Wallet:</span>
//                     <code className="text-base font-mono bg-gray-100 px-3 py-2 rounded text-gray-800 border border-gray-300">
//                       {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
//                     </code>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* NFT Display Modal */}
//           {showNFTDisplay && (
//             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//               <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-modalSlideIn">
//                 <div className="relative">
//                   {/* Close Button */}
//                   <div className="absolute top-4 right-4 z-10">
//                     <button
//                       onClick={() => {
//                         setShowNFTDisplay(false);
//                         setShowFireworks(false);
//                       }}
//                       className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 cursor-pointer transform hover:scale-110"
//                     >
//                       <span className="text-gray-600 text-base">✕</span>
//                     </button>
//                   </div>
                  
//                   {/* NFT Display Content */}
//                   {currentNFTLoading ? (
//                     <div className="p-16 text-center">
//                       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
//                       <h3 className="text-xl font-semibold text-gray-900 mb-4">🔍 Hunting Down Your NFT...</h3>
//                       <p className="text-base text-gray-600">Scanning the blockchain for your digital treasure! 💎</p>
//                     </div>
//                   ) : currentNFTData?.display?.data ? (
//                     <DisplayNFT
//                       walrusUrl={currentNFTData.display.data.image_url}
//                       nftName={currentNFTData.display.data.name}
//                       nftDescription={currentNFTData.display.data.description}
//                       nftUuid={currentNFTData.display.data.uuid}
//                       nftOwner={currentNFTData.display.data.owner}
//                       nftCreator={currentNFTData.display.data.creator}
//                       projectUrl={currentNFTData.display.data.project_url}
//                       nftId={currentNFTData.objectId}
//                     />
//                   ) : (
//                     <div className="p-16 text-center">
//                       <div className="text-6xl mb-6">🕵️‍♂️</div>
//                       <h3 className="text-xl font-semibold text-gray-900 mb-4">Oops! NFT Playing Hide and Seek</h3>
//                       <p className="text-base text-gray-600 mb-8">Seems like your NFT is being a bit shy! Let's try to coax it out of hiding.</p>
//                       <button
//                         onClick={() => window.location.reload()}
//                         className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-lg transition-colors duration-200 cursor-pointer transform hover:scale-105"
//                       >
//                         <span>🔄</span>
//                         Refresh the Magic Portal
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* NFT Minting Section */}
//           {isVerified && (
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//               <div className="p-8 border-b border-gray-200 text-center">
//                 <h2 className="text-2xl font-semibold text-gray-900 mb-2">
//                   🎉 Congrats! You're Ready to Mint Your Epic NFT! 🎉
//                 </h2>
//                 <p className="text-base text-gray-600 leading-relaxed">
//                   Your identity has been verified with flying colors! Time to create your unique digital masterpiece on Sui! ✨
//                 </p>
//               </div>

//               <div className="p-8 text-center">
//                 {!isWalletConnected ? (
//                   <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
//                     <p className="text-red-800 text-base font-medium text-center">
//                       🚨 Hold up, digital artist! Please connect your Sui wallet to start the minting magic! 👛✨
//                     </p>
//                   </div>
//                 ) : mintStatus === "success" ? (
//                   <div className="space-y-6">
//                     <div className="bg-green-50 border border-green-200 rounded-lg p-6">
//                       <p className="text-green-800 text-base font-medium text-center">
//                         🎊 BOOM! Your NFT has been born on the Sui blockchain! Welcome to the digital art world! 🎨🚀
//                       </p>
//                     </div>
//                     {txDigest && (
//                       <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
//                         <p className="text-blue-900 text-base font-medium mb-4">📋 Your NFT's Birth Certificate:</p>
//                         <a
//                           href={`https://suiscan.xyz/testnet/tx/${txDigest}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="inline-block bg-blue-100 hover:bg-blue-200 px-4 py-3 rounded-lg text-blue-900 font-mono text-base transition-colors duration-200 border border-blue-300 cursor-pointer transform hover:scale-105"
//                         >
//                           {txDigest.slice(0, 8)}...{txDigest.slice(-8)}
//                         </a>
//                         <p className="text-blue-700 text-sm mt-3">
//                           Click to see your NFT's official record on SuiScan! 🔍
//                         </p>
//                       </div>
//                     )}
//                     <div className="flex justify-center">
//                       <button
//                         onClick={handleDisplayNFT}
//                         disabled={showFireworks}
//                         className={`inline-flex items-center gap-3 px-6 py-3 text-base font-medium rounded-lg transition-colors duration-200 transform hover:scale-105 ${
//                           showFireworks 
//                             ? "bg-yellow-500 text-white animate-pulse cursor-wait" 
//                             : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
//                         }`}
//                       >
//                         <span>{showFireworks ? "🎆" : "🖼️"}</span>
//                         {showFireworks ? "Preparing the Show..." : "Admire Your Masterpiece!"}
//                       </button>
//                     </div>
//                   </div>
//                 ) : mintStatus === "error" ? (
//                   <div className="space-y-6">
//                     <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//                       <p className="text-red-800 text-base font-medium text-center">
//                         😅 Oops! The minting magic fizzled out. Don't worry, even wizards need a second try sometimes! ✨
//                       </p>
//                     </div>
//                     <div className="flex justify-center gap-4">
//                       <button
//                         onClick={handleMintNFT}
//                         className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-lg transition-colors duration-200 cursor-pointer transform hover:scale-105"
//                       >
//                         <span>🎭</span>
//                         Cast the Spell Again!
//                       </button>
//                       <button
//                         onClick={handleStartOver}
//                         className="inline-flex items-center gap-3 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white text-base font-medium rounded-lg transition-colors duration-200 cursor-pointer transform hover:scale-105"
//                       >
//                         <span>🔄</span>
//                         Fresh Start Adventure
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="space-y-8">
//                     {walletAddress && (
//                       <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
//                         <div className="flex items-center justify-center gap-4">
//                           <span className="text-blue-900 text-base font-medium">🤝 Your Wallet is Ready:</span>
//                           <code className="text-blue-900 font-mono text-base bg-blue-100 px-3 py-2 rounded border border-blue-300">
//                             {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
//                           </code>
//                         </div>
//                       </div>
//                     )}
//                     <div className="flex justify-center gap-4">
//                       <button
//                         onClick={handleMintNFT}
//                         disabled={isMinting}
//                         className={`inline-flex items-center gap-3 px-8 py-4 text-base font-medium rounded-lg transition-colors duration-200 transform hover:scale-105 ${
//                           isMinting
//                             ? "bg-gray-300 cursor-not-allowed text-gray-500"
//                             : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
//                         }`}
//                       >
//                         {isMinting ? (
//                           <>
//                             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
//                             🎨 Creating Your Digital Art...
//                           </>
//                         ) : (
//                           <>
//                             <span>🚀</span>
//                             Launch My NFT to the Moon!
//                           </>
//                         )}
//                       </button>
//                       <button
//                         onClick={handleStartOver}
//                         className="inline-flex items-center gap-3 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white text-base font-medium rounded-lg transition-colors duration-200 cursor-pointer transform hover:scale-105"
//                       >
//                         <span>🎬</span>
//                         Take Two!
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Face Detection Component */}
//           {!isVerified && !showNFTDisplay && (
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//               <FaceDetection
//                 onVerificationComplete={handleVerificationComplete}
//                 onVerificationReset={handleVerificationReset}
//               />
//             </div>
//           )}
//         </div>
//       </Container>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// }

// export default App;
import { Container } from "@radix-ui/themes";
import { useState } from "react";
import { FaceDetection } from "./Components/FaceDetection";
import { useSuiNFTMinting } from "./hooks/useSuiNFTMinting";
import { useNFTQuery } from "./hooks/useNFTQuery";
import DisplayNFT from "./Components/DisplayNFT";
import { Footer } from "./Components/Footer";
import { Header } from "./Components/Header";
// Import the animations CSS and retro styling
import "./styles/animations.css";
import "./styles/retro-2000s.css";

function App() {
  const [isVerified, setIsVerified] = useState(false);
  const [showNFTDisplay, setShowNFTDisplay] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const {
    isMinting,
    mintStatus,
    txDigest,
    isWalletConnected,
    walletAddress,
    mintNFT,
    resetMinting,
  } = useSuiNFTMinting();

  // Query NFT data for the current minted NFT
  const { parsedData: currentNFTData, isLoading: currentNFTLoading } = useNFTQuery({ 
    txDigest: txDigest,
    enabled: !!txDigest 
  });

  const handleVerificationComplete = () => {
    setIsVerified(true);
    setShowNFTDisplay(false);
    resetMinting();
  };

  const handleVerificationReset = () => {
    setIsVerified(false);
    setShowNFTDisplay(false);
    resetMinting();
  };

  const handleDisplayNFT = () => {
    // Start fireworks celebration!
    setShowFireworks(true);
    
    // Show NFT after a short delay to let fireworks play
    setTimeout(() => {
      setShowNFTDisplay(true);
      // Stop fireworks after NFT modal opens
      setTimeout(() => {
        setShowFireworks(false);
      }, 2000);
    }, 1000);
  };

  const handleMintNFT = async () => {
    try {
      await mintNFT();
    } catch (error) {
      console.error("Minting error:", error);
      if (error instanceof Error && error.message === "Wallet not connected") {
        alert("Whoa there! 🛑 Please connect your wallet first to join the NFT party!");
      }
    }
  };

  const handleStartOver = () => {
    setIsVerified(false);
    resetMinting();
  };

  return (
    <div className="retro-bg">
      {/* Matrix-style background pattern */}
      <div className="matrix-overlay">
        <div className="matrix-bg"></div>
      </div>

      {/* Retro floating elements */}
      <div className="floating-elements">
        {[...Array(30)].map((_, i) => {
          const shapes = ['★', '●', '◆', '▲'];
          const colors = ['text-neon-green', 'text-neon-pink', 'text-neon-cyan', 'text-neon-yellow'];
          const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          
          return (
            <div
              key={i}
              className={`floating-shape ${randomColor}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              {randomShape}
            </div>
          );
        })}
      </div>

      {/* Fireworks Animation - Enhanced for 2000s style */}
      {showFireworks && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {/* Multiple firework bursts with neon colors */}
          {[...Array(12)].map((_, i) => {
            const colors = ['#ff0080', '#00ff80', '#8000ff', '#ff8000', '#0080ff'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            return (
              <div
                key={i}
                className="firework-burst"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 60 + 20}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              >
                <div className="relative">
                  {[...Array(8)].map((_, j) => (
                    <div
                      key={j}
                      className="firework-sparkle"
                      style={{
                        background: color,
                        boxShadow: `0 0 20px ${color}`,
                        transform: `rotate(${j * 45}deg) translateY(-${30 + Math.random() * 30}px)`,
                        animationDelay: `${Math.random() * 0.5}s`,
                        animationDuration: `${1 + Math.random()}s`
                      }}
                    />
                  ))}
                  <div 
                    className="firework-center"
                    style={{
                      background: color,
                      boxShadow: `0 0 30px ${color}, 0 0 60px ${color}`
                    }}
                  />
                </div>
              </div>
            );
          })}
          
          {/* Retro celebration text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="celebration-text text-neon-green text-3d-effect">
              ◆ AWESOME! ◆
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <Header />

      {/* Main Content */}
      <Container size="4" className="py-8 min-h-[80vh] relative z-10">
        <div className="space-y-8 text-center">

          {/* Status Bar - 2000s Retro Style */}
          <div className="retro-card retro-hover-float">
            <div className="retro-card-inner p-6">
              <div className="flex items-center justify-center flex-wrap gap-4">
                <span className="retro-text text-xl text-neon-green">
                  ◆ MISSION STATUS ◆
                </span>
                <div className="flex items-center gap-3">
                  <div className={`status-dot ${isVerified ? 'status-dot-verified' : 'status-dot-pending'}`}></div>
                  <span className={`retro-text text-lg ${isVerified ? 'text-neon-green' : 'text-neon-orange'}`}>
                    {isVerified ? '✅ VERIFIED SUPERSTAR!' : '⏳ AWAITING VERIFICATION'}
                  </span>
                </div>
                {mintStatus === "success" && (
                  <div className="flex items-center gap-3">
                    <div className="status-dot status-dot-success"></div>
                    <span className="retro-text text-lg text-neon-cyan">
                      🎨 NFT MASTERPIECE CREATED!
                    </span>
                  </div>
                )}
                {isWalletConnected && walletAddress && (
                  <div className="flex items-center gap-3">
                    <span className="retro-text text-lg text-neon-yellow">
                      👛 WALLET:
                    </span>
                    <code className="retro-code retro-mono text-lg px-3 py-2 rounded">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </code>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* NFT Display Modal - Retro Style */}
          {showNFTDisplay && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="retro-modal max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="retro-modal-content">
                  {/* Close Button - Retro Style */}
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={() => {
                        setShowNFTDisplay(false);
                        setShowFireworks(false);
                      }}
                      className="retro-close-btn"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {/* NFT Display Content */}
                  {currentNFTLoading ? (
                    <div className="p-16 text-center">
                      <div className="retro-spinner h-20 w-20 mx-auto mb-8"></div>
                      <h3 className="retro-title text-3xl text-neon-cyan mb-4">
                        🔍 HUNTING DOWN YOUR NFT...
                      </h3>
                      <p className="retro-text text-xl text-neon-yellow">
                        SCANNING THE BLOCKCHAIN FOR YOUR DIGITAL TREASURE! 💎
                      </p>
                    </div>
                  ) : currentNFTData?.display?.data ? (
                    <DisplayNFT
                      walrusUrl={currentNFTData.display.data.image_url}
                      nftName={currentNFTData.display.data.name}
                      nftDescription={currentNFTData.display.data.description}
                      nftUuid={currentNFTData.display.data.uuid}
                      nftOwner={currentNFTData.display.data.owner}
                      nftCreator={currentNFTData.display.data.creator}
                      projectUrl={currentNFTData.display.data.project_url}
                      nftId={currentNFTData.objectId}
                    />
                  ) : (
                    <div className="p-16 text-center">
                      <div className="text-9xl mb-8 animate-bounce">🕵️‍♂️</div>
                      <h3 className="retro-title text-3xl text-neon-pink mb-4">
                        OOPS! NFT PLAYING HIDE AND SEEK
                      </h3>
                      <p className="retro-text text-xl text-neon-yellow mb-8">
                        SEEMS LIKE YOUR NFT IS BEING A BIT SHY! LET'S COAX IT OUT!
                      </p>
                      <button
                        onClick={() => window.location.reload()}
                        className="retro-btn retro-btn-success"
                      >
                        🔄 REFRESH THE MAGIC PORTAL
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* NFT Minting Section - Ultra Retro */}
          {isVerified && (
            <div className="retro-card retro-hover-float">
              <div className="retro-card-header p-6 text-center">
                <h2 className="retro-title text-4xl text-neon-green text-3d-effect mb-4 animate-retro-pulse">
                  ◆ CONGRATS! READY TO MINT YOUR EPIC NFT! ◆
                </h2>
                <p className="retro-text text-xl text-neon-yellow">
                  YOUR IDENTITY HAS BEEN VERIFIED! TIME TO CREATE YOUR DIGITAL MASTERPIECE! ✨
                </p>
              </div>

              <div className="retro-card-inner p-8 text-center">
                {!isWalletConnected ? (
                  <div className="retro-alert retro-alert-error">
                    <p className="retro-text text-xl">
                      🚨 HOLD UP, DIGITAL ARTIST! CONNECT YOUR SUI WALLET! 👛✨
                    </p>
                  </div>
                ) : mintStatus === "success" ? (
                  <div className="space-y-6">
                    <div className="retro-alert retro-alert-success">
                      <p className="retro-text text-xl">
                        🎊 BOOM! YOUR NFT HAS BEEN BORN ON THE SUI BLOCKCHAIN! 🎨🚀
                      </p>
                    </div>
                    {txDigest && (
                      <div className="retro-alert retro-alert-info">
                        <p className="retro-text text-xl mb-4">
                          📋 YOUR NFT'S BIRTH CERTIFICATE:
                        </p>
                        <a
                          href={`https://suiscan.xyz/testnet/tx/${txDigest}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="retro-code retro-mono text-lg px-6 py-4 rounded inline-block hover:animate-retro-pulse"
                        >
                          {txDigest.slice(0, 8)}...{txDigest.slice(-8)}
                        </a>
                        <p className="retro-text text-lg mt-4 text-neon-yellow">
                          CLICK TO SEE YOUR NFT'S OFFICIAL RECORD! 🔍
                        </p>
                      </div>
                    )}
                    <div className="flex justify-center">
                      <button
                        onClick={handleDisplayNFT}
                        disabled={showFireworks}
                        className={`retro-btn retro-btn-xl ${
                          showFireworks 
                            ? "retro-btn-warning animate-spin" 
                            : "retro-btn-primary"
                        }`}
                      >
                        {showFireworks ? "🎆 PREPARING THE SHOW..." : "🖼️ ADMIRE YOUR MASTERPIECE!"}
                      </button>
                    </div>
                  </div>
                ) : mintStatus === "error" ? (
                  <div className="space-y-6">
                    <div className="retro-alert retro-alert-error">
                      <p className="retro-text text-xl">
                        😅 OOPS! THE MINTING MAGIC FIZZLED OUT! TRY AGAIN! ✨
                      </p>
                    </div>
                    <div className="flex justify-center gap-4 flex-wrap">
                      <button
                        onClick={handleMintNFT}
                        className="retro-btn retro-btn-primary"
                      >
                        🎭 CAST THE SPELL AGAIN!
                      </button>
                      <button
                        onClick={handleStartOver}
                        className="retro-btn retro-btn-secondary"
                      >
                        🔄 FRESH START ADVENTURE
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {walletAddress && (
                      <div className="retro-alert retro-alert-info">
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                          <span className="retro-text text-xl text-neon-cyan">
                            🤝 YOUR WALLET IS READY:
                          </span>
                          <code className="retro-code retro-mono text-xl px-4 py-3 rounded">
                            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                          </code>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-center gap-4 flex-wrap">
                      <button
                        onClick={handleMintNFT}
                        disabled={isMinting}
                        className={`retro-btn retro-btn-xl ${
                          isMinting
                            ? "retro-btn-disabled"
                            : "retro-btn-primary"
                        }`}
                      >
                        {isMinting ? (
                          <>
                            <span className="animate-spin inline-block mr-3">⚡</span>
                            🎨 CREATING YOUR DIGITAL ART...
                          </>
                        ) : (
                          <>
                            🚀 LAUNCH MY NFT TO THE MOON!
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleStartOver}
                        className="retro-btn retro-btn-secondary"
                      >
                        🎬 TAKE TWO!
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Face Detection Component - Retro Container */}
          {!isVerified && !showNFTDisplay && (
            <div className="retro-card retro-hover-float overflow-hidden">
              <div className="retro-card-inner">
                <FaceDetection
                  onVerificationComplete={handleVerificationComplete}
                  onVerificationReset={handleVerificationReset}
                />
              </div>
            </div>
          )}
        </div>
      </Container>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;