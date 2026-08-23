import { UNKNOWN, type Project } from "./schema";

/* ============================================================
   Five projects. One internship, four academic.

   Repository reality (confirmed 2026-08-24): exactly ONE project has
   a public repo. `links` is therefore an optional array, never a fixed
   set of slots -- a project without a repo renders no link row at all.
   No ghost buttons, no disabled states, no "private" badges. Absence
   must be invisible, because four cards where one has a link and three
   have holes reads as three failures next to one success.

   Because only one project is linked, the inline code excerpt is
   load-bearing, not decorative. It is the primary code evidence for
   any visitor who never opens GitHub.
   ============================================================ */

/**
 * Verbatim lines from Abhay's Election contract, with elisions marked
 * `// ...`. Nothing has been added, renamed or reformatted -- the
 * explanation lives in the caption, never as invented comments inside
 * his code.
 *
 * The Voter struct is deliberately outside this slice: it stores name
 * and phone on-chain, which is a real and well-known design tension in
 * blockchain voting. It is not presented as a flaw anywhere on the
 * site, but it does not need to be the first thing a reader meets.
 */
const dvotingDisplaySlice = `pragma solidity ^0.8.0;

contract Election {
    address public owner;
    address public admin;
    uint256 public electionId;

    // ...

    mapping(uint256 => mapping(uint256 => Candidate)) public candidateDetails;
    mapping(uint256 => mapping(address => Voter)) public voterDetails;
    mapping(uint256 => ElectionDetails) public electionDetails;

    mapping(uint256 => bool) public start;
    mapping(uint256 => bool) public end;

    // ...

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    function startNewElection() public onlyAdmin {
        electionId += 1;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner address cannot be zero");
        owner = newOwner;
    }

    function setAdmin(address newAdmin) public onlyOwner {
        require(newAdmin != address(0), "New admin address cannot be zero");
        admin = newAdmin;
    }
}`;

