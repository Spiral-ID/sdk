pragma circom 2.0.0;

// Circuito para Proof-of-Humanity usando Zero-Knowledge Proofs
// Prova que o usuário conhece uma assinatura válida sem revelar a assinatura

include "node_modules/circomlib/circuits/eddsamimc.circom";
include "node_modules/circomlib/circuits/mimc.circom";

// Template principal para Proof-of-Humanity
template ProofOfHumanity() {
    signal input messageHash; // Hash da mensagem que foi assinada
    signal input pubKeyX;     // Chave pública X do usuário
    signal input pubKeyY;     // Chave pública Y do usuário
    signal input R8x;         // Componente R8 da assinatura
    signal input R8y;         // Componente R8 da assinatura
    signal input S;          // Componente S da assinatura
    
    signal output verified;   // Saída: 1 se verificado, 0 caso contrário

    // Verificar a assinatura EdDSA com MiMC
    component verifier = EdDSAMiMCVerifier();
    
    verifier.enabled <== 1;
    verifier.Ax <== pubKeyX;
    verifier.Ay <== pubKeyY;
    verifier.R8x <== R8x;
    verifier.R8y <== R8y;
    verifier.S <== S;
    verifier.M <== messageHash;

    // Se a verificação passar, output = 1
    verified <== verifier.out;
}

// Template para gerar proof de idade mínima (exemplo: maior de 18 anos)
template AgeProof(minAge) {
    signal input age;          // Idade real (privada)
    signal input currentYear; // Ano atual (público)
    signal input birthYear;    // Ano de nascimento (privado)
    
    signal output isAdult;    // 1 se maior de idade, 0 caso contrário

    // Verificar se age >= minAge sem revelar a idade exata
    component ageCheck = GreaterEqThan(32);
    ageCheck.in[0] <== age;
    ageCheck.in[1] <== minAge;
    
    // Verificar consistência: age == currentYear - birthYear
    component yearDiff = Subtract(32);
    yearDiff.in[0] <== currentYear;
    yearDiff.in[1] <== birthYear;
    
    component ageConsistency = Equal(32);
    ageConsistency.in[0] <== age;
    ageConsistency.in[1] <== yearDiff.out;
    
    // A idade é válida se for >= minAge e consistente
    isAdult <== ageCheck.out * ageConsistency.out;
}

// Circuito principal que combina proof-of-humanity com atributos
template SpiralIDProof() {
    signal input messageHash;
    signal input pubKeyX;
    signal input pubKeyY;
    signal input R8x;
    signal input R8y;
    signal input S;
    signal input age;          // Opcional: prova de idade
    signal input currentYear; // Ano atual
    signal input birthYear;   // Ano nascimento
    
    signal output humanVerified;
    signal output isAdult;

    // Proof-of-Humanity básico
    component humanityProof = ProofOfHumanity();
    humanityProof.messageHash <== messageHash;
    humanityProof.pubKeyX <== pubKeyX;
    humanityProof.pubKeyY <== pubKeyY;
    humanityProof.R8x <== R8x;
    humanityProof.R8y <== R8y;
    humanityProof.S <== S;
    
    humanVerified <== humanityProof.verified;

    // Proof de idade (opcional)
    component ageProof = AgeProof(18);
    ageProof.age <== age;
    ageProof.currentYear <== currentYear;
    ageProof.birthYear <== birthYear;
    
    isAdult <== ageProof.isAdult;
}

// Componentes auxiliares
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