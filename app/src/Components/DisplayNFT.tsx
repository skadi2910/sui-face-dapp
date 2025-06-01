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

  // console.log("🖼️ DisplayNFT - Received Walrus URL:", walrusUrl);
  // console.log("🖼️ DisplayNFT - NFT Name:", nftName);

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
        
        // console.log("📡 Fetching image from Walrus:", walrusUrl);
        const response = await fetch(walrusUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }
        
        const blob = await response.blob();
        
        // Check if component was unmounted or walrusUrl changed
        if (isCancelled) {
          // console.log("🚫 Load cancelled");
          return;
        }
        
        // console.log("📦 Blob received, size:", blob.size, "type:", blob.type);
        
        objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
        // console.log("✅ Image object URL created successfully");
        
      } catch (error) {
        if (!isCancelled) {
          // console.error('❌ Failed to load Walrus image:', error);
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
        // console.log("🧹 Cleaning up object URL");
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [walrusUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (imageUrl) {
        // console.log("🧹 Final cleanup on unmount"); 
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  // Handle no Walrus URL
  if (!walrusUrl) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center">
          <div className="text-5xl mb-6">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">No Image Available</h3>
          <p className="text-gray-600 text-base">No image URL provided for this NFT</p>
        </div>
      </div>
    );
  }

  // Handle image loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center">
          <div className="text-5xl mb-6">🖼️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {nftName || 'Loading NFT...'}
          </h3>
          <div className="flex items-center justify-center p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <span className="text-blue-800 font-medium text-base">Loading image from Walrus...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle image error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center">
          <div className="text-5xl mb-6">❌</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {nftName || 'NFT Image Error'}
          </h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <p className="text-red-800 font-medium text-base mb-3">Failed to load image</p>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <div className="text-sm text-gray-500 mb-4 break-all">
              Walrus URL: {walrusUrl}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-base font-medium rounded-lg transition-colors duration-200 cursor-pointer"
            >
              <span>🔄</span>
              Retry Loading
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[600px] p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-50 px-8 py-6 border-b border-gray-200 text-center">
          <div className="text-3xl mb-3">🎨</div>
          <h3 className="text-xl font-semibold text-blue-900">
            {nftName || 'Sui Face Passport NFT'}
          </h3>
        </div>

        <div className="p-8 space-y-8">
          {/* Main Image */}
          {imageUrl && (
            <div className="text-center">
              <div className="inline-block p-4 bg-gray-50 rounded-lg border border-gray-200">
                <img 
                  src={imageUrl} 
                  alt={nftName || "Face Passport from Walrus"} 
                  className="max-w-full mx-auto rounded-lg shadow-sm border border-gray-200"
                  style={{ maxHeight: '350px', maxWidth: '350px', objectFit: 'contain' }}
                  onLoad={() => console.log("🖼️ Image successfully rendered")}
                  onError={() => setError("Failed to render image")}
                />
              </div>
            </div>
          )}

          {/* NFT Description */}
          {nftDescription && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center justify-center gap-2">
                <span>📝</span>
                Description
              </h4>
              <p className="text-gray-700 text-base leading-relaxed">{nftDescription}</p>
            </div>
          )}

          {/* NFT Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* UUID */}
            {nftUuid && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <h4 className="text-base font-semibold text-blue-900 mb-3 flex items-center justify-center gap-2">
                  <span>🔑</span>
                  Unique ID
                </h4>
                <code className="bg-blue-100 px-3 py-2 rounded-lg text-blue-900 font-mono text-sm border border-blue-300 block text-center">
                  {nftUuid}
                </code>
              </div>
            )}

            {/* Owner */}
            {nftOwner && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <h4 className="text-base font-semibold text-green-900 mb-3 flex items-center justify-center gap-2">
                  <span>👤</span>
                  Owner
                </h4>
                <code className="bg-green-100 px-3 py-2 rounded-lg text-green-900 font-mono text-sm border border-green-300 block text-center break-all">
                  {nftOwner.slice(0, 6)}...{nftOwner.slice(-4)}
                </code>
                <div className="mt-2 text-center">
                  <span className="text-green-700 text-xs">Full: {nftOwner}</span>
                </div>
              </div>
            )}

            {/* Creator */}
            {nftCreator && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
                <h4 className="text-base font-semibold text-purple-900 mb-3 flex items-center justify-center gap-2">
                  <span>🎭</span>
                  Creator
                </h4>
                <code className="bg-purple-100 px-3 py-2 rounded-lg text-purple-900 font-mono text-sm border border-purple-300 block text-center break-all">
                  {nftCreator.slice(0, 6)}...{nftCreator.slice(-4)}
                </code>
                <div className="mt-2 text-center">
                  <span className="text-purple-700 text-xs">Full: {nftCreator}</span>
                </div>
              </div>
            )}

            {/* Project URL */}
            {projectUrl && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 text-center">
                <h4 className="text-base font-semibold text-indigo-900 mb-3 flex items-center justify-center gap-2">
                  <span>🌐</span>
                  Project
                </h4>
                <a 
                  href={projectUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-medium rounded-lg transition-colors duration-200 cursor-pointer justify-center"
                >
                  <span>🔗</span>
                  Visit Project
                </a>
              </div>
            )}
          </div>

          {/* Technical Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h4 className="text-base font-semibold text-gray-900 mb-4 text-center flex items-center justify-center gap-2">
              <span>⚙️</span>
              Technical Details
            </h4>
            
            <div className="space-y-4 text-center">
              <div className="flex flex-col items-center">
                <span className="font-medium text-gray-700 text-base">Storage:</span>
                <span className="text-gray-600 text-base">Walrus Protocol</span>
              </div>
              
              {nftId && (
                <div className="flex flex-col items-center">
                  <span className="font-medium text-gray-700 text-base mb-2">NFT ID:</span>
                  <a
                    href={`https://suiscan.xyz/testnet/object/${nftId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-lg text-blue-900 font-mono text-sm transition-colors duration-200 border border-blue-300 cursor-pointer break-all text-center max-w-full"
                  >
                    {nftId.slice(0, 12)}...{nftId.slice(-8)}
                  </a>
                  <p className="text-blue-700 text-xs mt-2">
                    Click above to view on SuiScan
                  </p>
                </div>
              )}
              
              <div className="flex flex-col items-center">
                <span className="font-medium text-gray-700 text-base">Walrus URL:</span>
                <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono text-gray-600 break-all text-center max-w-full">
                  {walrusUrl.slice(0, 30)}...{walrusUrl.slice(-15)}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayNFT;