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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpiralSDK = exports.SignatureUtils = exports.ZKProofService = exports.SpiralApiClient = exports.Web3Auth = exports.SPIDContract = void 0;
const spid_1 = require("./contracts/spid");
const web3_1 = require("./auth/web3");
const client_1 = require("./api/client");
const zk_1 = require("./zk");
var spid_2 = require("./contracts/spid");
Object.defineProperty(exports, "SPIDContract", { enumerable: true, get: function () { return spid_2.SPIDContract; } });
var web3_2 = require("./auth/web3");
Object.defineProperty(exports, "Web3Auth", { enumerable: true, get: function () { return web3_2.Web3Auth; } });
var client_2 = require("./api/client");
Object.defineProperty(exports, "SpiralApiClient", { enumerable: true, get: function () { return client_2.SpiralApiClient; } });
var zk_2 = require("./zk");
Object.defineProperty(exports, "ZKProofService", { enumerable: true, get: function () { return zk_2.ZKProofService; } });
Object.defineProperty(exports, "SignatureUtils", { enumerable: true, get: function () { return zk_2.SignatureUtils; } });
__exportStar(require("./types"), exports);
__exportStar(require("./zk/types"), exports);
class SpiralSDK {
    constructor(config = {}) {
        this.contracts = {
            spid: new spid_1.SPIDContract(config),
        };
        this.auth = {
            web3: new web3_1.Web3Auth(config),
        };
        this.api = new client_1.SpiralApiClient(config.apiUrl);
        this.zk = {
            proofService: new zk_1.ZKProofService(config.zkWasmPath, config.zkZkeyPath),
            signatureUtils: zk_1.SignatureUtils
        };
    }
    setAuthToken(token) {
        this.api.setAuthToken(token);
    }
    // Métodos ZK simplificados para facilitar o uso
    async generateZKProof(message, signature, publicKey) {
        const inputs = this.zk.signatureUtils.prepareZKInputs(message, signature, publicKey);
        return await this.zk.proofService.generateProof(inputs);
    }
    async verifyZKProof(proof) {
        return await this.zk.proofService.verifyProof(proof);
    }
}
exports.SpiralSDK = SpiralSDK;
