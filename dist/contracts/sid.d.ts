import { SpiralIDConfig, BurnSpiralOptions } from '../types';
export declare class SPIDContract {
    private config;
    private publicClient;
    private walletClient;
    private spiralTraits;
    constructor(config?: SpiralIDConfig);
    burnForSpiral(options: BurnSpiralOptions): Promise<string>;
    getBalance(address: string): Promise<string>;
    transfer(to: string, amount: string): Promise<string>;
    /**
     * Reputation System - Increases score based on activities
     */
    increaseReputation(points: number): Promise<string>;
    /**
     * Adds unique NFT Traits to Spiral ID
     */
    addTrait(traitId: string, traitData: any): Promise<void>;
    /**
     * Creates Premium Spiral ID with additional cost and exclusive features
     */
    createPremiumSpiral(spiralId: string, amount: string, premiumFeatures: {
        bio?: string;
        avatar?: string;
        socialLinks?: string[];
        traits?: string[];
    }): Promise<string>;
    /**
     * Checks if Spiral ID is premium (based on traits and reputation)
     */
    isPremiumSpiral(address: string): Promise<boolean>;
    /**
     * Gets current reputation score
     */
    getReputation(address: string): Promise<string>;
    /**
     * Lists all Spiral ID traits
     */
    getSpiralTraits(): string[];
    /**
     * Achievement System - Unlocks achievements
     */
    unlockAchievement(achievementId: string): Promise<void>;
}
