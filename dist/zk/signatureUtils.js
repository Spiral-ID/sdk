"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureUtils = void 0;
const circomlib = __importStar(require("circomlib"));
const proofService_1 = require("./proofService");
const crypto_1 = require("crypto");
class SignatureUtils {
    static generateKeyPair() {
        const priv = (0, crypto_1.randomBytes)(32);
        const pruned = circomlib.eddsa.pruneBuffer(priv);
        const pub = circomlib.eddsa.prv2pub(pruned);
        return {
            publicKey: { x: pub[0].toString(), y: pub[1].toString() },
            privateKey: pruned
        };
    }
    static signMessage(message, privateKey) {
        const messageHash = proofService_1.ZKProofService.generateMessageHash(message);
        const messageBigInt = BigInt(messageHash);
        const signature = circomlib.eddsa.signPedersen(privateKey, messageBigInt);
        return {
            R8: {
                x: circomlib.babyJub.F.toString(signature.R8[0]),
                y: circomlib.babyJub.F.toString(signature.R8[1])
            },
            S: signature.S.toString()
        };
    }
    static verifySignature(message, signature, publicKey) {
        const messageHash = proofService_1.ZKProofService.generateMessageHash(message);
        const messageBigInt = BigInt(messageHash);
        const sig = {
            R8: [BigInt(signature.R8.x.toString()), BigInt(signature.R8.y.toString())],
            S: BigInt(signature.S.toString())
        };
        const pub = [
            BigInt(publicKey.x.toString()),
            BigInt(publicKey.y.toString())
        ];
        return circomlib.eddsa.verifyPedersen(messageBigInt, sig, pub);
    }
    static convertEthereumSignatureToEdDSA(ethSignature, message) {
        const priv = SignatureUtils.derivePrivateKeyFromEthereumSignature(ethSignature);
        return SignatureUtils.signMessage(message, priv);
    }
    static deriveEdDSAKeyPairFromEthereumSignature(ethSignature) {
        const priv = SignatureUtils.derivePrivateKeyFromEthereumSignature(ethSignature);
        const pub = circomlib.eddsa.prv2pub(priv);
        return {
            publicKey: { x: pub[0].toString(), y: pub[1].toString() },
            privateKey: priv
        };
    }
    static derivePrivateKeyFromEthereumSignature(ethSignature) {
        let hex = ethSignature.startsWith('0x') ? ethSignature.slice(2) : ethSignature;
        if (!/^[0-9a-fA-F]+$/.test(hex)) {
            const encoder = new TextEncoder();
            const bytes = encoder.encode(ethSignature);
            hex = Buffer.from(bytes).toString('hex');
        }
        const buf = Buffer.from(hex, 'hex');
        const chunks = [];
        for (let i = 0; i < buf.length; i += 31) {
            let chunk = 0n;
            for (let j = 0; j < 31 && i + j < buf.length; j++) {
                chunk = (chunk << 8n) | BigInt(buf[i + j]);
            }
            chunks.push(chunk);
        }
        const h = proofService_1.ZKProofService.mimcHash(chunks);
        let hHex = BigInt(h).toString(16);
        if (hHex.length % 2 === 1)
            hHex = '0' + hHex;
        if (hHex.length < 64)
            hHex = hHex.padStart(64, '0');
        if (hHex.length > 64)
            hHex = hHex.slice(-64);
        const seed = Buffer.from(hHex, 'hex');
        return circomlib.eddsa.pruneBuffer(seed);
    }
    static prepareZKInputs(message, signature, publicKey) {
        const messageHash = proofService_1.ZKProofService.generateMessageHash(message);
        return {
            messageHash: messageHash.toString(),
            pubKeyX: publicKey.x.toString(),
            pubKeyY: publicKey.y.toString(),
            R8x: signature.R8.x.toString(),
            R8y: signature.R8.y.toString(),
            S: signature.S.toString()
        };
    }
}
exports.SignatureUtils = SignatureUtils;
