// import { Box, Flex, Heading } from "@radix-ui/themes";

// export function Footer() {
//   return (
//     <Box className="w-full bg-white border-t border-gray-200">
//       <Box px="6" py="8">
//         <div className="space-y-6">
//           {/* Main Footer Content */}
//           <Flex direction={{ initial: "column", md: "row" }} justify="between" align="start" gap="8">
//             {/* Brand Section */}
//             <Box className="space-y-3">
//               <Flex align="center" gap="3">
//                 <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
//                   <span className="text-white text-sm font-bold">SF</span>
//                 </div>
//                 <Heading size="4" className="text-gray-900 font-semibold">
//                   SuiFace
//                 </Heading>
//               </Flex>
//               <p className="text-gray-600 text-sm max-w-md leading-relaxed">
//                 Decentralized proof-of-humanity verification through facial recognition and soulbound NFTs on the Sui blockchain.
//               </p>
//             </Box>

//             {/* Links Section */}
//             <Flex direction={{ initial: "column", sm: "row" }} gap="8">
//               {/* Technology */}
//               <Box className="space-y-2">
//                 <h3 className="text-gray-900 font-semibold text-sm">Technology</h3>
//                 <div className="space-y-1">
//                   <a 
//                     href="https://sui.io" 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer text-xs"
//                   >
//                     Sui Blockchain
//                   </a>
//                   <a 
//                     href="https://walrus.space" 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer text-xs"
//                   >
//                     Walrus Storage
//                   </a>
//                   <a 
//                     href="https://docs.sui.io/guides/developer/sui-101/building-ptb" 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer text-xs"
//                   >
//                     Move Smart Contracts
//                   </a>
//                 </div>
//               </Box>

//               {/* Resources */}
//               <Box className="space-y-2">
//                 <h3 className="text-gray-900 font-semibold text-sm">Resources</h3>
//                 <div className="space-y-1">
//                   <a 
//                     href="https://github.com" 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer text-xs"
//                   >
//                     GitHub
//                   </a>
//                   <a 
//                     href="https://docs.sui.io" 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer text-xs"
//                   >
//                     Documentation
//                   </a>
//                   <a 
//                     href="https://suiscan.xyz/testnet" 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer text-xs"
//                   >
//                     Explorer
//                   </a>
//                 </div>
//               </Box>

//               {/* Community */}
//               <Box className="space-y-2">
//                 <h3 className="text-gray-900 font-semibold text-sm">Community</h3>
//                 <div className="space-y-1">
//                   <a 
//                     href="#" 
//                     className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer text-xs"
//                   >
//                     Discord
//                   </a>
//                   <a 
//                     href="#" 
//                     className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer text-xs"
//                   >
//                     Twitter
//                   </a>
//                   <a 
//                     href="#" 
//                     className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer text-xs"
//                   >
//                     Telegram
//                   </a>
//                 </div>
//               </Box>
//             </Flex>
//           </Flex>

//           {/* Divider */}
//           <div className="w-full h-px bg-gray-200"></div>

//           {/* Bottom Section */}
//           <Flex direction={{ initial: "column", sm: "row" }} justify="between" align="center" gap="4">
//             <div className="flex flex-col sm:flex-row items-center gap-3">
//               <p className="text-gray-500 text-xs">
//                 © 2024 SuiFace. Built on Sui blockchain.
//               </p>
//               <div className="flex items-center gap-1">
//                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
//                 <span className="text-green-600 text-xs font-medium">Testnet Active</span>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-4">
//               <a 
//                 href="#" 
//                 className="text-gray-500 hover:text-gray-700 transition-colors duration-200 text-xs cursor-pointer"
//               >
//                 Privacy Policy
//               </a>
//               <a 
//                 href="#" 
//                 className="text-gray-500 hover:text-gray-700 transition-colors duration-200 text-xs cursor-pointer"
//               >
//                 Terms of Service
//               </a>
//             </div>
//           </Flex>

//           {/* Tech Stack Badge */}
//           <div className="flex justify-center pt-4">
//             <div className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">
//               <p className="text-gray-600 text-xs text-center">
//                 Powered by <span className="text-blue-600 font-medium">Sui</span> • 
//                 <span className="text-purple-600 font-medium"> Walrus</span> • 
//                 <span className="text-green-600 font-medium"> Move</span> • 
//                 <span className="text-orange-600 font-medium"> React</span>
//               </p>
//             </div>
//           </div>
//         </div>
//       </Box>
//     </Box>
//   );
// }
import { Box, Flex, Heading } from "@radix-ui/themes";

