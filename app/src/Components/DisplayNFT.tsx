// import React, { useState, useEffect } from 'react';

// interface DisplayNFTProps {
//   walrusUrl?: string;
//   nftName?: string;
//   nftDescription?: string;
//   nftUuid?: string;
//   nftOwner?: string;
//   nftCreator?: string;
//   projectUrl?: string;
//   nftId?: string;
// }

// const DisplayNFT: React.FC<DisplayNFTProps> = ({ 
//   walrusUrl,
//   nftName,
//   nftDescription,
//   nftUuid,
//   nftOwner,
//   nftCreator,
//   projectUrl,
//   nftId
// }) => {
//   const [imageUrl, setImageUrl] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // console.log("🖼️ DisplayNFT - Received Walrus URL:", walrusUrl);
//   // console.log("🖼️ DisplayNFT - NFT Name:", nftName);

//   useEffect(() => {
//     // Reset states when walrusUrl changes
//     setImageUrl(null);
//     setError(null);

//     if (!walrusUrl) {
//       setLoading(false);
//       return;
//     }

//     let objectUrl: string | null = null;
//     let isCancelled = false;

//     const loadImage = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         // console.log("📡 Fetching image from Walrus:", walrusUrl);
//         const response = await fetch(walrusUrl);
        
//         if (!response.ok) {
//           throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
//         }
        
//         const blob = await response.blob();
        
//         // Check if component was unmounted or walrusUrl changed
//         if (isCancelled) {
//           // console.log("🚫 Load cancelled");
//           return;
//         }
        
//         // console.log("📦 Blob received, size:", blob.size, "type:", blob.type);
        
//         objectUrl = URL.createObjectURL(blob);
//         setImageUrl(objectUrl);
//         // console.log("✅ Image object URL created successfully");
        
//       } catch (error) {
//         if (!isCancelled) {
//           // console.error('❌ Failed to load Walrus image:', error);
//           setError(error instanceof Error ? error.message : 'Failed to load image');
//         }
//       } finally {
//         if (!isCancelled) {
//           setLoading(false);
//         }
//       }
//     };

//     loadImage();
    
//     // Cleanup function
//     return () => {
//       isCancelled = true;
//       if (objectUrl) {
//         // console.log("🧹 Cleaning up object URL");
//         URL.revokeObjectURL(objectUrl);
//       }
//     };
//   }, [walrusUrl]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (imageUrl) {
//         // console.log("🧹 Final cleanup on unmount"); 
//         URL.revokeObjectURL(imageUrl);
//       }
//     };
//   }, [imageUrl]);

//   // Handle no Walrus URL
//   if (!walrusUrl) {
//     return (
//       <div className="flex items-center justify-center min-h-[500px]">
//         <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center">
//           <div className="text-5xl mb-6">⚠️</div>
//           <h3 className="text-xl font-semibold text-gray-900 mb-4">No Image Available</h3>
//           <p className="text-gray-600 text-base">No image URL provided for this NFT</p>
//         </div>
//       </div>
//     );
//   }

//   // Handle image loading state
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[500px]">
//         <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center">
//           <div className="text-5xl mb-6">🖼️</div>
//           <h3 className="text-xl font-semibold text-gray-900 mb-6">
//             {nftName || 'Loading NFT...'}
//           </h3>
//           <div className="flex items-center justify-center p-6 bg-blue-50 rounded-lg border border-blue-200">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
//               <span className="text-blue-800 font-medium text-base">Loading image from Walrus...</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Handle image error
//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-[500px]">
//         <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center">
//           <div className="text-5xl mb-6">❌</div>
//           <h3 className="text-xl font-semibold text-gray-900 mb-6">
//             {nftName || 'NFT Image Error'}
//           </h3>
//           <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
//             <p className="text-red-800 font-medium text-base mb-3">Failed to load image</p>
//             <p className="text-red-600 text-sm mb-4">{error}</p>
//             <div className="text-sm text-gray-500 mb-4 break-all">
//               Walrus URL: {walrusUrl}
//             </div>
//             <button
//               onClick={() => window.location.reload()}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-base font-medium rounded-lg transition-colors duration-200 cursor-pointer"
//             >
//               <span>🔄</span>
//               Retry Loading
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-center min-h-[600px] p-6">
//       <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//         {/* Header */}
//         <div className="bg-blue-50 px-8 py-6 border-b border-gray-200 text-center">
//           <div className="text-3xl mb-3">🎨</div>
//           <h3 className="text-xl font-semibold text-blue-900">
//             {nftName || 'Sui Face Passport NFT'}
//           </h3>
//         </div>

