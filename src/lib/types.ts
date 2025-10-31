import { PublicKey } from "@solana/web3.js";

// Credential Types
export enum CredentialType {
  Course = 0,
  Degree = 1,
  SkillBadge = 2,
}

export const CREDENTIAL_TYPE_LABELS = {
  [CredentialType.Course]: "Course Completion",
  [CredentialType.Degree]: "Degree",
  [CredentialType.SkillBadge]: "Skill Badge",
};

// Credential Data Interface
export interface Credential {
  mint: PublicKey;
  student: PublicKey;
  issuer: PublicKey;
  credentialType: CredentialType;
  issuedAt: number;
  isRevoked: boolean;
  name: string;
  symbol: string;
  uri: string;
}

// Form Data Interface
export interface MintCredentialFormData {
  studentWallet: string;
  name: string;
  courseTitle: string;
  institution: string;
  completionDate: string;
  credentialType: CredentialType;
  description: string;
  imageUrl?: string;
}

// Metadata for JSON storage
export interface CredentialMetadata {
  name: string;
  symbol: string;
  description: string;
  image?: string;
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties: {
    category: string;
    creators: Array<{
      address: string;
      share: number;
    }>;
  };
}
