"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Auth = void 0;
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const proofService_1 = require("../zk/proofService");
const signatureUtils_1 = require("../zk/signatureUtils");
class Web3Auth {
    constructor(config = {}) {
        this.config = {
            apiUrl: config.apiUrl || 'https://api.spiralid.com',
            chainId: config.chainId || chains_1.sepolia.id,
            contractAddress: config.contractAddress || '0x',
        };
        // Initialize ZK proof service
        this.zkProofService = new proofService_1.ZKProofService();
        if (typeof window !== 'undefined' && window.ethereum) {
            const chain = this.config.chainId === chains_1.mainnet.id ? chains_1.mainnet : chains_1.sepolia;
            this.walletClient = (0, viem_1.createWalletClient)({
                chain,
                transport: (0, viem_1.custom)(window.ethereum),
            });
        }
    }
    async connectWallet() {
        if (!this.walletClient) {
            throw new Error('Web3 provider not available. Please install MetaMask or another wallet.');
        }
        try {
            const [address] = await this.walletClient.requestAddresses();
            return (0, viem_1.getAddress)(address);
        }
        catch (error) {
            throw new Error('Failed to connect wallet: ' + error.message);
        }
    }
    async signMessage(message) {
        if (!this.walletClient) {
            throw new Error('Wallet client not available');
        }
        const [address] = await this.walletClient.getAddresses();
        try {
            const signature = await this.walletClient.signMessage({
                account: address,
                message,
            });
            return signature;
        }
        catch (error) {
            throw new Error('Failed to sign message: ' + error.message);
        }
    }
    async generateNonce(address) {
        const response = await fetch(`${this.config.apiUrl}/api/auth/nonce`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address }),
        });
        if (!response.ok) {
            throw new Error('Failed to generate nonce');
        }
        const { nonce } = await response.json();
        return nonce;
    }
    async authenticate() {
        const address = await this.connectWallet();
        const nonce = await this.generateNonce(address);
        const message = `Welcome to Spiral ID!\n\nSign this message to authenticate.\nNonce: ${nonce}`;
        const signature = await this.signMessage(message);
        const response = await fetch(`${this.config.apiUrl}/api/auth/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                address,
                signature,
                message,
                nonce,
            }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Authentication failed');
        }
        return response.json();
    }
    // ZK-based authentication methods
    async authenticateWithZKProof() {
        const address = await this.connectWallet();
        const nonce = await this.generateNonce(address);
        const message = `Welcome to Spiral ID!\n\nSign this message to generate ZK proof.\nNonce: ${nonce}`;
        const signature = await this.signMessage(message);
        // Generate ZK proof instead of sending raw signature
        const zkProof = await this.generateZKProof(message, signature, address);
        const response = await fetch(`${this.config.apiUrl}/api/auth/verify-zk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                address,
                zkProof: JSON.stringify(zkProof),
                nonce,
            }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'ZK authentication failed');
        }
        return response.json();
    }
    async generateZKProof(message, signature, publicKey) {
        const keyPair = signatureUtils_1.SignatureUtils.deriveEdDSAKeyPairFromEthereumSignature(signature);
        const edDSASignature = signatureUtils_1.SignatureUtils.signMessage(message, keyPair.privateKey);
        const inputs = signatureUtils_1.SignatureUtils.prepareZKInputs(message, edDSASignature, keyPair.publicKey);
        // Generate the ZK proof
        return await this.zkProofService.generateProof(inputs);
    }
    async verifyZKProof(proof) {
        return await this.zkProofService.verifyProof(proof);
    }
    // Method to get ZK proof service for advanced usage
    getZKProofService() {
        return this.zkProofService;
    }
}
exports.Web3Auth = Web3Auth;