//         <div className="p-8 space-y-8">
//           {/* Main Image */}
//           {imageUrl && (
//             <div className="text-center">
//               <div className="inline-block p-4 bg-gray-50 rounded-lg border border-gray-200">
//                 <img 
//                   src={imageUrl} 
//                   alt={nftName || "Face Passport from Walrus"} 
//                   className="max-w-full mx-auto rounded-lg shadow-sm border border-gray-200"
//                   style={{ maxHeight: '350px', maxWidth: '350px', objectFit: 'contain' }}
//                   onLoad={() => console.log("🖼️ Image successfully rendered")}
//                   onError={() => setError("Failed to render image")}
//                 />
//               </div>
//             </div>
//           )}

//           {/* NFT Description */}
//           {nftDescription && (
//             <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
//               <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center justify-center gap-2">
//                 <span>📝</span>
//                 Description
//               </h4>
//               <p className="text-gray-700 text-base leading-relaxed">{nftDescription}</p>
//             </div>
//           )}

//           {/* NFT Details Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* UUID */}
//             {nftUuid && (
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
//                 <h4 className="text-base font-semibold text-blue-900 mb-3 flex items-center justify-center gap-2">
//                   <span>🔑</span>
//                   Unique ID
//                 </h4>
//                 <code className="bg-blue-100 px-3 py-2 rounded-lg text-blue-900 font-mono text-sm border border-blue-300 block text-center">
//                   {nftUuid}
//                 </code>
//               </div>
//             )}

//             {/* Owner */}
//             {nftOwner && (
//               <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
//                 <h4 className="text-base font-semibold text-green-900 mb-3 flex items-center justify-center gap-2">
//                   <span>👤</span>
//                   Owner
//                 </h4>
//                 <code className="bg-green-100 px-3 py-2 rounded-lg text-green-900 font-mono text-sm border border-green-300 block text-center break-all">
//                   {nftOwner.slice(0, 6)}...{nftOwner.slice(-4)}
//                 </code>
//                 <div className="mt-2 text-center">
//                   <span className="text-green-700 text-xs">Full: {nftOwner}</span>
//                 </div>
//               </div>
//             )}

//             {/* Creator */}
//             {nftCreator && (
//               <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
//                 <h4 className="text-base font-semibold text-purple-900 mb-3 flex items-center justify-center gap-2">
//                   <span>🎭</span>
//                   Creator
//                 </h4>
//                 <code className="bg-purple-100 px-3 py-2 rounded-lg text-purple-900 font-mono text-sm border border-purple-300 block text-center break-all">
//                   {nftCreator.slice(0, 6)}...{nftCreator.slice(-4)}
//                 </code>
//                 <div className="mt-2 text-center">
//                   <span className="text-purple-700 text-xs">Full: {nftCreator}</span>
//                 </div>
//               </div>
//             )}

//             {/* Project URL */}
//             {projectUrl && (
//               <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 text-center">
//                 <h4 className="text-base font-semibold text-indigo-900 mb-3 flex items-center justify-center gap-2">
//                   <span>🌐</span>
//                   Project
//                 </h4>
//                 <a 
//                   href={projectUrl} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="inline-flex items-center gap-2 w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-medium rounded-lg transition-colors duration-200 cursor-pointer justify-center"
//                 >
//                   <span>🔗</span>
//                   Visit Project
//                 </a>
//               </div>
//             )}
//           </div>

//           {/* Technical Information */}
//           <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
//             <h4 className="text-base font-semibold text-gray-900 mb-4 text-center flex items-center justify-center gap-2">
//               <span>⚙️</span>
//               Technical Details
//             </h4>
            
//             <div className="space-y-4 text-center">
//               <div className="flex flex-col items-center">
//                 <span className="font-medium text-gray-700 text-base">Storage:</span>
//                 <span className="text-gray-600 text-base">Walrus Protocol</span>
//               </div>
              
