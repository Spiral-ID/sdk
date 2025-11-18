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
exports.ZKProofService = void 0;
const snarkjs = __importStar(require("snarkjs"));
const circomlib = __importStar(require("circomlib"));
class ZKProofService {
    constructor(wasmPath = './circuits/proof_of_humanity.wasm', zkeyPath = './circuits/proof_of_humanity.zkey') {
        this.wasmPath = wasmPath;
        this.zkeyPath = zkeyPath;
    }
    async initialize() {
        // Carregar chave de verificação
        this.vkey = await snarkjs.zKey.exportVerificationKey(this.zkeyPath);
    }
    async generateProof(inputs) {
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(this.formatInputs(inputs), this.wasmPath, this.zkeyPath);
        return { proof, publicSignals };
    }
    async verifyProof(proof) {
        return await snarkjs.groth16.verify(this.vkey, proof.publicSignals, proof.proof);
    }
    async generateHumanityProof(messageHash, pubKeyX, pubKeyY, R8x, R8y, S) {
        const inputs = {
            messageHash,
            pubKeyX,
            pubKeyY,
            R8x,
            R8y,
            S
        };
        return this.generateProof(inputs);
    }
    async generateAgeProof(messageHash, pubKeyX, pubKeyY, R8x, R8y, S, age, currentYear, birthYear) {
        const inputs = {
            messageHash,
            pubKeyX,
            pubKeyY,
            R8x,
            R8y,
            S,
            age,
            currentYear,
            birthYear
        };
        return this.generateProof(inputs);
    }
    formatInputs(inputs) {
        return {
            messageHash: inputs.messageHash.toString(),
            pubKeyX: inputs.pubKeyX.toString(),
            pubKeyY: inputs.pubKeyY.toString(),
            R8x: inputs.R8x.toString(),
            R8y: inputs.R8y.toString(),
            S: inputs.S.toString(),
            age: inputs.age?.toString() || '0',
            currentYear: inputs.currentYear?.toString() || '0',
            birthYear: inputs.birthYear?.toString() || '0'
        };
    }
    // Utilitários para gerar hashes MiMC (compatível com Circom)
    static mimcHash(data) {
        const mimc = circomlib.mimc7;
        let hash = mimc.multiHash(data.map(d => BigInt(d.toString())));
        // For MiMC7, we need to use a different approach since mimc7 doesn't have F property
        return hash.toString();
    }
    static generateMessageHash(message) {
        const encoder = new TextEncoder();
        const messageBytes = encoder.encode(message);
        // Converter para array de bigints para MiMC
        const chunks = [];
        for (let i = 0; i < messageBytes.length; i += 31) {
            let chunk = 0n;
            for (let j = 0; j < 31 && i + j < messageBytes.length; j++) {
                chunk = (chunk << 8n) | BigInt(messageBytes[i + j]);
            }
            chunks.push(chunk);
        }
        return ZKProofService.mimcHash(chunks);
    }
}
exports.ZKProofService = ZKProofService;
