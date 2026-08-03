import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const projectsToSeed = [
  {
    repoName: "Loomi-Brain",
    repoUrl: "https://github.com/GregB712/Loomi-Brain",
    deploymentUrl: null,
    title: "Loomi Brain",
    slug: "loomi-brain",
    description:
      "An AI knowledge/reasoning system focused on intelligent information retrieval, memory, and assistant-like workflows.",
    longDescription: "Editable later from the admin dashboard.",
    problemSolved:
      "Explores how AI systems can retrieve, organize, and reason over information in assistant-like workflows.",
    technicalHighlights: [
      "LLM-powered information retrieval",
      "Memory-oriented architecture",
      "Assistant-style workflows",
      "Designed for extensibility"
    ],
    tags: ["Generative AI", "RAG", "Agents", "LLMs", "Memory", "Retrieval"],
    category: ["GenAI", "Retrieval", "Agents"],
    featured: true,
    priority: 1,
    status: "featured"
  },
  {
    repoName: "would_you_rather_app",
    repoUrl: "https://github.com/GregB712/would_you_rather_app",
    deploymentUrl: null,
    title: "Would You Rather App",
    slug: "would-you-rather-app",
    description:
      "A full-stack Next.js game with PostgreSQL-backed questions, voting, mode selection, Prisma migrations, seed/import tooling, and database-level duplicate prevention.",
    longDescription:
      "A polished full-stack application showcasing product thinking, backend modeling, database management, and interactive UX.",
    problemSolved:
      "Provides an engaging question-based voting game with persistent data and scalable question management.",
    technicalHighlights: [
      "Next.js full-stack app",
      "PostgreSQL database",
      "Prisma schema and migrations",
      "Question import and seed tooling",
      "Database-level duplicate prevention",
      "Vercel/Neon-ready deployment"
    ],
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Full-stack", "Vercel", "Neon"],
    category: ["Full-stack"],
    featured: true,
    priority: 2,
    status: "featured"
  },
  {
    repoName: "custom-retrieval-pipeline-with-reranker",
    repoUrl: "https://github.com/GregB712/custom-retrieval-pipeline-with-reranker",
    deploymentUrl: null,
    title: "Custom Retrieval Pipeline with Reranker",
    slug: "custom-retrieval-pipeline-with-reranker",
    description:
      "End-to-end local retrieval pipeline with BM25, FAISS dense search, hybrid ranking, a custom scikit-learn feature reranker, evaluation metrics, CLI tooling, and Streamlit demo.",
    longDescription:
      "A practical information retrieval project demonstrating hybrid search, reranking, evaluation, and local-first retrieval architecture.",
    problemSolved:
      "Improves document retrieval quality by combining sparse search, dense search, and learned reranking.",
    technicalHighlights: [
      "BM25 sparse retrieval",
      "FAISS dense vector search",
      "Hybrid ranking pipeline",
      "Custom scikit-learn reranker",
      "Evaluation metrics",
      "CLI and Streamlit demo"
    ],
    tags: [
      "Python",
      "BM25",
      "FAISS",
      "Hybrid Search",
      "Reranking",
      "scikit-learn",
      "Streamlit",
      "Information Retrieval"
    ],
    category: ["Retrieval", "ML Infrastructure", "NLP"],
    featured: true,
    priority: 3,
    status: "featured"
  },
  {
    repoName: "custom-vector-db",
    repoUrl: "https://github.com/GregB712/custom-vector-db",
    deploymentUrl: null,
    title: "Custom Vector Database",
    slug: "custom-vector-db",
    description:
      "A lightweight educational vector database built from scratch in Python, featuring dense vector storage, metadata filtering, exact similarity search, graph-based approximate search, and JSON persistence.",
    longDescription:
      "A from-scratch vector database implementation that demonstrates understanding of similarity search internals and vector storage design.",
    problemSolved:
      "Shows how vector databases work internally, including indexing, metadata filtering, and approximate search.",
    technicalHighlights: [
      "Dense vector storage",
      "Metadata filtering",
      "Exact similarity search",
      "Graph-based approximate search",
      "JSON persistence",
      "Educational database internals"
    ],
    tags: ["Python", "Vector Database", "ANN Search", "Similarity Search", "Metadata Filtering", "Algorithms"],
    category: ["ML Infrastructure", "Retrieval"],
    featured: true,
    priority: 4,
    status: "featured"
  },
  {
    repoName: "custom_embedding_model",
    repoUrl: "https://github.com/GregB712/custom_embedding_model",
    deploymentUrl: null,
    title: "Custom Embedding Model",
    slug: "custom-embedding-model",
    description:
      "Fine-tuning domain-adaptive Sentence-BERT embedding models for semantic search, retrieval, product search, support ticket matching, and job/CV matching.",
    longDescription:
      "A semantic search and representation learning project focused on adapting embedding models to domain-specific retrieval tasks.",
    problemSolved:
      "Improves matching and retrieval quality by fine-tuning embeddings for specific domains and similarity tasks.",
    technicalHighlights: [
      "Sentence-BERT fine-tuning",
      "Domain-adaptive embeddings",
      "Semantic search workflows",
      "Retrieval evaluation",
      "Multiple practical matching use cases"
    ],
    tags: ["Python", "Sentence-BERT", "Embeddings", "Semantic Search", "Fine-tuning", "NLP", "Retrieval"],
    category: ["NLP", "Retrieval", "ML"],
    featured: true,
    priority: 5,
    status: "featured"
  },
  {
    repoName: "custom-bpe-tokenizer",
    repoUrl: "https://github.com/GregB712/custom-bpe-tokenizer",
    deploymentUrl: null,
    title: "Custom BPE Tokenizer",
    slug: "custom-bpe-tokenizer",
    description:
      "Advanced tokenizer engineering project implementing BPE, byte-level BPE, WordPiece, and SentencePiece-style unigram tokenization, with benchmarking against Hugging Face tokenizers and API/demo tooling.",
    longDescription:
      "A tokenizer engineering project showing low-level NLP infrastructure knowledge and practical benchmarking.",
    problemSolved:
      "Explains and implements the core tokenization algorithms behind modern language models.",
    technicalHighlights: [
      "BPE implementation",
      "Byte-level BPE",
      "WordPiece tokenizer",
      "SentencePiece-style unigram tokenizer",
      "Benchmarking against Hugging Face tokenizers",
      "API/demo tooling"
    ],
    tags: ["Python", "NLP", "Tokenization", "BPE", "WordPiece", "SentencePiece", "Hugging Face", "FastAPI"],
    category: ["NLP", "ML Infrastructure"],
    featured: true,
    priority: 6,
    status: "featured"
  },
  {
    repoName: "pdf-to-markdown-ai-converter",
    repoUrl: "https://github.com/GregB712/pdf-to-markdown-ai-converter",
    deploymentUrl: null,
    title: "PDF to Markdown AI Converter",
    slug: "pdf-to-markdown-ai-converter",
    description:
      "A TypeScript AI-powered tool for converting PDF documents into clean Markdown for downstream documentation, knowledge-base, or RAG workflows.",
    longDescription:
      "A document processing tool focused on transforming PDFs into clean, structured Markdown for AI and knowledge-base pipelines.",
    problemSolved:
      "Makes PDFs easier to use in documentation systems, knowledge bases, and RAG pipelines.",
    technicalHighlights: [
      "PDF document processing",
      "Markdown conversion",
      "AI-assisted cleaning",
      "RAG preparation workflow",
      "TypeScript-based tooling"
    ],
    tags: ["TypeScript", "PDF Processing", "Markdown", "AI Tools", "Document Processing", "RAG Preparation"],
    category: ["AI Tools", "Document Processing", "RAG"],
    featured: true,
    priority: 7,
    status: "featured"
  }
] satisfies Prisma.ProjectCreateInput[];

async function main() {
  const force = process.argv.includes("--force");
  const archiveMissing = process.argv.includes("--archive-missing");
  const seededRepoNames = new Set(projectsToSeed.map((project) => project.repoName));

  for (const project of projectsToSeed) {
    await prisma.project.upsert({
      where: { repoName: project.repoName },
      create: project,
      update: force
        ? project
        : {
            repoUrl: project.repoUrl,
            title: project.title,
            slug: project.slug,
            description: project.description
          }
    });
  }

  if (archiveMissing) {
    await prisma.project.updateMany({
      where: { repoName: { notIn: Array.from(seededRepoNames) } },
      data: { status: "archived", featured: false }
    });
  }

  console.log(`Seeded ${projectsToSeed.length} projects.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
