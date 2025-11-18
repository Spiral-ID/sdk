import { Spiral, CreateSpiralOptions } from '../types';
export declare class SpiralApiClient {
    private baseUrl;
    private authToken?;
    constructor(baseUrl?: string);
    setAuthToken(token: string): void;
    private getHeaders;
    private handleResponse;
    getSpirals(): Promise<Spiral[]>;
    getSpiral(spiralId: string): Promise<Spiral>;
    createSpiral(options: CreateSpiralOptions): Promise<Spiral>;
    updateSpiral(spiralId: string, metadata: Record<string, any>): Promise<Spiral>;
    deleteSpiral(spiralId: string): Promise<void>;
    getUserProfile(address: string): Promise<any>;
}
