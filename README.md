# SuiFace - Decentralized Face Verification & Proof-of-Humanity Platform on Sui

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Sui](https://img.shields.io/badge/Sui-1.30.1-blue?style=flat-square&logo=sui)](https://sui.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Move](https://img.shields.io/badge/Move-2024.beta-orange?style=flat-square)](https://move-language.github.io/move/)
[![Walrus](https://img.shields.io/badge/Walrus-testnet-green?style=flat-square)](https://walrus.space/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://opensource.org/licenses/MIT)

SuiFace is a cutting-edge decentralized face verification platform built on the Sui blockchain. It enables users to prove their humanity through advanced face detection technology and mint unique, soulbound NFT passports that serve as verifiable proof-of-humanity credentials.

## 🌟 Features

- **AI-Powered Face Detection**: Advanced face verification using face-api.js
- **Soulbound NFT Passports**: Unique, non-transferable NFTs as proof of humanity
- **Decentralized Storage**: Images stored on Walrus decentralized storage network
- **One-Per-Wallet Policy**: Smart contract enforces single NFT per wallet address
- **Random UUID Generation**: Each passport gets a unique 6-character identifier
- **Modern UI/UX**: Beautiful, responsive interface with celebration animations
- **Web3 Integration**: Seamless connection with Sui wallets
- **Smart Contract Security**: Built with Move language for secure fund management

## 🚀 Getting Started

### Prerequisites

- Node.js v18.18.0 or higher
- pnpm package manager
- Sui CLI tools
- A Sui wallet (Sui Wallet, Ethos, etc.)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/skadi2910/sui-face.git
cd sui-face
```

2. Install dependencies:
```bash
# Install app dependencies
cd app
pnpm install
```

3. Set up your environment:
```bash
# Configure your Sui wallet and network
sui client switch --env testnet
```

4. Start the development server:
```bash
# Start the React development server
cd app
pnpm dev
```

5. Build and deploy smart contracts:
```bash
# Build Move contracts
cd contracts
./build.sh
```

## 🛠 Development Scripts

### Frontend (app/)
- `pnpm dev` - Start the Vite development server
- `pnpm build` - Build the production application
- `pnpm preview` - Preview the production build
- `pnpm lint` - Run ESLint for code quality

### Smart Contracts (contracts/)
- `./build.sh` - Build Move smart contracts
- `sui move test` - Run Move contract tests
- `sui client publish` - Deploy contracts to Sui network

## 🏗 Tech Stack

### Frontend
- React 18.3
- TypeScript 5.8
- Vite 6.2
- TailwindCSS 4.1
- Radix UI
- face-api.js (AI face detection)
- @mysten/dapp-kit (Sui wallet integration)
- @tanstack/react-query (State management)

### Blockchain
- Sui Network
- Move Smart Contracts
- @mysten/sui SDK
- Sui dApp Kit

### Storage & Infrastructure
- Walrus Decentralized Storage
- Vercel (Frontend hosting)
- Sui Testnet/Mainnet

### Development Tools
- ESLint
- Prettier
- TypeScript
- Vite

## 📱 How It Works

1. **Connect Wallet**: Users connect their Sui wallet to the application
2. **Face Verification**: Advanced AI analyzes the user's face through their camera
3. **Verification Success**: Once a human face is detected and verified
4. **NFT Minting**: Users can mint their unique Sui Face Passport NFT
5. **Proof of Humanity**: The soulbound NFT serves as verifiable proof of humanity

## 🔐 Smart Contract Features

- **One NFT Per Wallet**: Registry system prevents multiple NFTs per address
- **Soulbound Tokens**: NFTs are non-transferable (except for burning)
- **Random UUID**: Each passport gets a unique 6-character alphanumeric ID
- **Burn & Re-mint**: Users can burn their NFT and mint a new one if needed
- **Event Emission**: Smart contract emits events for frontend integration
- **Upgrade Capability**: Built-in upgrade mechanism for future improvements

## 🎨 NFT Metadata

Each Sui Face Passport NFT contains:
- **Name**: "Sui Face Passport #[UUID]"
- **Description**: "A Proof-Of-Humanity Passport SoulboundNFT"
- **Image**: Stored on Walrus decentralized storage
- **UUID**: Unique 6-character identifier
- **Owner**: Wallet address of the holder
- **Creator**: Contract deployer address
- **Created At**: Timestamp of minting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Live Demo](https://sui-face-dapp.vercel.app/)
- [Sui Network](https://sui.io/)
- [Walrus Storage](https://walrus.space/)
- [Move Language](https://move-language.github.io/move/)
- [Sui Documentation](https://docs.sui.io/)

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## 🌐 Networks

- **Testnet**: Currently deployed on Sui Testnet
- **Mainnet**: Coming soon

---

Made with ❤️ and 🧠 AI by [skadi2910](https://github.com/skadi2910)