export function Footer() {
  return (
    <Box className="w-full relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #000428 0%, #004e92 50%, #000428 100%)',
      borderTop: '4px solid #00ff00',
      boxShadow: '0 -10px 30px rgba(0, 255, 0, 0.3)'
    }}>
      {/* Retro Matrix Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="matrix-bg"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => {
          const shapes = ['★', '●', '◆', '▲'];
          const colors = ['#00ff00', '#ff00ff', '#00ffff', '#ffff00'];
          const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          
          return (
            <div
              key={i}
              className="absolute text-xl opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                color: randomColor,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {randomShape}
            </div>
          );
        })}
      </div>

      <Box px="6" py="8" className="relative z-10">
        <div className="space-y-8">
          {/* Main Footer Content */}
          <Flex direction={{ initial: "column", md: "row" }} justify="between" align="start" gap="8">
            {/* Brand Section - Retro Style */}
            <Box className="space-y-4">
              <Flex align="center" gap="4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center border-4 retro-hover-float"
                  style={{
                    background: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)',
                    border: '4px solid #00ff00',
                    boxShadow: '0 0 20px rgba(0, 255, 0, 0.7)'
                  }}
                >
                  <span className="retro-title text-xl text-white">SF</span>
                </div>
                <Heading size="6" className="retro-title text-neon-green text-3d-effect">
                  SUIFACE
                </Heading>
              </Flex>
              <p className="retro-text text-lg text-neon-cyan max-w-md leading-relaxed">
                DECENTRALIZED PROOF-OF-HUMANITY VERIFICATION THROUGH FACIAL RECOGNITION 
                AND SOULBOUND NFTS ON THE SUI BLOCKCHAIN! 🚀
              </p>
              <div 
                className="inline-block px-4 py-2 rounded-lg border-2"
                style={{
                  background: 'rgba(0, 255, 0, 0.1)',
                  border: '2px solid #00ff00',
                  boxShadow: '0 0 15px rgba(0, 255, 0, 0.5)'
                }}
              >
                <span className="retro-text text-sm text-neon-green">
                  ⚡ POWERED BY WEB3 MAGIC ⚡
                </span>
              </div>
            </Box>

            {/* Links Section - Retro Cards */}
            <Flex direction={{ initial: "column", sm: "row" }} gap="6">
              {/* Technology */}
              <div 
                className="retro-card-inner p-4 rounded-lg border-2 retro-hover-float min-w-[160px]"
                style={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  border: '2px solid #ff00ff',
                  boxShadow: '0 0 15px rgba(255, 0, 255, 0.5)'
                }}
              >
                <h3 className="retro-title text-lg text-neon-pink mb-3">TECHNOLOGY</h3>
                <div className="space-y-2">
                  <a 
                    href="https://sui.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block retro-text text-sm text-neon-cyan hover:text-neon-yellow transition-colors duration-200 cursor-pointer"
                  >
                    ► SUI BLOCKCHAIN
                  </a>
                  <a 
                    href="https://walrus.space" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block retro-text text-sm text-neon-cyan hover:text-neon-yellow transition-colors duration-200 cursor-pointer"
                  >
                    ► WALRUS STORAGE
                  </a>
                  <a 
                    href="https://docs.sui.io/guides/developer/sui-101/building-ptb" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block retro-text text-sm text-neon-cyan hover:text-neon-yellow transition-colors duration-200 cursor-pointer"
                  >
                    ► MOVE CONTRACTS
                  </a>
                </div>
              </div>

              {/* Resources */}
              <div 
                className="retro-card-inner p-4 rounded-lg border-2 retro-hover-float min-w-[160px]"
                style={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  border: '2px solid #00ffff',
                  boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)'
                }}
              >
                <h3 className="retro-title text-lg text-neon-cyan mb-3">RESOURCES</h3>
                <div className="space-y-2">
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block retro-text text-sm text-neon-green hover:text-neon-yellow transition-colors duration-200 cursor-pointer"
                  >
                    ► GITHUB
                  </a>
                  <a 
                    href="https://docs.sui.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block retro-text text-sm text-neon-green hover:text-neon-yellow transition-colors duration-200 cursor-pointer"
                  >
                    ► DOCUMENTATION
                  </a>
                  <a 
                    href="https://suiscan.xyz/testnet" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block retro-text text-sm text-neon-green hover:text-neon-yellow transition-colors duration-200 cursor-pointer"
                  >
                    ► EXPLORER
                  </a>
                </div>
              </div>

              {/* Community */}
              <div 
                className="retro-card-inner p-4 rounded-lg border-2 retro-hover-float min-w-[160px]"
                style={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  border: '2px solid #ffff00',
                  boxShadow: '0 0 15px rgba(255, 255, 0, 0.5)'
                }}
              >
                <h3 className="retro-title text-lg text-neon-yellow mb-3">COMMUNITY</h3>
                <div className="space-y-2">
                  <a 
                    href="#" 
                    className="block retro-text text-sm text-neon-pink hover:text-neon-yellow transition-colors duration-200 cursor-pointer"
                  >
                    ► DISCORD
                  </a>
                  <a 
                    href="#" 
                    className="block retro-text text-sm text-neon-pink hover:text-neon-yellow transition-colors duration-200 cursor-pointer"
                  >
                    ► TWITTER
                  </a>
                  <a 
                    href="#" 
                    className="block retro-text text-sm text-neon-pink hover:text-neon-yellow transition-colors duration-200 cursor-pointer"
                  >
                    ► TELEGRAM
                  </a>
                </div>
              </div>
            </Flex>
          </Flex>

          {/* Retro Divider */}
          <div 
            className="w-full h-1 rounded"
            style={{
              background: 'linear-gradient(90deg, #ff00ff 0%, #00ffff 50%, #ffff00 100%)',
              boxShadow: '0 0 10px rgba(0, 255, 255, 0.7)'
            }}
          ></div>

          {/* Bottom Section - Retro Style */}
          <Flex direction={{ initial: "column", sm: "row" }} justify="between" align="center" gap="6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="retro-text text-sm text-neon-green">
                © 2024 SUIFACE. BUILT ON SUI BLOCKCHAIN.
              </p>
              <div 
                className="flex items-center gap-2 px-3 py-1 rounded-lg border-2"
                style={{
                  background: 'rgba(0, 255, 0, 0.1)',
                  border: '2px solid #00ff00',
                  boxShadow: '0 0 15px rgba(0, 255, 0, 0.5)'
                }}
              >
                <span 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{
                    background: '#00ff00',
                    boxShadow: '0 0 10px #00ff00'
                  }}
                ></span>
                <span className="retro-text text-sm text-neon-green">TESTNET ACTIVE</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="retro-text text-sm text-neon-cyan hover:text-neon-yellow transition-colors duration-200 cursor-pointer"
              >
                PRIVACY POLICY
              </a>
              <span className="text-neon-pink">●</span>
              <a 
                href="#" 
                className="retro-text text-sm text-neon-cyan hover:text-neon-yellow transition-colors duration-200 cursor-pointer"
              >
                TERMS OF SERVICE
              </a>
            </div>
          </Flex>

          {/* Tech Stack Badge - Ultra Retro */}
          <div className="flex justify-center pt-4">
            <div 
              className="retro-card-inner px-6 py-3 rounded-lg border-4 retro-hover-float"
              style={{
                background: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 50%, #ffff00 100%)',
                border: '4px solid #00ff00',
                boxShadow: '0 0 25px rgba(0, 255, 0, 0.7)'
              }}
            >
              <p className="retro-text text-lg text-center text-black">
                POWERED BY{' '}
                <span 
                  className="retro-title"
                  style={{
                    color: '#000',
                    textShadow: '1px 1px 0px #fff'
                  }}
                >
                  SUI
                </span>{' '}
                ●{' '}
                <span 
                  className="retro-title"
                  style={{
                    color: '#000',
                    textShadow: '1px 1px 0px #fff'
                  }}
                >
                  WALRUS
                </span>{' '}
                ●{' '}
                <span 
                  className="retro-title"
                  style={{
                    color: '#000',
                    textShadow: '1px 1px 0px #fff'
                  }}
                >
                  MOVE
                </span>{' '}
                ●{' '}
                <span 
                  className="retro-title"
                  style={{
                    color: '#000',
                    textShadow: '1px 1px 0px #fff'
                  }}
                >
                  REACT
                </span>
              </p>
            </div>
          </div>

          {/* Extra Retro Flair */}
          <div className="flex justify-center pt-4">
            <div className="flex items-center gap-4">
              {['◆', '★', '●', '▲', '●', '★', '◆'].map((shape, index) => (
                <span
                  key={index}
                  className="text-2xl animate-pulse"
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

          {/* Final Message */}
          <div className="text-center pt-2">
            <p className="retro-title text-2xl text-neon-green text-3d-effect animate-retro-pulse">
              ◆ WELCOME TO THE FUTURE OF IDENTITY ◆
            </p>
          </div>
        </div>
      </Box>
    </Box>
  );
}