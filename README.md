<div align="center">

# Spiral ID SDK

**The complete toolkit for integrating decentralized identity, reputation, and privacy into your Web3 applications.**

<a href="https://www.npmjs.com/package/spiral-id-sdk"><img alt="npm version" src="https://img.shields.io/npm/v/spiral-id-sdk.svg"></a>
<a href="https://github.com/spiral-id/sdk"><img alt="GitHub" src="https://img.shields.io/badge/GitHub-spiral--id%2Fsdk-blue" /></a>
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-blue" />
<img alt="Node" src="https://img.shields.io/badge/Node-%3E=%2018-green" />
<a href="/LICENSE"><img alt="License" src="https://img.shields.io/badge/License-MIT-yellow" /></a>

</div>

## What is Spiral ID?

Spiral ID is a decentralized identity protocol that empowers users to own, control, and leverage their digital identity across the Web3 ecosystem. It goes beyond simple authentication by building a dynamic reputation system based on on-chain activities.

This SDK is the easiest way to integrate Spiral ID's powerful features into your decentralized application (dApp), providing a seamless experience for both developers and end-users.

## Core Features

*   **✨ Seamless Web3 Authentication:** Effortlessly integrate "Sign-In with Ethereum" (SIWE) for secure, wallet-based authentication.
*   **💎 On-Chain Reputation & Identity:** Utilize the `$SPID` token to allow users to build their on-chain reputation, create a unique Spiral ID, and unlock new possibilities.
*   **🔒 Privacy via ZK-Proofs:** Verify user credentials and data points with Zero-Knowledge Proofs (using Groth16 and EdDSA), ensuring user privacy is always protected.
*   **🚀 Premium Profiles:** Enable users to create premium, feature-rich profiles by burning `$SPID`, offering them exclusive benefits and deeper engagement within your platform.
*   **📦 Fully-Typed & Production-Ready:** Built with TypeScript for a robust and predictable development experience.

## Installation

Get started by adding the Spiral ID SDK to your project:

```bash
npm install spiral-id-sdk
# or
yarn add spiral-id-sdk
# or
pnpm add spiral-id-sdk
```

## Getting Started: A Complete Example

Here’s a complete, practical example of how to use the SDK. This guide will walk you through initializing the SDK, authenticating a user, and interacting with the Spiral ID protocol.

```typescript
import { SpiralSDK } from 'spiral-id-sdk';

// --- Step 1: Initialize the SDK ---
// Configure the SDK with your application's details.
// You can find the correct contract addresses for each network in our documentation.
const sdk = new SpiralSDK({
  apiUrl: 'https://api.spiralid.dev',
  chainId: 11155111, // Sepolia Testnet
  spidContractAddress: '0xYourSpidContractAddress', // Replace with the official SPID token contract address
});

async function main() {
  try {
    // --- Step 2: Authenticate the User ---
    // This will trigger a "Sign-In with Ethereum" prompt in the user's wallet.
    console.log('Attempting to authenticate...');
    const authResponse = await sdk.auth.web3.authenticate();
    console.log('✅ Authentication successful! Token:', authResponse.token);

    // Set the received token for subsequent authenticated API calls
    sdk.setAuthToken(authResponse.token);
    const userAddress = authResponse.address;
    console.log(`Authenticated user address: ${userAddress}`);

    // --- Step 3: Interact with the SPID Token ---
    // Let's check the user's SPID token balance.
    console.log(`
Checking SPID balance for ${userAddress}...`);
    const balance = await sdk.contracts.spid.getBalance(userAddress);
    console.log(`💰 User has a balance of ${balance} SPID.`);

    // --- Step 4: Create a Spiral ID & Build Reputation ---
    // To create a Spiral ID, a user burns a certain amount of SPID tokens.
    // This action contributes to their on-chain reputation.
    const spiralId = `user-${Date.now()}`; // A unique identifier for the user
    const amountToBurn = '50'; // Amount of SPID to burn
    
    console.log(`
Attempting to create Spiral ID "${spiralId}" by burning ${amountToBurn} SPID...`);
    // Note: This will require the user to approve the transaction in their wallet.
    const txHash = await sdk.contracts.spid.burnForSpiral({
      spiralId,
      amount: amountToBurn,
    });
    console.log(`🔥 Spiral ID created successfully! Transaction hash: ${txHash}`);

    // You can also directly increase a user's reputation
    await sdk.contracts.spid.increaseReputation(10);
    const reputation = await sdk.contracts.spid.getReputation(userAddress);
    console.log(`📈 User's new reputation score: ${reputation}`);

  } catch (error) {
    console.error('❌ An error occurred:', error);
  }
}

main();
```

## API Overview

The Spiral ID SDK is organized into logical modules to make it easy to find the functionality you need.

*   `sdk.auth`: Handles all authentication-related logic, primarily through Sign-In with Ethereum (SIWE).
*   `sdk.contracts`: Provides methods to interact directly with the Spiral ID smart contracts, such as `spid` for token operations.
*   `sdk.api`: A client for making authenticated requests to the Spiral ID backend API.
*   `sdk.zk`: Contains utilities for generating and verifying Zero-Knowledge Proofs, enabling privacy-preserving features.

## Contributing

We welcome contributions from the community! If you'd like to help improve the Spiral ID SDK, please feel free to:

-   Report bugs and suggest features by [opening an issue](https://github.com/spiral-id/sdk/issues).
-   Submit pull requests with bug fixes or new features. Before starting, please open an issue to discuss your planned changes.

## License

This project is licensed under the **MIT License**. See the [LICENSE](/LICENSE) file for details.
