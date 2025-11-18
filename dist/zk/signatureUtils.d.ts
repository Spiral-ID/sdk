import { BigNumberish } from 'ethers';
export interface EdDSASignature {
    R8: {
        x: BigNumberish;
        y: BigNumberish;
    };
    S: BigNumberish;
}
export interface EdDSAKeyPair {
    publicKey: {
        x: BigNumberish;
        y: BigNumberish;
    };
    privateKey: Buffer;
}
export declare class SignatureUtils {
    static generateKeyPair(): EdDSAKeyPair;
    static signMessage(message: string, privateKey: Buffer): EdDSASignature;
    static verifySignature(message: string, signature: EdDSASignature, publicKey: {
        x: BigNumberish;
        y: BigNumberish;
    }): boolean;
    static convertEthereumSignatureToEdDSA(ethSignature: string, message: string): EdDSASignature;
    static deriveEdDSAKeyPairFromEthereumSignature(ethSignature: string): EdDSAKeyPair;
    private static derivePrivateKeyFromEthereumSignature;
    static prepareZKInputs(message: string, signature: EdDSASignature, publicKey: {
        x: BigNumberish;
        y: BigNumberish;
    }): any;
}