//               {nftId && (
//                 <div className="flex flex-col items-center">
//                   <span className="font-medium text-gray-700 text-base mb-2">NFT ID:</span>
//                   <a
//                     href={`https://suiscan.xyz/testnet/object/${nftId}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-block bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-lg text-blue-900 font-mono text-sm transition-colors duration-200 border border-blue-300 cursor-pointer break-all text-center max-w-full"
//                   >
//                     {nftId.slice(0, 12)}...{nftId.slice(-8)}
//                   </a>
//                   <p className="text-blue-700 text-xs mt-2">
//                     Click above to view on SuiScan
//                   </p>
//                 </div>
//               )}
              
//               <div className="flex flex-col items-center">
//                 <span className="font-medium text-gray-700 text-base">Walrus URL:</span>
//                 <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono text-gray-600 break-all text-center max-w-full">
//                   {walrusUrl.slice(0, 30)}...{walrusUrl.slice(-15)}
//                 </code>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DisplayNFT;

import React, { useState, useEffect } from 'react';

interface DisplayNFTProps {
  walrusUrl?: string;
  nftName?: string;
  nftDescription?: string;
  nftUuid?: string;
  nftOwner?: string;
  nftCreator?: string;
  projectUrl?: string;
  nftId?: string;
}

const DisplayNFT: React.FC<DisplayNFTProps> = ({ 
  walrusUrl,
  nftName,
  nftDescription,
  nftUuid,
  nftOwner,
  nftCreator,
  projectUrl,
  nftId
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset states when walrusUrl changes
    setImageUrl(null);
    setError(null);

    if (!walrusUrl) {
      setLoading(false);
      return;
    }

    let objectUrl: string | null = null;
    let isCancelled = false;

    const loadImage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(walrusUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }
        
        const blob = await response.blob();
        
        // Check if component was unmounted or walrusUrl changed
        if (isCancelled) {
          return;
        }
        
        objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
        
      } catch (error) {
        if (!isCancelled) {
          setError(error instanceof Error ? error.message : 'Failed to load image');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadImage();
    
    // Cleanup function
    return () => {
      isCancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [walrusUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  // Handle no Walrus URL - Retro Style
  if (!walrusUrl) {
    return (
      <div className="flex items-center justify-center min-h-[500px] p-6">
        <div className="retro-card retro-hover-float max-w-xl mx-auto">
          <div className="retro-card-inner p-12 text-center">
            <div className="text-8xl mb-8 animate-bounce">⚠️</div>
            <h3 className="retro-title text-3xl text-neon-pink mb-6">
              NO IMAGE AVAILABLE
            </h3>
            <p className="retro-text text-xl text-neon-cyan">
              NO IMAGE URL PROVIDED FOR THIS NFT
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Handle image loading state - Retro Style
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px] p-6">
        <div className="retro-card retro-hover-float max-w-xl mx-auto">
          <div className="retro-card-inner p-12 text-center">
            <div className="text-8xl mb-8 animate-bounce">🖼️</div>
            <h3 className="retro-title text-3xl text-neon-green mb-8">
              {nftName?.toUpperCase() || 'LOADING NFT...'}
            </h3>
            <div className="retro-alert retro-alert-info">
              <div className="flex items-center justify-center mb-6">
                <div className="retro-spinner h-16 w-16"></div>
              </div>
              <span className="retro-text text-xl text-neon-cyan">
                LOADING IMAGE FROM WALRUS...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle image error - Retro Style
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[500px] p-6">
        <div className="retro-card retro-hover-float max-w-xl mx-auto">
          <div className="retro-card-inner p-12 text-center">
            <div className="text-8xl mb-8 animate-bounce">❌</div>
            <h3 className="retro-title text-3xl text-neon-pink mb-8">
              {nftName?.toUpperCase() || 'NFT IMAGE ERROR'}
            </h3>
            <div className="retro-alert retro-alert-error mb-8">
              <p className="retro-text text-xl mb-4">FAILED TO LOAD IMAGE</p>
              <p className="retro-text text-lg mb-6 text-neon-yellow">{error}</p>
              <div className="retro-code retro-mono text-sm mb-6 p-3 rounded break-all">
                WALRUS URL: {walrusUrl}
              </div>
              <button
                onClick={() => window.location.reload()}
                className="retro-btn retro-btn-danger"
              >
                <span>🔄</span>
                RETRY LOADING
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[600px] p-6">
      <div className="retro-card retro-hover-float max-w-4xl mx-auto overflow-hidden">
        {/* Header - Ultra Retro */}
        <div className="retro-card-header p-8 text-center">
          <div className="text-6xl mb-6 animate-bounce">🎨</div>
          <h3 className="retro-title text-4xl text-neon-green text-3d-effect animate-retro-pulse">
            {nftName?.toUpperCase() || 'SUI FACE PASSPORT NFT'}
          </h3>
          <div className="mt-4 flex justify-center">
            {['◆', '★', '●', '▲', '●', '★', '◆'].map((shape, index) => (
              <span
                key={index}
                className="text-2xl mx-2 animate-pulse"
                style={{
                  color: ['#ff00ff', '#00ffff', '#ffff00', '#00ff00'][index % 4],
                  textShadow: `0 0 10px ${['#ff00ff', '#00ffff', '#ffff00', '#00ff00'][index % 4]}`,
                  animationDelay: `${index * 0.2}s`
                }}
              >
                {shape}
              </span>
            ))}
          </div>
        </div>

        <div className="retro-card-inner p-8 space-y-8">
          {/* Main Image - Retro Display */}
          {imageUrl && (
            <div className="text-center">
              <div 
                className="inline-block p-6 rounded-lg border-4 retro-hover-float"
                style={{
                  background: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)',
                  border: '4px solid #00ff00',
                  boxShadow: '0 0 30px rgba(0, 255, 0, 0.8), inset 0 0 30px rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="bg-black/80 p-4 rounded border-2 border-cyan-400">
                  <img 
                    src={imageUrl} 
                    alt={nftName || "Face Passport from Walrus"} 
                    className="max-w-full mx-auto rounded border-2 border-neon-cyan"
                    style={{ 
                      maxHeight: '350px', 
                      maxWidth: '350px', 
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 0 20px #00ffff)'
                    }}
                    onLoad={() => console.log("🖼️ Image successfully rendered")}
                    onError={() => setError("Failed to render image")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* NFT Description - Retro Alert */}
          {nftDescription && (
            <div className="retro-alert retro-alert-info text-center">
              <h4 className="retro-title text-2xl text-neon-cyan mb-4 flex items-center justify-center gap-3">
                <span>📝</span>
                DESCRIPTION
              </h4>
              <p className="retro-text text-lg text-neon-yellow leading-relaxed">
                {nftDescription.toUpperCase()}
              </p>
            </div>
          )}

          {/* NFT Details Grid - Retro Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* UUID */}
            {nftUuid && (
              <div 
                className="retro-card-inner p-6 rounded-lg border-4 text-center retro-hover-float"
                style={{
                  background: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
                  border: '4px solid #00ffff',
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.7)'
                }}
              >
                <h4 className="retro-title text-xl text-neon-cyan mb-4 flex items-center justify-center gap-3">
                  <span>🔑</span>
                  UNIQUE ID
                </h4>
                <code className="retro-code retro-mono text-lg px-4 py-3 rounded-lg block text-center">
                  {nftUuid}
                </code>
              </div>
            )}

            {/* Owner */}
            {nftOwner && (
              <div 
                className="retro-card-inner p-6 rounded-lg border-4 text-center retro-hover-float"
                style={{
                  background: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
                  border: '4px solid #00ff00',
                  boxShadow: '0 0 20px rgba(0, 255, 0, 0.7)'
                }}
              >
                <h4 className="retro-title text-xl text-neon-green mb-4 flex items-center justify-center gap-3">
                  <span>👤</span>
                  OWNER
                </h4>
                <code className="retro-code retro-mono text-lg px-4 py-3 rounded-lg block text-center break-all mb-3">
                  {nftOwner.slice(0, 6)}...{nftOwner.slice(-4)}
                </code>
                <div className="text-center">
                  <span className="retro-text text-sm text-neon-yellow">
                    FULL: {nftOwner}
                  </span>
                </div>
              </div>
            )}

            {/* Creator */}
            {nftCreator && (
              <div 
                className="retro-card-inner p-6 rounded-lg border-4 text-center retro-hover-float"
                style={{
                  background: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
                  border: '4px solid #ff00ff',
                  boxShadow: '0 0 20px rgba(255, 0, 255, 0.7)'
                }}
              >
                <h4 className="retro-title text-xl text-neon-pink mb-4 flex items-center justify-center gap-3">
                  <span>🎭</span>
                  CREATOR
                </h4>
                <code className="retro-code retro-mono text-lg px-4 py-3 rounded-lg block text-center break-all mb-3">
                  {nftCreator.slice(0, 6)}...{nftCreator.slice(-4)}
                </code>
                <div className="text-center">
                  <span className="retro-text text-sm text-neon-yellow">
                    FULL: {nftCreator}
                  </span>
                </div>
              </div>
            )}

            {/* Project URL */}
            {projectUrl && (
              <div 
                className="retro-card-inner p-6 rounded-lg border-4 text-center retro-hover-float"
                style={{
                  background: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
                  border: '4px solid #ffff00',
                  boxShadow: '0 0 20px rgba(255, 255, 0, 0.7)'
                }}
              >
                <h4 className="retro-title text-xl text-neon-yellow mb-4 flex items-center justify-center gap-3">
                  <span>🌐</span>
                  PROJECT
                </h4>
                <a 
                  href={projectUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="retro-btn retro-btn-primary w-full"
                >
                  <span>🔗</span>
                  VISIT PROJECT
                </a>
              </div>
            )}
          </div>

          {/* Technical Information - Ultra Retro */}
          <div className="retro-card retro-hover-float">
            <div className="retro-card-inner p-8">
              <h4 className="retro-title text-3xl text-neon-green text-center mb-8 flex items-center justify-center gap-4">
                <span>⚙️</span>
                TECHNICAL DETAILS
                <span>⚙️</span>
              </h4>
              
              <div className="space-y-6">
                <div className="text-center">
                  <div 
                    className="inline-block px-6 py-3 rounded-lg border-2 mb-4"
                    style={{
                      background: 'rgba(0, 255, 255, 0.1)',
                      border: '2px solid #00ffff',
                      boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)'
                    }}
                  >
                    <span className="retro-title text-xl text-neon-cyan">STORAGE:</span>
                    <span className="retro-text text-xl text-neon-yellow ml-3">WALRUS PROTOCOL</span>
                  </div>
                </div>
                
                {nftId && (
                  <div className="text-center">
                    <span className="retro-title text-xl text-neon-pink mb-4 block">NFT ID:</span>
                    <a
                      href={`https://suiscan.xyz/testnet/object/${nftId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="retro-code retro-mono text-lg px-4 py-3 rounded-lg inline-block hover:animate-retro-pulse break-all max-w-full mb-4"
                    >
                      {nftId.slice(0, 12)}...{nftId.slice(-8)}
                    </a>
                    <p className="retro-text text-sm text-neon-yellow">
                      CLICK ABOVE TO VIEW ON SUISCAN
                    </p>
                  </div>
                )}
                
                <div className="text-center">
                  <span className="retro-title text-xl text-neon-green mb-4 block">WALRUS URL:</span>
                  <div 
                    className="inline-block px-4 py-3 rounded-lg border-2 max-w-full"
                    style={{
                      background: 'rgba(0, 0, 0, 0.7)',
                      border: '2px solid #666',
                      boxShadow: '0 0 10px rgba(102, 102, 102, 0.5)'
                    }}
                  >
                    <code className="retro-mono text-sm text-neon-cyan break-all">
                      {walrusUrl.slice(0, 30)}...{walrusUrl.slice(-15)}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Celebration */}
          <div className="text-center pt-6">
            <div className="retro-title text-2xl text-neon-green text-3d-effect animate-retro-pulse">
              ◆ YOUR DIGITAL MASTERPIECE AWAITS ◆
            </div>
            <div className="mt-4 flex justify-center gap-2">
              {['🎨', '🚀', '💎', '✨', '🌟', '🎭', '🔥'].map((emoji, index) => (
                <span
                  key={index}
                  className="text-3xl animate-bounce"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayNFT;