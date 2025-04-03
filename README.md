## TAC Starter Frontend

A Next.js starter template for building hybrid dApps that connect TON and EVM ecosystems using the TAC SDK.

> This repository is part of the full starter application provided through the create-tac-app CLI tool.


### Features 

- ⚡ Next.js 14 with App Router
- 🎨 Shadcn UI for beautiful, accessible UI components
- 🔌 TON Connect for seamless TON wallet integration
- 🌉 TAC SDK for cross-chain messaging between TON and EVM
- 📦 TypeScript for type safety and better developer experience
- 🔧 Tailwind CSS for utility-first styling

### Prerequisites

- Node.js 18.17.0 or higher
- A TON wallet (Tonkeeper or TON Space recommended)
- Some testnet TON tokens for testing


### Installation

```
# Clone this repository (or use create-tac-app)
git clone https://github.com/tacbuild/starter-frontend.git my-tac-app
cd my-tac-app

# Install dependencies
npm install
```

### Configuration

This starter is pre-configured to work with example contracts deployed on the TAC testnet. The contract addresses are defined in lib/constants.ts:
```tsx
export const CONTRACT_ADDRESS = {
    SIMPLE_MESSAGE: "0x474a33F40232bdF188D46E016ad36F517Be91Bc3",
    MESSAGE_PROXY: "0x63b9E4DAc2615104DfE0d72AC593285114aeF8cc",
    CROSS_CHAIN_LAYER: "0xAd2fBeB7CE5f6e4F9C21090C7e4018081f4b323d",
} as const;
```

If you've deployed your own contracts, update these addresses accordingly.

### Development Server

```
npm run dev
```
Open http://localhost:3000 to see your application.


