// import { useNFTQuery } from "./hooks/useNFTQuery";

// interface NFTDataLoggerProps {
//   nftId?: string | null;
//   txDigest?: string | null;
// }

// export function NFTDataLogger({ nftId, txDigest }: NFTDataLoggerProps) {
//   const { 
//     parsedData, 
//     isLoading, 
//     error, 
//     hasData, 
//     hasFields, 
//     hasDisplay,
//     nftId: finalNFTId,
//   } = useNFTQuery({ txDigest });
//   if (!nftId && !txDigest) {
//     return (
//       <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
//         <p className="text-black">No NFT ID or transaction digest provided</p>
//       </div>
//     );
//   }

//   if (isLoading) {
//     return (
//       <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg">
//         <p className="text-black">🔄 Loading NFT data... (Check console for logs)</p>
//         {txDigest && <p className="text-sm text-black mt-2">Extracting NFT ID from transaction: {txDigest}</p>}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
//         <p className="text-black">❌ Error: {error.message}</p>
//         <p className="text-sm text-black mt-2">Check console for detailed error logs</p>
//       </div>
//     );
//   }

//   if (!hasData) {
//     return (
//       <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
//         <p className="text-black">⚠️ No NFT data found</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
//       <h3 className="text-lg font-bold text-black mb-3">🔍 NFT Data Retrieved!</h3>
      
//       <div className="space-y-2 text-sm text-black">
//         {txDigest && (
//           <p><strong>Transaction Digest:</strong> <code className="bg-white px-1 rounded text-xs text-black">{txDigest}</code></p>
//         )}
//         <p><strong>Final NFT ID:</strong> <code className="bg-white px-1 rounded text-xs text-black">{finalNFTId}</code></p>
//         <p><strong>Object ID:</strong> <code className="bg-white px-1 rounded text-black">{parsedData?.objectId}</code></p>
//         <p><strong>Type:</strong> <code className="bg-white px-1 rounded text-black">{parsedData?.type}</code></p>
//         <p><strong>Has Fields:</strong> {hasFields ? "✅ Yes" : "❌ No"}</p>
//         <p><strong>Has Display:</strong> {hasDisplay ? "✅ Yes" : "❌ No"}</p>
        
//         {hasFields && (
//           <div className="mt-3 p-2 bg-white rounded">
//             <p className="text-black"><strong>Available Fields:</strong></p>
//             <pre className="text-xs overflow-x-auto text-black">
//               {JSON.stringify(parsedData?.fields, null, 2)}
//             </pre>
//           </div>
//         )}
//       </div>
      
//       <p className="text-xs text-black mt-3">
//         📝 Check browser console for complete data structure logs
//       </p>
//     </div>
//   );
// }