export const projects: Project[] = [
  {
    slug: "dvoting",
    name: "dVoting",
    subtitle: "Decentralized Voting System",
    context: "academic",
    dates: { start: "2026-01", end: "2026-03", label: "January – March 2026" },
    featured: true,
    what:
      "A decentralized voting application built on Ethereum's Sepolia Testnet, where the vote record lives on-chain rather than in a database controlled by one party.",
    why:
      "Voting systems ask people to trust whoever holds the results. This project asks a narrower question: what does the system look like when no single administrator can quietly rewrite the record?",
    technologies: [
      "Solidity",
      "Ethereum — Sepolia Testnet",
      "Smart contracts",
      "Web3 integration",
    ],
    contribution:
      "Designed and wrote the Election smart contract in Solidity, and integrated it with a front end through Web3 tooling.",
    functionality: [
      "Smart contracts enforcing transparent, tamper-proof voting without a central authority",
      "Separate owner and admin roles, each gating a different set of operations",
      "Multiple election sessions, with candidate, voter and election data scoped to an election ID",
      "Candidate registration and election setup restricted to the admin role",
      "Front-end interaction with the deployed contract via Web3 tooling",
    ],
    // No metrics, users, turnout, uptime or deployment scale exist in
    // this dataset. Stays UNKNOWN until something real is supplied.
    outcome: UNKNOWN,
    links: [
      {
        label: "github.com/char-abhay/dVoting",
        href: "https://github.com/char-abhay/dVoting",
        external: true,
      },
    ],
    codeExcerpt: {
      language: "solidity",
      source: "Election.sol",
      caption:
        "An excerpt from the Election contract — not the complete contract. The two modifiers separate owner-level from admin-level operations, and every piece of state is keyed by electionId so the contract supports repeated elections rather than one permanent one. Elisions are marked.",
      code: dvotingDisplaySlice,
    },
    challenges: [
      {
        title: "Role-based access control",
        body:
          "The system needed to distinguish owner-level actions from admin-level ones. The contract uses separate owner and admin roles with onlyOwner and onlyAdmin modifiers, which meant deciding which operations belong to each role — ownership transfer, admin assignment, candidate creation, election setup, and election-session management.",
      },
      {
        title: "Managing multiple election sessions",
        body:
          "Rather than treating the application as one permanent election, the design is built around an electionId. Candidate, voter and election-detail data are associated with the current session through mappings keyed by that ID, which meant keeping the current election state consistent while still allowing a new cycle to begin.",
      },
      {
        title: "Structuring data on-chain",
        body:
          "Candidates, voters, election details, counts and election state all had to be represented on-chain. Designing Solidity structs and mappings that could hold those relationships while still allowing the application to read back what it needed was a core implementation problem.",
      },
      {
        title: "Connecting contract logic to the application",
        body:
          "The project was not only a Solidity contract. It had to work as a complete decentralized application — front end, wallet interaction, contract deployment and network interaction all had to line up before any of the contract logic was reachable by a user.",
      },
    ],
  },

  {
    slug: "ai-chatbot",
    name: "AI Chatbot",
    context: "academic",
    dates: { start: "2026-05", end: "2026-05", label: "May 2026" },
    what:
      "A chatbot that interprets user queries and responds conversationally, built around natural language processing techniques.",
    why:
      "Built to work through how conversational flow is actually handled — how input is interpreted and how a response is selected — rather than treating a chat interface as a solved black box.",
    technologies: ["Natural language processing (NLP)", "AI fundamentals"],
    contribution:
      "Developed the chatbot and integrated NLP techniques to handle conversational flows.",
    functionality: [
      "Understands and responds to user queries",
      "NLP techniques handling conversational flow",
      "Designed for extensibility to further use cases including FAQs and task automation",
    ],
    outcome: UNKNOWN,
    links: [],
  },

  {
    slug: "object-detection-system",
    name: "Object Detection System",
    // The name would otherwise be misread. See `clarification`.
    subtitle: "Ultrasonic ranging and servo sweep · Arduino Uno",
    context: "academic",
    dates: { start: "2026-03", end: "2026-03", label: "March 2026" },
    what:
      "An IoT build that detects objects within a set distance using an Arduino Uno, an ultrasonic sensor and a servo motor.",
    why:
      "A physical instrument for a problem usually met in software: the sensor measures how long a pulse takes to return, and that timing becomes distance.",
    technologies: ["Arduino Uno", "Ultrasonic sensor", "Servo motor"],
    contribution:
      "Built the system and programmed the Arduino to process the sensor readings.",
    functionality: [
      "Ultrasonic sensor measures the distance to nearby objects",
      "Servo motor sweeps the sensor to scan the surrounding area",
      "Arduino processes the sensor data and identifies the presence and approximate location of objects",
    ],
    outcome: UNKNOWN,
    links: [],
    // Stated up front so the title never implies a capability the
    // project does not have. In 2026 "object detection" reads as
    // computer vision; this is ultrasonic ranging, a different
    // technique entirely.
    clarification:
      "This system detects objects by ultrasonic ranging and a servo sweep — not by computer vision or machine-learning inference.",
  },

  {
    slug: "digital-voting-machine",
    name: "Digital Voting Machine",
    context: "academic",
    dates: {
      start: "2025-10",
      end: "2025-11",
      label: "October – November 2025",
    },
    what:
      "A digital voting system with authentication, built around keeping the recorded votes intact and access controlled.",
    why:
      "The same problem dVoting later approached differently: a central system that has to be trusted, secured and kept consistent by its own mechanisms.",
    technologies: ["Authentication", "Data integrity mechanisms"],
    contribution:
      "Developed the voting system, including its authentication and data-integrity handling.",
    functionality: [
      "Authentication controlling who is able to vote",
      "Data integrity handling for recorded votes",
      "Basic security mechanisms",
    ],
    outcome: UNKNOWN,
    links: [],
  },

  {
    slug: "ecommerce-website",
    name: "E-commerce Website",
    // The only project carrying a professional context label,
    // which is what makes that label mean something.
    context: "internship",
    dates: { start: "2025-06", end: "2025-08", label: "June – August 2025" },
    what:
      "An e-commerce web platform with product listing, cart and a basic checkout flow, built during the EduPhoenix Solutions internship.",
    why:
      "The concrete build behind the internship — the work in which front-end and back-end concepts were applied and troubleshot under real project conditions.",
    technologies: ["HTML", "CSS", "JavaScript"],
    contribution: "Built the platform's product listing, cart and checkout flow.",
    functionality: ["Product listing", "Cart", "Basic checkout flow"],
    outcome: UNKNOWN,
    links: [],
  },
];

/** dVoting first (Abhay's own selection), then reverse-chronological. */
export const projectsOrdered: Project[] = [
  ...projects.filter((p) => p.featured),
  ...projects
    .filter((p) => !p.featured)
    .sort((a, b) => b.dates.start.localeCompare(a.dates.start)),
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
