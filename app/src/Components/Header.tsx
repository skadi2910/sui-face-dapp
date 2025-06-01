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
      className="top-0 z-50 bg-white shadow-sm border-b border-gray-200"
    >
      <Box>
        <Flex align="center" gap="4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg font-bold">SF</span>
          </div>
          <Heading size="6" className="text-gray-900 font-semibold">
            SuiFace
          </Heading>
          <span className="hidden md:inline-block text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
            Proof-of-Humanity Passport
          </span>
        </Flex>
      </Box>
      <Box>
        <ConnectButton />
      </Box>
    </Flex>
  );
}