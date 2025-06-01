// import { ConnectButton } from "@mysten/dapp-kit";
// import { Box, Flex, Heading } from "@radix-ui/themes";

// export function Header() {
//   return (
//     <Flex
//       position="sticky"
//       px="6"
//       py="4"
//       justify="between"
//       align="center"
//       className="top-0 z-50 bg-white shadow-sm border-b border-gray-200"
//     >
//       <Box>
//         <Flex align="center" gap="4">
//           <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
//             <span className="text-white text-lg font-bold">SF</span>
//           </div>
//           <Heading size="6" className="text-gray-900 font-semibold">
//             SuiFace
//           </Heading>
//           <span className="hidden md:inline-block text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
//             Proof-of-Humanity Passport
//           </span>
//         </Flex>
//       </Box>
//       <Box>
//         <ConnectButton />
//       </Box>
//     </Flex>
//   );
// }

import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Flex, Heading } from "@radix-ui/themes";

export function Header() {
  return (
    <Flex
      position="sticky"
      px="6"
      py="4"
      justify="between"
      align="center"
      className="top-0 z-50 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #000428 0%, #004e92 50%, #000428 100%)',
        borderBottom: '4px solid #00ff00',
        boxShadow: '0 4px 20px rgba(0, 255, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Retro Matrix Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="matrix-bg"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => {
          const shapes = ['★', '●', '◆', '▲'];
          const colors = ['#00ff00', '#ff00ff', '#00ffff', '#ffff00'];
          const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          
          return (
            <div
              key={i}
              className="absolute text-lg opacity-40 animate-pulse"
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

      <Box className="relative z-10">
        <Flex align="center" gap="4">
          {/* Retro Logo */}
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center border-4 retro-hover-float"
            style={{
              background: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)',
              border: '4px solid #00ff00',
              boxShadow: '0 0 20px rgba(0, 255, 0, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.2)'
            }}
          >
            <span 
              className="retro-title text-xl"
              style={{
                color: '#fff',
                textShadow: '2px 2px 0px #000, 0 0 10px #fff'
              }}
            >
              SF
            </span>
          </div>

          {/* Main Title */}
          <Heading size="7" className="retro-title text-neon-green animate-retro-pulse">
            <span style={{
              textShadow: '0 0 20px #00ff00, 3px 3px 0px #ff00ff, 6px 6px 0px #00ffff'
            }}>
              SUIFACE
            </span>
          </Heading>

          {/* Subtitle Badge */}
          <div 
            className="hidden md:inline-block retro-hover-float"
            style={{
              background: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)',
              border: '2px solid #ffff00',
              borderRadius: '20px',
              padding: '6px 16px',
              boxShadow: '0 0 15px rgba(255, 0, 255, 0.7)'
            }}
          >
            <span className="retro-text text-sm text-black" style={{
              textShadow: '1px 1px 0px #fff'
            }}>
              ◆ PROOF-OF-HUMANITY PASSPORT ◆
            </span>
          </div>

          {/* Extra Neon Accent */}
          <div className="hidden lg:flex items-center gap-2">
            {['◆', '★', '●'].map((shape, index) => (
              <span
                key={index}
                className="text-xl animate-pulse"
                style={{
                  color: ['#ff00ff', '#00ffff', '#ffff00'][index],
                  textShadow: `0 0 10px ${['#ff00ff', '#00ffff', '#ffff00'][index]}`,
                  animationDelay: `${index * 0.3}s`
                }}
              >
                {shape}
              </span>
            ))}
          </div>
        </Flex>
      </Box>

      {/* Connect Button Container */}
      <Box className="relative z-10">
        <div 
          className="retro-hover-float p-1 rounded-lg border-2"
          style={{
            background: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)',
            border: '2px solid #00ff00',
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.7)'
          }}
        >
          <div 
            className="bg-black/80 rounded p-1"
            style={{
              border: '1px solid #00ffff'
            }}
          >
            <ConnectButton />
          </div>
        </div>
      </Box>

      {/* Bottom Glow Effect */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(90deg, #ff00ff 0%, #00ffff 25%, #ffff00 50%, #00ffff 75%, #ff00ff 100%)',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.8)',
          animation: 'gradientShift 4s ease infinite'
        }}
      ></div>

      {/* Side Accent Lines */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{
          background: 'linear-gradient(180deg, #ff00ff 0%, #00ffff 50%, #ffff00 100%)',
          boxShadow: '0 0 15px rgba(255, 0, 255, 0.7)'
        }}
      ></div>
      <div 
        className="absolute right-0 top-0 bottom-0 w-1"
        style={{
          background: 'linear-gradient(180deg, #ffff00 0%, #00ffff 50%, #ff00ff 100%)',
          boxShadow: '0 0 15px rgba(255, 255, 0, 0.7)'
        }}
      ></div>

      {/* Corner Decorations */}
      <div 
        className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 animate-pulse"
        style={{
          borderColor: '#00ff00',
          boxShadow: '0 0 10px #00ff00'
        }}
      ></div>
      <div 
        className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 animate-pulse"
        style={{
          borderColor: '#ff00ff',
          boxShadow: '0 0 10px #ff00ff'
        }}
      ></div>
      <div 
        className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 animate-pulse"
        style={{
          borderColor: '#00ffff',
          boxShadow: '0 0 10px #00ffff'
        }}
      ></div>
      <div 
        className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 animate-pulse"
        style={{
          borderColor: '#ffff00',
          boxShadow: '0 0 10px #ffff00'
        }}
      ></div>
    </Flex>
  );
}