import { Course, CourseCategory, ApecCountry } from "./courses-types";
import { CredentialType } from "./types";

export const SAMPLE_COURSES: Course[] = [
  {
    id: "blockchain-101",
    title: "Blockchain Fundamentals",
    description: "Learn the basics of blockchain technology, cryptocurrencies, and decentralized applications. Perfect for beginners in the Web3 space.",
    thumbnailUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
    category: CourseCategory.Technology,
    country: ApecCountry.Singapore,
    institution: "National University of Singapore",
    instructor: "Dr. Wei Zhang",
    duration: 180, // 3 hours
    credentialType: CredentialType.Course,
    passingScore: 80,
    lessons: [
      {
        id: "lesson-1",
        title: "What is Blockchain?",
        description: "Introduction to blockchain technology and its core concepts",
        videoUrl: "https://www.youtube.com/embed/SSo_EIwHSd4",
        duration: 15,
        order: 1,
        quiz: [
          {
            id: "q1",
            question: "What is a blockchain?",
            options: [
              "A centralized database",
              "A distributed ledger technology",
              "A type of cryptocurrency",
              "A programming language"
            ],
            correctAnswer: 1,
            explanation: "Blockchain is a distributed ledger technology that records transactions across multiple computers."
          },
          {
            id: "q2",
            question: "What makes blockchain secure?",
            options: [
              "Central authority",
              "Passwords",
              "Cryptographic hashing and consensus",
              "Firewalls"
            ],
            correctAnswer: 2,
            explanation: "Blockchain security comes from cryptographic hashing and consensus mechanisms."
          },
          {
            id: "q3",
            question: "Which of these is a key feature of blockchain?",
            options: [
              "Centralization",
              "Immutability",
              "Easy to modify",
              "Single point of failure"
            ],
            correctAnswer: 1,
            explanation: "Immutability - once data is written, it cannot be changed - is a key feature of blockchain."
          },
          {
            id: "q4",
            question: "What is a block in blockchain?",
            options: [
              "A type of cryptocurrency",
              "A container of transactions",
              "A mining machine",
              "A wallet"
            ],
            correctAnswer: 1,
            explanation: "A block is a container that holds a batch of validated transactions."
          },
          {
            id: "q5",
            question: "What connects blocks in a blockchain?",
            options: [
              "Physical cables",
              "Cryptographic hashes",
              "Wi-Fi",
              "Bluetooth"
            ],
            correctAnswer: 1,
            explanation: "Each block contains the hash of the previous block, creating a chain."
          }
        ]
      },
      {
        id: "lesson-2",
        title: "How Blockchain Works",
        description: "Understanding blocks, transactions, and consensus mechanisms",
        videoUrl: "https://www.youtube.com/embed/SSo_EIwHSd4",
        duration: 20,
        order: 2,
        quiz: [
          {
            id: "q1",
            question: "What is a consensus mechanism?",
            options: [
              "A way to mine Bitcoin",
              "A method for network participants to agree on the state of the ledger",
              "A type of wallet",
              "A programming language"
            ],
            correctAnswer: 1
          },
          {
            id: "q2",
            question: "What is Proof of Work (PoW)?",
            options: [
              "A job certificate",
              "A consensus algorithm requiring computational work",
              "A type of cryptocurrency",
              "A smart contract"
            ],
            correctAnswer: 1
          },
          {
            id: "q3",
            question: "What happens when a block is added to the chain?",
            options: [
              "It can be easily deleted",
              "It becomes permanent and immutable",
              "It disappears after 24 hours",
              "Only the creator can see it"
            ],
            correctAnswer: 1
          },
          {
            id: "q4",
            question: "What is a node in a blockchain network?",
            options: [
              "A point in a graph",
              "A computer that maintains a copy of the blockchain",
              "A type of cryptocurrency",
              "A mining reward"
            ],
            correctAnswer: 1
          },
          {
            id: "q5",
            question: "What is double-spending?",
            options: [
              "Spending money twice on different items",
              "Using the same digital currency in two different transactions",
              "Buying two of the same item",
              "Donating money twice"
            ],
            correctAnswer: 1,
            explanation: "Double-spending is attempting to use the same digital currency in multiple transactions, which blockchain prevents."
          }
        ]
      },
      {
        id: "lesson-3",
        title: "Blockchain Use Cases",
        description: "Real-world applications of blockchain beyond cryptocurrency",
        videoUrl: "https://www.youtube.com/embed/SSo_EIwHSd4",
        duration: 25,
        order: 3,
        quiz: [
          {
            id: "q1",
            question: "Which is NOT a common blockchain use case?",
            options: [
              "Supply chain tracking",
              "Digital identity",
              "Weather prediction",
              "Smart contracts"
            ],
            correctAnswer: 2
          },
          {
            id: "q2",
            question: "What is a smart contract?",
            options: [
              "A legal document",
              "Self-executing code on the blockchain",
              "A type of cryptocurrency",
              "A mining algorithm"
            ],
            correctAnswer: 1
          },
          {
            id: "q3",
            question: "How can blockchain improve supply chains?",
            options: [
              "Makes them slower",
              "Provides transparency and traceability",
              "Increases costs",
              "Removes all workers"
            ],
            correctAnswer: 1
          },
          {
            id: "q4",
            question: "What is DeFi?",
            options: [
              "Decentralized Finance",
              "Digital Efficiency",
              "Data Formatting",
              "Distributed Files"
            ],
            correctAnswer: 0
          },
          {
            id: "q5",
            question: "Can blockchain be used for voting systems?",
            options: [
              "No, it's only for money",
              "Yes, for transparent and tamper-proof voting",
              "Only in some countries",
              "Only for small groups"
            ],
            correctAnswer: 1
          }
        ]
      }
    ]
  },
  {
    id: "solana-development",
    title: "Solana Smart Contract Development",
    description: "Master building decentralized applications on Solana using Rust and Anchor framework.",
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop",
    category: CourseCategory.Technology,
    country: ApecCountry.USA,
    institution: "Stanford University",
    instructor: "Prof. Sarah Chen",
    duration: 240,
    credentialType: CredentialType.Course,
    passingScore: 80,
    lessons: [
      {
        id: "lesson-1",
        title: "Introduction to Solana",
        description: "Learn about Solana's architecture and advantages",
        videoUrl: "https://www.youtube.com/embed/1jzROE6EhxM",
        duration: 20,
        order: 1,
        quiz: [
          {
            id: "q1",
            question: "What is Solana's main advantage?",
            options: [
              "High transaction fees",
              "High speed and low cost",
              "Centralization",
              "Complex programming"
            ],
            correctAnswer: 1
          },
          {
            id: "q2",
            question: "What programming language is used for Solana smart contracts?",
            options: [
              "JavaScript",
              "Python",
              "Rust",
              "Java"
            ],
            correctAnswer: 2
          },
          {
            id: "q3",
            question: "What is Proof of History?",
            options: [
              "A history textbook",
              "Solana's innovative consensus mechanism",
              "A type of NFT",
              "A wallet type"
            ],
            correctAnswer: 1
          },
          {
            id: "q4",
            question: "What is the native token of Solana?",
            options: [
              "ETH",
              "BTC",
              "SOL",
              "USDC"
            ],
            correctAnswer: 2
          },
          {
            id: "q5",
            question: "What is Anchor framework used for?",
            options: [
              "Building websites",
              "Simplifying Solana smart contract development",
              "Mining cryptocurrency",
              "Creating wallets"
            ],
            correctAnswer: 1
          }
        ]
      },
      {
        id: "lesson-2",
        title: "Setting Up Solana Development Environment",
        description: "Install tools and create your first Solana program",
        videoUrl: "https://www.youtube.com/embed/1jzROE6EhxM",
        duration: 30,
        order: 2,
        quiz: [
          {
            id: "q1",
            question: "What CLI tool is used for Solana development?",
            options: [
              "npm",
              "solana-cli",
              "truffle",
              "hardhat"
            ],
            correctAnswer: 1
          },
          {
            id: "q2",
            question: "What is a devnet?",
            options: [
              "The main network",
              "A test network for development",
              "A mining pool",
              "A wallet"
            ],
            correctAnswer: 1
          },
          {
            id: "q3",
            question: "How do you get SOL on devnet?",
            options: [
              "Buy it",
              "Mine it",
              "Use an airdrop faucet",
              "Steal it"
            ],
            correctAnswer: 2
          },
          {
            id: "q4",
            question: "What is a Solana account?",
            options: [
              "An email account",
              "A data storage unit on-chain",
              "A social media profile",
              "A bank account"
            ],
            correctAnswer: 1
          },
          {
            id: "q5",
            question: "What file format are Solana programs deployed as?",
            options: [
              ".exe",
              ".js",
              ".so",
              ".zip"
            ],
            correctAnswer: 2
          }
        ]
      }
    ]
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing for APEC Markets",
    description: "Learn digital marketing strategies tailored for Asia-Pacific markets and cross-border e-commerce.",
    thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    category: CourseCategory.Business,
    country: ApecCountry.Japan,
    institution: "Tokyo Business School",
    instructor: "Ms. Yuki Tanaka",
    duration: 150,
    credentialType: CredentialType.Course,
    passingScore: 80,
    lessons: [
      {
        id: "lesson-1",
        title: "Understanding APEC Digital Landscape",
        description: "Market research and consumer behavior in APEC countries",
        videoUrl: "https://www.youtube.com/embed/SSo_EIwHSd4",
        duration: 25,
        order: 1,
        quiz: [
          {
            id: "q1",
            question: "What is the largest e-commerce market in APEC?",
            options: [
              "USA",
              "China",
              "Japan",
              "Australia"
            ],
            correctAnswer: 1
          },
          {
            id: "q2",
            question: "What is important when marketing across APEC countries?",
            options: [
              "Use the same strategy everywhere",
              "Understand cultural differences",
              "Only focus on price",
              "Ignore local languages"
            ],
            correctAnswer: 1
          },
          {
            id: "q3",
            question: "Which platform is popular for social commerce in Southeast Asia?",
            options: [
              "LinkedIn",
              "Twitter",
              "TikTok and Instagram",
              "Reddit"
            ],
            correctAnswer: 2
          },
          {
            id: "q4",
            question: "What is cross-border e-commerce?",
            options: [
              "Shopping at physical stores",
              "Selling products internationally online",
              "Local delivery only",
              "B2B transactions"
            ],
            correctAnswer: 1
          },
          {
            id: "q5",
            question: "What payment method is widely used in China?",
            options: [
              "PayPal only",
              "Cash on delivery only",
              "WeChat Pay and Alipay",
              "Credit cards only"
            ],
            correctAnswer: 2
          }
        ]
      },
      {
        id: "lesson-2",
        title: "Social Media Marketing Strategies",
        description: "Effective social media campaigns for Asia-Pacific audiences",
        videoUrl: "https://www.youtube.com/embed/SSo_EIwHSd4",
        duration: 30,
        order: 2,
        quiz: [
          {
            id: "q1",
            question: "What is influencer marketing?",
            options: [
              "Advertising on TV",
              "Partnering with social media personalities to promote products",
              "Email campaigns",
              "Billboard advertising"
            ],
            correctAnswer: 1
          },
          {
            id: "q2",
            question: "What is engagement rate?",
            options: [
              "Number of followers",
              "Likes, comments, and shares divided by reach",
              "Amount of money spent",
              "Number of posts"
            ],
            correctAnswer: 1
          },
          {
            id: "q3",
            question: "Which content type performs best on social media?",
            options: [
              "Long text posts",
              "Video content",
              "Static images only",
              "Links with no description"
            ],
            correctAnswer: 1
          },
          {
            id: "q4",
            question: "What is A/B testing?",
            options: [
              "Testing two versions to see which performs better",
              "Testing on Mondays and Tuesdays",
              "Testing with students",
              "Testing in alphabetical order"
            ],
            correctAnswer: 0
          },
          {
            id: "q5",
            question: "When is the best time to post on social media?",
            options: [
              "Always at midnight",
              "When your target audience is most active",
              "Random times",
              "Only on weekends"
            ],
            correctAnswer: 1
          }
        ]
      }
    ]
  }
];
