# APEC Learner Passport 🎓

> Learn, Earn & Own Your Educational Credentials on Solana Blockchain

A comprehensive blockchain-powered learning and credentialing platform for APEC students. Students can enroll in courses from universities across 21 APEC economies, complete video lessons and quizzes, and automatically receive NFT-based credentials on the Solana blockchain upon course completion.

## 🌟 The Problem

Students across the APEC region face significant challenges:

- **3-6 month delays** in credential verification for cross-border opportunities
- **High costs** ($50-200 per verification)
- **Fraud vulnerability** in traditional paper-based systems
- **Lack of student ownership** - credentials controlled by institutions
- **Limited mobility** between APEC member economies

**Impact:** These barriers affect **25 million APEC students annually** across 21 member economies, hindering education mobility, scholarship opportunities, and job prospects.

## 💡 Our Solution

An end-to-end platform combining:

### 🎯 Learning Management System
- Interactive video-based courses from APEC institutions
- Integrated quizzes and assessments
- Real-time progress tracking
- Multi-category course catalog (Blockchain, Development, Marketing, etc.)
- Filter by country and category

### 🔐 Blockchain Credential System
- **Automated NFT minting** upon course completion
- **Instant verification** (<2 seconds)
- **Fraud-proof** - immutable blockchain records
- **Self-sovereign** - students own their credentials
- **Cross-border recognition** across all 21 APEC economies
- **Privacy-preserving** - share only what you need

## ✨ Key Features

### For Students
- ✅ Browse and enroll in courses from APEC universities
- ✅ Complete video lessons and quizzes at your own pace
- ✅ Automatically receive NFT credentials upon completion
- ✅ View all credentials in your personal wallet
- ✅ Share verifiable credentials with employers/institutions instantly

### For Institutions
- ✅ Issue tamper-proof credentials on-chain
- ✅ Reduce administrative overhead
- ✅ Enhance institution reputation through blockchain verification
- ✅ Track issued credentials and revoke if needed

### For Employers/Verifiers
- ✅ Verify credentials instantly via blockchain
- ✅ No middleman or verification fees
- ✅ 100% authenticity guaranteed
- ✅ Check credential status (active/revoked)

## 🏗️ How It Works

```
┌─────────────────┐
│  1. ENROLL      │  Student browses courses and enrolls
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  2. LEARN       │  Complete video lessons and pass quizzes
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  3. AUTO-MINT   │  NFT credential automatically minted to wallet
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  4. VERIFY      │  Anyone can verify instantly on blockchain
└─────────────────┘
```

### Detailed Workflow

1. **Student Enrollment**
   - Browse course catalog filtered by category/country
   - Click "Enroll" to start learning
   - Progress saved locally

2. **Learning Experience**
   - Watch video lessons (YouTube embedded)
   - Take quizzes after each lesson
   - Must pass quiz (80%+) to complete lesson
   - Track progress in real-time

3. **Automatic Credential Issuance**
   - Complete all lessons and quizzes
   - System automatically triggers NFT minting
   - Credential appears in student's wallet
   - Includes metadata: course name, institution, completion date, skills

4. **Verification**
   - Share credential mint address or wallet address
   - Verifier checks blockchain in <2 seconds
   - View credential details, issuer, and authenticity

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Jotai** - State management for learning progress
- **Lucide React** - Icons
- **Radix UI** - Accessible components

### Blockchain
- **Solana** - High-performance blockchain
- **Anchor Framework** - Rust-based smart contract framework
- **@solana/web3.js** - Solana JavaScript SDK
- **@solana/wallet-adapter** - Wallet integration
- **@solana/spl-token** - Token program interaction

### Smart Contract Features
- Credential registry initialization
- Authorized issuer management
- NFT credential minting
- Credential revocation
- On-chain metadata storage

## 📁 Project Structure

```
apec-learner-passport/
├── anchor/                          # Solana smart contracts
│   ├── programs/
│   │   └── apec_learner_passport/   # Main credential program
│   │       ├── src/
│   │       │   ├── lib.rs           # Program entrypoint
│   │       │   ├── instructions/    # Program instructions
│   │       │   └── state/           # Account structures
│   └── tests/                       # Program tests
│
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── page.tsx                 # Landing page
│   │   ├── courses/                 # Course listing & detail
│   │   ├── credentials/             # View user credentials
│   │   ├── mint/                    # Manual mint interface
│   │   └── verify/                  # Credential verification
│   │
│   ├── components/                  # React components
│   │   ├── Navbar.tsx
│   │   ├── WalletConnect.tsx
│   │   ├── CredentialCard.tsx
│   │   └── WalletProvider.tsx
│   │
│   └── lib/                         # Utilities & data
│       ├── courses-data.ts          # Sample course content
│       ├── courses-types.ts         # Learning types
│       ├── course-progress-store.ts # State management
│       ├── types.ts                 # Credential types
│       ├── anchor-setup.ts          # Solana connection
│       └── solana.ts                # Blockchain utilities
│
├── scripts/                         # Setup & utility scripts
│   ├── initialize-registry.ts       # Initialize credential registry
│   ├── add-issuer.ts                # Add authorized issuer
│   ├── check-status.ts              # Check registry status
│   └── airdrop.ts                   # Request devnet SOL
│
└── public/                          # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Solana CLI tools
- Anchor CLI (v0.31.1+)
- A Solana wallet (Phantom, Solflare, etc.)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/apec-learner-passport.git
cd apec-learner-passport
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

### Smart Contract Setup

1. **Build the Anchor program**
```bash
pnpm anchor-build
```

2. **Deploy to Devnet**
```bash
pnpm anchor deploy --provider.cluster devnet
```

3. **Initialize the credential registry**
```bash
pnpm setup:init
```

4. **Add an authorized issuer** (optional)
```bash
pnpm setup:add-issuer
```

5. **Check registry status**
```bash
pnpm setup:status
```

### Running the Application

1. **Start development server**
```bash
pnpm dev
```

2. **Open browser**
```
http://localhost:3000
```

3. **Connect your wallet**
   - Click "Connect Wallet" in the navbar
   - Approve connection
   - Request devnet SOL if needed: `pnpm airdrop`

### Testing the Full Flow

1. **Browse Courses**
   - Navigate to "Courses" page
   - Filter by category or country
   - Click on a course to view details

2. **Enroll and Learn**
   - Click "Enroll in Course"
   - Complete video lessons
   - Take and pass quizzes (80%+ required)

3. **Receive Credential**
   - Complete all lessons
   - NFT automatically mints to your wallet
   - View in "My Credentials" page

4. **Verify Credential**
   - Go to "Verify" page
   - Enter mint address or student wallet
   - View credential details and authenticity

## 🧪 Development Commands

### Anchor (Smart Contracts)

```bash
# Build program
pnpm anchor-build

