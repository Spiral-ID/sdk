declare module 'snarkjs' {
  export interface Groth16Proof {
    pi_a: [string, string, string];
    pi_b: [[string, string], [string, string], [string, string]];
    pi_c: [string, string, string];
    protocol: string;
    curve: string;
  }

  export interface PublicSignals {
    [key: string]: string;
  }

  export interface FullProof {
    proof: Groth16Proof;
    publicSignals: string[];
  }

  export interface VerificationKey {
    protocol: string;
    curve: string;
    nPublic: number;
    vk_alpha_1: [string, string];
    vk_beta_2: [[string, string], [string, string]];
    vk_gamma_2: [[string, string], [string, string]];
    vk_delta_2: [[string, string], [string, string]];
    IC: [string, string][];
  }

  export namespace groth16 {
    export function fullProve(
      inputs: any,
      wasmFile: string,
      zkeyFile: string
    ): Promise<FullProof>;

    export function verify(
      vk: VerificationKey,
      publicSignals: string[],
      proof: Groth16Proof
    ): Promise<boolean>;
  }

  export namespace zKey {
    export function exportVerificationKey(zkeyPath: string): Promise<VerificationKey>;
  }
}