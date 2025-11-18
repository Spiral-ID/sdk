declare module 'circomlib' {
  export interface Point {
    x: bigint;
    y: bigint;
  }

  export interface Signature {
    R8: [bigint, bigint];
    S: bigint;
  }

  export namespace eddsa {
    export function pruneBuffer(buffer: Buffer): Buffer;
    export function randomBytes(length: number): Buffer;
    export function prv2pub(privateKey: Buffer): [bigint, bigint];
    export function signPedersen(privateKey: Buffer, msg: bigint): Signature;
    export function verifyPedersen(msg: bigint, signature: Signature, publicKey: [bigint, bigint]): boolean;
  }

  export namespace babyJub {
    export namespace F {
      export function toString(value: bigint): string;
      export function toObject(value: bigint): any;
    }
  }

  export namespace mimc7 {
    export function multiHash(inputs: bigint[], key?: bigint): bigint;
  }

  export function poseidon(inputs: bigint[]): bigint;
}
