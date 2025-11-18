import * as circomlib from 'circomlib';
import { BigNumberish } from 'ethers';
import { ZKProofService } from './proofService';
import { randomBytes } from 'crypto'

export interface EdDSASignature {
  R8: { x: BigNumberish; y: BigNumberish };
  S: BigNumberish;
}

export interface EdDSAKeyPair {
  publicKey: { x: BigNumberish; y: BigNumberish };
  privateKey: Buffer;
}

export class SignatureUtils {
  static generateKeyPair(): EdDSAKeyPair {
    const priv = randomBytes(32)
    const pruned = circomlib.eddsa.pruneBuffer(priv)
    const pub = circomlib.eddsa.prv2pub(pruned)
    return {
      publicKey: { x: pub[0].toString(), y: pub[1].toString() },
      privateKey: pruned
    }
  }

  static signMessage(message: string, privateKey: Buffer): EdDSASignature {
    const messageHash = ZKProofService.generateMessageHash(message);
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

  static verifySignature(
    message: string,
    signature: EdDSASignature,
    publicKey: { x: BigNumberish; y: BigNumberish }
  ): boolean {
    const messageHash = ZKProofService.generateMessageHash(message);
    const messageBigInt = BigInt(messageHash);
    const sig = {
      R8: [BigInt(signature.R8.x.toString()), BigInt(signature.R8.y.toString())],
      S: BigInt(signature.S.toString())
    } as unknown as { R8: [bigint, bigint]; S: bigint }
    const pub: [bigint, bigint] = [
      BigInt(publicKey.x.toString()),
      BigInt(publicKey.y.toString())
    ]
    return circomlib.eddsa.verifyPedersen(messageBigInt, sig as any, pub)
  }

  static convertEthereumSignatureToEdDSA(
    ethSignature: string,
    message: string
  ): EdDSASignature {
    const priv = SignatureUtils.derivePrivateKeyFromEthereumSignature(ethSignature)
    return SignatureUtils.signMessage(message, priv)
  }

  static deriveEdDSAKeyPairFromEthereumSignature(ethSignature: string): EdDSAKeyPair {
    const priv = SignatureUtils.derivePrivateKeyFromEthereumSignature(ethSignature)
    const pub = circomlib.eddsa.prv2pub(priv)
    return {
      publicKey: { x: pub[0].toString(), y: pub[1].toString() },
      privateKey: priv
    }
  }

  private static derivePrivateKeyFromEthereumSignature(ethSignature: string): Buffer {
    let hex = ethSignature.startsWith('0x') ? ethSignature.slice(2) : ethSignature
    if (!/^[0-9a-fA-F]+$/.test(hex)) {
      const encoder = new TextEncoder()
      const bytes = encoder.encode(ethSignature)
      hex = Buffer.from(bytes).toString('hex')
    }
    const buf = Buffer.from(hex, 'hex')
    const chunks: bigint[] = []
    for (let i = 0; i < buf.length; i += 31) {
      let chunk = 0n
      for (let j = 0; j < 31 && i + j < buf.length; j++) {
        chunk = (chunk << 8n) | BigInt(buf[i + j])
      }
      chunks.push(chunk)
    }
    const h = ZKProofService.mimcHash(chunks)
    let hHex = BigInt(h).toString(16)
    if (hHex.length % 2 === 1) hHex = '0' + hHex
    if (hHex.length < 64) hHex = hHex.padStart(64, '0')
    if (hHex.length > 64) hHex = hHex.slice(-64)
    const seed = Buffer.from(hHex, 'hex')
    return circomlib.eddsa.pruneBuffer(seed)
  }


  static prepareZKInputs(
    message: string,
    signature: EdDSASignature,
    publicKey: { x: BigNumberish; y: BigNumberish }
  ): any {
    const messageHash = ZKProofService.generateMessageHash(message);
    
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
