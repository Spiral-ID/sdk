"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPIDContract = void 0;
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const SPID_ABI = [
    {
        name: 'burnForSpiral',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'holder', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
    },
    {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ type: 'uint256' }],
    },
    {
        name: 'transfer',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ type: 'bool' }],
    },
    {
        name: 'increaseReputation',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'account', type: 'address' },
            { name: 'points', type: 'uint256' },
        ],
        outputs: [],
    },
    {
        name: 'getReputation',
        type: 'function',
        stateMutability: 'view',
        inputs: [
            { name: 'account', type: 'address' },
        ],
        outputs: [{ type: 'uint256' }],
    },
];
class SPIDContract {
    constructor(config = {}) {
        this.spiralTraits = [];
        this.config = {
            apiUrl: config.apiUrl || 'https://api.spiralid.com',
            chainId: config.chainId || chains_1.sepolia.id,
            contractAddress: config.contractAddress || '0x',
        };
        const chain = this.config.chainId === chains_1.mainnet.id ? chains_1.mainnet : chains_1.sepolia;
        this.publicClient = (0, viem_1.createPublicClient)({
            chain,
            transport: (0, viem_1.http)(),
        });
        if (typeof window !== 'undefined' && window.ethereum) {
            this.walletClient = (0, viem_1.createWalletClient)({
                chain,
                transport: (0, viem_1.custom)(window.ethereum),
            });
        }
    }
    async burnForSpiral(options) {
        const { spiralId, amount } = options;
        if (!this.walletClient) {
            throw new Error('Wallet client not available. Make sure you have a Web3 provider.');
        }
        const [address] = await this.walletClient.getAddresses();
        const hash = await this.walletClient.writeContract({
            address: this.config.contractAddress,
            abi: SPID_ABI,
            functionName: 'burnForSpiral',
            args: [address, (0, viem_1.parseEther)(amount)],
            account: address,
        });
        return hash;
    }
    async getBalance(address) {
        const balance = await this.publicClient.readContract({
            address: this.config.contractAddress,
            abi: SPID_ABI,
            functionName: 'balanceOf',
            args: [address],
        });
        return balance.toString();
    }
    async transfer(to, amount) {
        if (!this.walletClient) {
            throw new Error('Wallet client not available');
        }
        const [address] = await this.walletClient.getAddresses();
        const hash = await this.walletClient.writeContract({
            address: this.config.contractAddress,
            abi: SPID_ABI,
            functionName: 'transfer',
            args: [to, (0, viem_1.parseEther)(amount)],
            account: address,
        });
        return hash;
    }
    async increaseReputation(points) {
        if (!this.walletClient) {
            throw new Error('Wallet client not available. Make sure you have a Web3 provider.');
        }
        const [address] = await this.walletClient.getAddresses();
        const tx = await this.walletClient.writeContract({
            address: this.config.contractAddress,
            abi: SPID_ABI,
            functionName: 'increaseReputation',
            args: [address, BigInt(points)],
            account: address,
        });
        return tx;
    }
    async addTrait(traitId, traitData) {
        this.spiralTraits.push(traitId);
    }
    async createPremiumSpiral(spiralId, amount, premiumFeatures) {
        const premiumAmount = (parseFloat(amount) * 1.5).toString();
        const hash = await this.burnForSpiral({
            spiralId,
            amount: premiumAmount
        });
        console.log(`Premium Spiral ID created with features:`, premiumFeatures);
        return hash;
    }
    async isPremiumSpiral(address) {
        const score = await this.getReputation(address);
        return Number(score) > 100 || this.spiralTraits.length > 2;
    }
    async getReputation(address) {
        const score = await this.publicClient.readContract({
            address: this.config.contractAddress,
            abi: SPID_ABI,
            functionName: 'getReputation',
            args: [address],
        });
        return score.toString();
    }
    getSpiralTraits() {
        return this.spiralTraits;
    }
    async unlockAchievement(achievementId) {
        await this.increaseReputation(25);
    }
}
exports.SPIDContract = SPIDContract;