# Run tests
pnpm anchor-test

# Deploy to devnet
pnpm anchor deploy --provider.cluster devnet

# Start local validator
pnpm anchor-localnet

# Sync program keys
pnpm anchor keys sync
```

### Next.js (Frontend)

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Linting
pnpm lint

# Format code
pnpm format
```

### Utility Scripts

```bash
# Initialize credential registry
pnpm setup:init

# Add authorized issuer
pnpm setup:add-issuer

# Check registry status
pnpm setup:status

# Request devnet SOL
pnpm airdrop
```

## 📊 Smart Contract Architecture

### Programs

**apec_learner_passport**
- Manages credential registry
- Handles credential minting
- Tracks authorized issuers
- Supports credential revocation

### Instructions

1. `initialize_registry` - Set up credential system
2. `add_issuer` - Authorize institutions to mint
3. `mint_credential` - Issue NFT credential to student
4. `revoke_credential` - Revoke credential if needed

### Accounts

- **CredentialRegistry** - Global state, tracks admin
- **IssuerAccount** - Authorized institution info
- **CredentialAccount** - Individual credential data

## 🎓 Sample Courses

The platform includes 3 demo courses:

1. **Blockchain Fundamentals** (Singapore)
   - Introduction to Blockchain
   - Consensus Mechanisms
   - Smart Contracts

2. **Solana Development** (USA)
   - Solana Architecture
   - Building dApps
   - Anchor Framework

3. **Digital Marketing** (Japan)
   - Marketing Strategy
   - Social Media Marketing

Each course includes:
- Video lessons (YouTube embedded)
- 5-question multiple-choice quizzes
- Progress tracking
- Automatic credential upon completion

## 🌏 APEC Member Economies Supported

The platform supports credentials from all 21 APEC economies:

Australia, Brunei, Canada, Chile, China, Hong Kong, Indonesia, Japan, South Korea, Malaysia, Mexico, New Zealand, Papua New Guinea, Peru, Philippines, Russia, Singapore, Taiwan, Thailand, USA, Vietnam

## 📈 Impact Metrics

- **Target Users:** 25 million APEC students annually
- **Verification Speed:** From 3-6 months → <2 seconds (99.99% reduction)
- **Cost Reduction:** From $50-200 → ~$0.01 per verification
- **Coverage:** 21 APEC member economies
- **Security:** 100% fraud-proof via blockchain immutability

## 🔐 Security Features

- ✅ Blockchain immutability prevents tampering
- ✅ Multi-signature admin controls
- ✅ Authorized issuer whitelist
- ✅ Credential revocation capability
- ✅ On-chain verification
- ✅ Privacy-preserving (share only mint address)

## 🚧 Roadmap

### Phase 1 (Current)
- ✅ Basic learning platform
- ✅ Automated credential minting
- ✅ Credential verification
- ✅ Multi-course support

### Phase 2 (Q2 2025)
- [ ] Integration with real APEC universities
- [ ] Advanced quiz types (essay, coding challenges)
- [ ] Peer-to-peer course creation
- [ ] Credential marketplace

### Phase 3 (Q3 2025)
- [ ] Cross-chain credential portability
- [ ] AI-powered course recommendations
- [ ] Employer dashboard for bulk verification
- [ ] Mobile app (iOS/Android)

### Phase 4 (Q4 2025)
- [ ] Government partnerships across APEC
- [ ] Integration with scholarship platforms
- [ ] Advanced analytics for institutions
- [ ] Credential stacking and pathways

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Solana Foundation for blockchain infrastructure
- APEC Secretariat for cross-border education initiatives
- All open-source contributors

## 📞 Contact & Support

- **GitHub Issues:** [Report bugs](https://github.com/yourusername/apec-learner-passport/issues)
- **Email:** support@apeclearnerpassport.com
- **Twitter:** [@APECLearner](https://twitter.com/APECLearner)

## 🎯 Built For

This project was built for [Hackathon Name] to address critical challenges in APEC cross-border education mobility and credential verification.

---

**Made with ❤️ for 25 million APEC students**
