pragma circom 2.0.0;

// Circuit for Proof-of-Humanity using Zero-Knowledge Proofs
// Proves the user knows a valid signature without revealing it

include "node_modules/circomlib/circuits/eddsamimc.circom";
include "node_modules/circomlib/circuits/mimc.circom";

// Main template for Proof-of-Humanity
template ProofOfHumanity() {
    signal input messageHash; // Hash of the signed message
    signal input pubKeyX;     // User public key X
    signal input pubKeyY;     // User public key Y
    signal input R8x;         // Signature component R8x
    signal input R8y;         // Signature component R8y
    signal input S;          // Signature component S
    
    signal output verified;   // Output: 1 if verified, 0 otherwise

    // Verify the EdDSA signature with MiMC
    component verifier = EdDSAMiMCVerifier();
    
    verifier.enabled <== 1;
    verifier.Ax <== pubKeyX;
    verifier.Ay <== pubKeyY;
    verifier.R8x <== R8x;
    verifier.R8y <== R8y;
    verifier.S <== S;
    verifier.M <== messageHash;

    // If verification passes, output = 1
    verified <== verifier.out;
}

// Template to generate minimum-age proof (e.g., 18+)
template AgeProof(minAge) {
    signal input age;          // Actual age (private)
    signal input currentYear; // Current year (public)
    signal input birthYear;    // Birth year (private)
    
    signal output isAdult;    // 1 if adult, 0 otherwise

    // Check age >= minAge without revealing exact age
    component ageCheck = GreaterEqThan(32);
    ageCheck.in[0] <== age;
    ageCheck.in[1] <== minAge;
    
    // Consistency check: age == currentYear - birthYear
    component yearDiff = Subtract(32);
    yearDiff.in[0] <== currentYear;
    yearDiff.in[1] <== birthYear;
    
    component ageConsistency = Equal(32);
    ageConsistency.in[0] <== age;
    ageConsistency.in[1] <== yearDiff.out;
    
    // Age is valid if >= minAge and consistent
    isAdult <== ageCheck.out * ageConsistency.out;
}

// Main circuit that combines proof-of-humanity with attributes
template SpiralIDProof() {
    signal input messageHash;
    signal input pubKeyX;
    signal input pubKeyY;
    signal input R8x;
    signal input R8y;
    signal input S;
    signal input age;          // Optional: age proof
    signal input currentYear; // Current year
    signal input birthYear;   // Birth year
    
    signal output humanVerified;
    signal output isAdult;

    // Basic Proof-of-Humanity
    component humanityProof = ProofOfHumanity();
    humanityProof.messageHash <== messageHash;
    humanityProof.pubKeyX <== pubKeyX;
    humanityProof.pubKeyY <== pubKeyY;
    humanityProof.R8x <== R8x;
    humanityProof.R8y <== R8y;
    humanityProof.S <== S;
    
    humanVerified <== humanityProof.verified;

    // Optional age proof
    component ageProof = AgeProof(18);
    ageProof.age <== age;
    ageProof.currentYear <== currentYear;
    ageProof.birthYear <== birthYear;
    
    isAdult <== ageProof.isAdult;
}

// Helper components
template Equal(n) {
    signal input in[2];
    signal output out;
    
    component eq = IsEqual();
    eq.in[0] <== in[0];
    eq.in[1] <== in[1];
    
    out <== eq.out;
}

template GreaterEqThan(n) {
    signal input in[2];
    signal output out;
    
    component gt = GreaterThan(n);
    gt.in[0] <== in[0];
    gt.in[1] <== in[1];
    
    out <== gt.out;
}

template Subtract(n) {
    signal input in[2];
    signal output out;
    
    out <== in[0] - in[1];
}

export { ProofOfHumanity, AgeProof, SpiralIDProof };
