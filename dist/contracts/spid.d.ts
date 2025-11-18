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
    increaseReputation(points: number): Promise<string>;
    addTrait(traitId: string, traitData: any): Promise<void>;
    createPremiumSpiral(spiralId: string, amount: string, premiumFeatures: {
        bio?: string;
        avatar?: string;
        socialLinks?: string[];
        traits?: string[];
    }): Promise<string>;
    isPremiumSpiral(address: string): Promise<boolean>;
    getReputation(address: string): Promise<string>;
    getSpiralTraits(): string[];
    unlockAchievement(achievementId: string): Promise<void>;
}
