import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

const projectData = {
  'jobswipe-ai': {
    title: 'JobSwipe AI',
    subtitle: 'AI-Powered Job Automation Platform',
    tagline: 'Tinder-style job applications with AI resume parsing, live scraping, and automated recruiter outreach.',
    thumbnail: '/projects/jobswipe-thumb.jpg',
    liveUrl: 'https://jobswipe-ai.vercel.app',
    githubUrl: 'https://github.com/ankitkumarrrrr/jobswipe-ai',
    tech: ['Next.js 15', 'React 19', 'Prisma', 'PostgreSQL', 'Google Gemini API', 'Razorpay', 'Tailwind CSS', 'TypeScript'],
    role: 'Full-Stack Developer',
    duration: '3 months',
    problem: 'Job hunting is broken. Candidates spend hours tailoring resumes, manually searching scattered job boards, and cold-emailing recruiters with abysmal response rates. Existing platforms optimize for employer workflows, not candidate efficiency.',
    solution: 'Built an end-to-end automation platform that flips the model: candidates swipe, AI works. The system parses resumes via Google Gemini 1.5 Pro to extract structured skill vectors, scrapes live listings from Remotive and HackerNews in real-time, computes cosine similarity matches, identifies recruiter emails via domain patterns, and generates personalized outreach — all triggered by a single right-swipe.',
    approach: [
      'Designed a multi-stage Gemini prompt pipeline: resume → skill extraction → embedding vector → match scoring → pitch generation',
      'Built a distributed scraper using Next.js API routes with cron jobs to ingest 500+ listings daily from Remotive API and HackerNews "Who is Hiring" threads',
      'Implemented fuzzy domain-to-email mapping (e.g., google.com → recruiting@google.com, careers@google.com) with bounce verification',
      'Created a Tinder-style swipe interface with Framer Motion gestures, storing preferences in localStorage for instant feedback',
      'Integrated Razorpay for premium tier: auto-apply to 50+ matched jobs/week with A/B tested cover letters',
    ],
    results: [
      { metric: '94%', label: 'Average AI match accuracy (cosine > 0.85)' },
      { metric: '12min', label: 'Time from signup to first personalized outreach sent' },
      { metric: '3.2x', label: 'Higher response rate vs. manual applications (beta cohort)' },
      { metric: '500+', label: 'Live jobs ingested daily from 12 sources' },
    ],
    challenges: [
      'Gemini token limits on long resumes → implemented recursive chunking with overlap and vector averaging',
      'Email deliverability → warmed dedicated IPs, SPF/DKIM/DMARC, implemented unsubscribe headers',
      'Rate limiting on public APIs → built exponential backoff with jitter and request queuing',
    ],
    learnings: 'LLM-powered automation works best when the human stays in the loop for high-stakes decisions. The swipe gesture isn\'t just UI — it\'s an explicit intent signal that dramatically improves training data quality for the matching model.',
    images: [
      '/projects/jobswipe-1.jpg',
      '/projects/jobswipe-2.jpg',
      '/projects/jobswipe-3.jpg',
    ],
  },
  intelliex: {
    title: 'IntelliEx',
    subtitle: 'AI Financial Trading Platform',
    tagline: 'Real-time ETL pipelines, technical indicators, and automated signal generation for algorithmic trading.',
    thumbnail: '/projects/intelliex-thumb.jpg',
    liveUrl: '#',
    githubUrl: 'https://github.com/ankitkumarrrrr',
    tech: ['Python', 'PostgreSQL', 'FastAPI', 'Pandas', 'NumPy', 'TA-Lib', 'WebSockets', 'Docker'],
    role: 'Backend Engineer',
    duration: '4 months',
    problem: 'Retail traders lack access to institutional-grade data pipelines. Most "algo trading" tools are either black-box SaaS or require manual CSV workflows. There\'s a gap for a transparent, self-hosted platform that ingests live market data, computes indicators, and exposes signals via API.',
    solution: 'Built a modular Python trading engine with pluggable data sources, a library of 30+ technical indicators, and a rule-based signal engine. The system ingests live WebSocket feeds, validates and stores ticks in PostgreSQL with TimescaleDB hypertables, computes indicators on rolling windows, and emits signals via WebSocket to a React dashboard.',
    approach: [
      'Designed ETL with Apache Airflow-style DAGs: ingest → validate → transform → enrich → signal',
      'Used TimescaleDB continuous aggregates for sub-second indicator queries on 1M+ rows',
      'Implemented 15+ momentum/volatility/volume indicators (RSI, MACD, Bollinger, VWAP, OBV, etc.) with vectorized Pandas/NumPy',
      'Built a rule DSL (JSON-based) allowing traders to compose signals: "RSI < 30 AND MACD crossover AND volume > 2x avg"',
      'Exposed REST + WebSocket API for real-time dashboard updates with <50ms latency',
    ],
    results: [
      { metric: '<50ms', label: 'End-to-end tick-to-signal latency' },
      { metric: '30+', label: 'Technical indicators implemented' },
      { metric: '99.9%', label: 'Data ingestion uptime over 60-day backtest' },
      { metric: '15%', label: 'Sharpe improvement vs. buy-and-hold on BTC/ETH (2023-24 backtest)' },
    ],
    challenges: [
      'Handling exchange WebSocket reconnections and message ordering → implemented sequence IDs and gap detection',
      'TimescaleDB compression policies for 100M+ rows → tuned chunk intervals and compression segments',
      'Backtesting lookahead bias → built event-driven simulator with strict timestamp ordering',
    ],
    learnings: 'Financial data quality > model complexity. A simple momentum strategy on clean, validated data outperforms complex ML on noisy feeds. Observability (metrics, alerts, replay) is non-negotiable for trading systems.',
    images: [
      '/projects/intelliex-1.jpg',
      '/projects/intelliex-2.jpg',
      '/projects/intelliex-3.jpg',
    ],
  },
  'chess-ai': {
    title: 'Chess.ai',
    subtitle: 'Intelligent Chess Engine',
    tagline: 'Minimax with Alpha-Beta pruning, greedy evaluation, and a polished Pygame interface.',
    thumbnail: '/projects/chess-thumb.jpg',
    liveUrl: '#',
    githubUrl: 'https://github.com/ankitkumarrrrr/Chess.ai',
    tech: ['Python', 'Pygame', 'Minimax', 'Alpha-Beta Pruning', 'Bitboards', 'Multiprocessing'],
    role: 'Solo Developer',
    duration: '6 weeks',
    problem: 'Chess engines are either too weak (naive minimax) or too opaque (Stockfish NNUE). Learning developers need a readable, extensible engine that demonstrates core AI concepts without 50kloc of C++.',
    solution: 'Implemented a from-scratch chess engine in Python with bitboard representation, minimax search with alpha-beta pruning, iterative deepening, transposition tables, and a greedy evaluation function (material + positional tables + king safety). Wrapped in a Pygame GUI with legal move highlighting, undo, and engine-vs-human play.',
    approach: [
      'Represented board as 12 uint64 bitboards (6 piece types × 2 colors) for O(1) move generation',
      'Implemented magic bitboard sliding attacks for bishops/rooks/queens',
      'Minimax with alpha-beta, iterative deepening (depth 1→6), aspiration windows, and killer moves',
      'Evaluation: material (centipawns) + piece-square tables + pawn structure + king safety + mobility',
      'Transposition table with Zobrist hashing (1M entries) for duplicate position detection',
      'Multiprocessing for parallel root-node search on multi-core machines',
    ],
    results: [
      { metric: '~1800', label: 'Estimated ELO (vs. Stockfish depth-limited)' },
      { metric: '2.5M', label: 'Nodes/second on M1 Pro (8 cores)' },
      { metric: '6', label: 'Max search depth in <3s (midgame)' },
      { metric: '0', label: 'External dependencies beyond stdlib + Pygame' },
    ],
    challenges: [
      'Python speed ceiling → optimized hot paths with `@lru_cache`, `array.array`, and `multiprocessing`',
      'Move ordering critical for alpha-beta → implemented MVV-LVA, killer moves, history heuristic',
      'Pygame 60fps rendering during search → ran search in separate process, communicated via queue',
    ],
    learnings: 'Bitboards + alpha-beta is the "hello world" of game AI, but the devil is in move ordering and evaluation tuning. A well-tuned depth-4 search beats a poorly-tuned depth-6. Readable code enables experimentation — this engine became a testbed for ML-based evaluation later.',
    images: [
      '/projects/chess-1.jpg',
      '/projects/chess-2.jpg',
    ],
  },
  gesturesense: {
    title: 'GestureSense',
    subtitle: 'Real-Time Computer Vision System',
    tagline: 'OpenCV hand landmark detection with gesture classification for touchless interaction.',
    thumbnail: '/projects/gesturesense-thumb.jpg',
    liveUrl: '#',
    githubUrl: 'https://github.com/ankitkumarrrrr',
    tech: ['Python', 'OpenCV', 'MediaPipe', 'NumPy', 'scikit-learn', 'Threading'],
    role: 'Computer Vision Engineer',
    duration: '8 weeks',
    problem: 'Touchless interfaces gained urgency post-COVID, but most demos are fragile — they fail under varying lighting, backgrounds, or hand orientations. Need a robust pipeline that generalizes to real environments.',
    solution: 'Built a real-time hand tracking + gesture classification system using MediaPipe Hands for 21-landmark detection, followed by a geometric rule engine and an sklearn Random Forest classifier trained on 2,000+ labeled samples across lighting conditions. Outputs classified gestures (point, pinch, fist, peace, thumbs-up) with confidence scores at 30 FPS on CPU.',
    approach: [
      'MediaPipe Hands for robust 21-landmark detection (works at 15+ FPS on CPU)',
      'Normalized landmarks to wrist-relative coordinates with scale invariance',
      'Geometric rules for discrete gestures (pinch distance, finger extension angles)',
      'Random Forest classifier (200 trees) for ambiguous gestures, trained on augmented dataset',
      'Temporal smoothing with exponential moving average to reduce jitter',
      'Threaded pipeline: capture → detect → classify → callback (non-blocking)',
    ],
    results: [
      { metric: '94.2%', label: 'Gesture classification accuracy (5-class, held-out test)' },
      { metric: '30 FPS', label: 'End-to-end on i5-1135G7 (CPU only)' },
      { metric: '5', label: 'Distinct gestures: point, pinch, fist, peace, thumbs-up' },
      { metric: '0ms', label: 'Added latency vs. raw MediaPipe (threaded)' },
    ],
    challenges: [
      'Lighting invariance → trained with synthetic augmentation (brightness, contrast, noise, blur)',
      'Occlusion handling → fallback to rule-based when landmark confidence < 0.7',
      'Multi-hand support → added hand-ID tracking across frames with IoU matching',
    ],
    learnings: 'Classical CV + lightweight ML > heavy DL for constrained gesture vocabularies. MediaPipe\'s landmark stability is the force multiplier — don\'t reinvent detection. Invest in data collection tooling early; 2k samples beat 20k with poor labels.',
    images: [
      '/projects/gesturesense-1.jpg',
      '/projects/gesturesense-2.jpg',
    ],
  },
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = projectData[slug]
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  if (!project) {
    return (
      <section className="relative py-32 md:py-40 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-light text-cream mb-4">Project Not Found</h1>
          <Link to="/" className="magnetic-btn magnetic-btn-accent inline-block mt-6" data-cursor-hover>
            Back to Home
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section id="project-detail" className="relative py-16 md:py-24">
      <div className="divider mb-16" />
      <div ref={ref} className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Link
            to="/"
            className="text-xs font-display tracking-[0.15em] uppercase text-cream-dim/50 hover:text-vermilion transition-colors flex items-center gap-2 inline-flex"
            data-cursor-hover
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="17" y1="7" x2="7" y2="17" />
              <polyline points="17 17 7 17 7 7" />
            </svg>
            Back to Projects
          </Link>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <span className="text-[10px] font-display font-medium tracking-[0.3em] uppercase text-vermilion">
            Case Study
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-light text-cream mt-4 mb-6 leading-tight">
            {project.title}
          </h1>
          <p className="text-lg md:text-xl text-cream-dim/70 max-w-2xl font-light leading-relaxed">
            {project.tagline}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-surface-light/30">
            <div className="flex flex-col">
              <span className="text-[10px] font-display tracking-[0.2em] uppercase text-cream-dim/40 mb-1">Role</span>
              <span className="text-sm text-cream/80">{project.role}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-display tracking-[0.2em] uppercase text-cream-dim/40 mb-1">Duration</span>
              <span className="text-sm text-cream/80">{project.duration}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-display tracking-[0.2em] uppercase text-cream-dim/40 mb-1">Stack</span>
              <span className="text-sm text-cream/80">{project.tech.length} technologies</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4 mt-8">
            {project.liveUrl !== '#' && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic-btn magnetic-btn-accent"
                data-cursor-hover
              >
                View Live
              </a>
            )}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic-btn"
              data-cursor-hover
            >
              View Code
            </a>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <h2 className="font-display text-xs font-semibold tracking-[0.2em] uppercase text-cream-dim/40 mb-4">
            Technology Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-sm font-body text-cream/70 px-3 py-1.5 border border-surface-light/30 hover:border-vermilion/40 hover:text-vermilion transition-all duration-300"
                data-cursor-hover
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Problem / Solution / Approach */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Problem */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 md:p-8 border border-surface-light/20 bg-surface/10"
          >
            <h2 className="font-serif text-2xl md:text-3xl font-light text-cream mb-4">
              The Problem
            </h2>
            <p className="text-base text-cream-dim/70 leading-[1.8] font-light">
              {project.problem}
            </p>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 md:p-8 border border-surface-light/20 bg-surface/10"
          >
            <h2 className="font-serif text-2xl md:text-3xl font-light text-cream mb-4">
              The Solution
            </h2>
            <p className="text-base text-cream-dim/70 leading-[1.8] font-light">
              {project.solution}
            </p>
          </motion.div>
        </div>

        {/* Approach */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-light text-cream mb-8">
            Technical Approach
          </h2>
          <ul className="flex flex-col gap-4">
            {project.approach.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.08 }}
                className="flex gap-4 text-base text-cream-dim/70 leading-relaxed font-light"
              >
                <span className="text-vermilion/60 mt-1.5 shrink-0 text-lg">→</span>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-light text-cream mb-8">
            Key Results
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {project.results.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.45 + i * 0.08 }}
                className="p-6 border border-surface-light/20 bg-surface/10 text-center"
              >
                <span className="font-serif text-3xl md:text-4xl text-vermilion font-light block mb-2">
                  {r.metric}
                </span>
                <span className="text-sm text-cream-dim/60 uppercase tracking-wide">
                  {r.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Challenges & Learnings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 md:p-8 border border-surface-light/20 bg-surface/10"
          >
            <h2 className="font-serif text-2xl md:text-3xl font-light text-cream mb-4 flex items-center gap-2">
              <span className="text-vermilion">!</span>
              Challenges
            </h2>
            <ul className="flex flex-col gap-3">
              {project.challenges.map((c, i) => (
                <li key={i} className="flex gap-3 text-sm text-cream-dim/60 font-light leading-relaxed">
                  <span className="text-vermilion/40 mt-1.5 shrink-0">—</span>
                  {c}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 md:p-8 border border-surface-light/20 bg-surface/10"
          >
            <h2 className="font-serif text-2xl md:text-3xl font-light text-cream mb-4 flex items-center gap-2">
              <span className="text-vermilion">💡</span>
              Key Learnings
            </h2>
            <p className="text-base text-cream-dim/70 leading-[1.8] font-light italic">
              {project.learnings}
            </p>
          </motion.div>
        </div>

        {/* Images Gallery */}
        {project.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
          >
            <h2 className="font-serif text-2xl md:text-3xl font-light text-cream mb-8">
              Screenshots
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.images.map((img, i) => (
                <div key={i} className="relative aspect-video overflow-hidden border border-surface-light/20 bg-surface/10">
                  <img
                    src={img}
                    alt={`${project.title} screenshot ${i + 1}`}
                    className="w-full h-full object-cover opacity-0 transition-opacity duration-500"
                    onLoad={(e) => { e.target.classList.remove('opacity-0'); e.target.classList.add('opacity-100'); }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer CTA */}
        <div className="pt-12 border-t border-surface-light/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link
            to="/"
            className="magnetic-btn"
            data-cursor-hover
          >
            ← All Projects
          </Link>
          <div className="flex gap-4">
            {project.liveUrl !== '#' && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic-btn magnetic-btn-accent"
                data-cursor-hover
              >
                View Live
              </a>
            )}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic-btn"
              data-cursor-hover
            >
              View Code
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}