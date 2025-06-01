import { Box, Flex, Heading } from "@radix-ui/themes";

export function Footer() {
  return (
    <Box className="w-full bg-white border-t border-gray-200">
      <Box px="6" py="8">
        <div className="space-y-6">
          {/* Main Footer Content */}
          <Flex direction={{ initial: "column", md: "row" }} justify="between" align="start" gap="8">
            {/* Brand Section */}
            <Box className="space-y-3">
              <Flex align="center" gap="3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">SF</span>
                </div>
                <Heading size="4" className="text-gray-900 font-semibold">
                  SuiFace
                </Heading>
              </Flex>
              <p className="text-gray-600 text-sm max-w-md leading-relaxed">
                Decentralized proof-of-humanity verification through facial recognition and soulbound NFTs on the Sui blockchain.
              </p>
            </Box>

            {/* Links Section */}
            <Flex direction={{ initial: "column", sm: "row" }} gap="8">
              {/* Technology */}
              <Box className="space-y-2">
                <h3 className="text-gray-900 font-semibold text-sm">Technology</h3>
                <div className="space-y-1">
                  <a 
                    href="https://sui.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer text-xs"
                  >
                    Sui Blockchain
                  </a>
                  <a 
                    href="https://walrus.space" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer text-xs"
                  >
                    Walrus Storage
                  </a>
                  <a 
                    href="https://docs.sui.io/guides/developer/sui-101/building-ptb" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer text-xs"
                  >
                    Move Smart Contracts
                  </a>
                </div>
              </Box>

              {/* Resources */}
              <Box className="space-y-2">
                <h3 className="text-gray-900 font-semibold text-sm">Resources</h3>
                <div className="space-y-1">
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer text-xs"
                  >
                    GitHub
                  </a>
                  <a 
                    href="https://docs.sui.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer text-xs"
                  >
                    Documentation
                  </a>
                  <a 
                    href="https://suiscan.xyz/testnet" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer text-xs"
                  >
                    Explorer
                  </a>
                </div>
              </Box>

              {/* Community */}
              <Box className="space-y-2">
                <h3 className="text-gray-900 font-semibold text-sm">Community</h3>
                <div className="space-y-1">
                  <a 
                    href="#" 
                    className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer text-xs"
                  >
                    Discord
                  </a>
                  <a 
                    href="#" 
                    className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer text-xs"
                  >
                    Twitter
                  </a>
                  <a 
                    href="#" 
                    className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer text-xs"
                  >
                    Telegram
                  </a>
                </div>
              </Box>
            </Flex>
          </Flex>

          {/* Divider */}
          <div className="w-full h-px bg-gray-200"></div>

          {/* Bottom Section */}
          <Flex direction={{ initial: "column", sm: "row" }} justify="between" align="center" gap="4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <p className="text-gray-500 text-xs">
                © 2024 SuiFace. Built on Sui blockchain.
              </p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span className="text-green-600 text-xs font-medium">Testnet Active</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200 text-xs cursor-pointer"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200 text-xs cursor-pointer"
              >
                Terms of Service
              </a>
            </div>
          </Flex>

          {/* Tech Stack Badge */}
          <div className="flex justify-center pt-4">
            <div className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">
              <p className="text-gray-600 text-xs text-center">
                Powered by <span className="text-blue-600 font-medium">Sui</span> • 
                <span className="text-purple-600 font-medium"> Walrus</span> • 
                <span className="text-green-600 font-medium"> Move</span> • 
                <span className="text-orange-600 font-medium"> React</span>
              </p>
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
}