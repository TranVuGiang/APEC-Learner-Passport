import { AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { PROGRAM_ID } from "./solana";
import IDL_JSON from "./idl.json";

// Import the actual IDL from anchor build
export const IDL: any = IDL_JSON;

export function getProgram(
  connection: Connection,
  wallet: AnchorWallet
): Program {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  return new Program(IDL, provider);
}

// Helper function to derive PDA addresses
export function getIssuerRegistryPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("issuer-registry")],
    new PublicKey(PROGRAM_ID)
  );
}

export function getCredentialMintPDA(
  issuer: PublicKey,
  student: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("credential"), issuer.toBuffer(), student.toBuffer()],
    new PublicKey(PROGRAM_ID)
  );
}

export function getMintPDA(credentialMintPDA: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("mint"), credentialMintPDA.toBuffer()],
    new PublicKey(PROGRAM_ID)
  );
}
