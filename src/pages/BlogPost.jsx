import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug } from '../lib/blog'

const components = {
  h1: (props) => <h1 {...props} className="font-serif text-4xl md:text-5xl font-light text-cream mb-6 mt-10" />,
  h2: (props) => <h2 {...props} className="font-serif text-3xl md:text-4xl font-light text-cream mb-4 mt-12" />,
  h3: (props) => <h3 {...props} className="font-display text-xl font-semibold text-cream mb-3 mt-8" />,
  p: (props) => <p {...props} className="text-base md:text-lg text-cream-dim/70 leading-[1.8] font-light mb-6" />,
  ul: (props) => <ul {...props} className="list-disc list-inside flex flex-col gap-3 text-cream-dim/70 leading-[1.8] font-light mb-6 ml-4" />,
  ol: (props) => <ol {...props} className="list-decimal list-inside flex flex-col gap-3 text-cream-dim/70 leading-[1.8] font-light mb-6 ml-4" />,
  li: (props) => <li {...props} className="text-cream-dim/70 leading-[1.8] font-light" />,
  a: (props) => (
    <a {...props} className="text-vermilion hover:text-vermilion/80 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer" />
  ),
  code: (props) => <code {...props} className="font-mono text-sm bg-surface-light/50 px-1.5 py-0.5 rounded text-vermilion/90" />,
  pre: (props) => (
    <pre {...props} className="bg-surface-light/30 border border-surface-light/30 rounded-none p-6 overflow-x-auto mb-6">
      <code className="font-mono text-sm text-cream/90 leading-relaxed block">{props.children}</code>
    </pre>
  ),
  blockquote: (props) => (
    <blockquote {...props} className="border-l-4 border-vermilion pl-6 my-6 italic text-cream-dim/80 font-serif text-lg leading-relaxed" />
  ),
  hr: () => <hr className="divider my-12" />,
  img: (props) => (
    <div className="my-8">
      <img {...props} className="w-full h-auto rounded-none border border-surface-light/20" loading="lazy" />
      {props.alt && <p className="text-[10px] font-display tracking-[0.2em] uppercase text-cream-dim/40 mt-2 text-center">{props.alt}</p>}
    </div>
  ),
  table: (props) => (
    <div className="overflow-x-auto my-8">
      <table {...props} className="w-full border-collapse border border-surface-light/30" />
    </div>
  ),
  th: (props) => <th {...props} className="border border-surface-light/30 px-4 py-3 font-display text-xs tracking-wider uppercase text-cream bg-surface/20" />,
  td: (props) => <td {...props} className="border border-surface-light/30 px-4 py-3 text-cream-dim/70 text-sm" />,
}

export default function BlogPost() {
  const { slug } = useParams()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Load post data
  let post = null
  let content = ''
  try {
    const data = getPostBySlug(slug)
    if (data) {
      post = data.frontmatter
      content = data.content
    }
  } catch {
    // Post not found
  }

  if (!post) {
    return (
      <section className="relative py-32 md:py-40 min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-serif text-4xl md:text-6xl font-light text-cream mb-4">Post Not Found</h1>
          <Link to="/blog" className="magnetic-btn magnetic-btn-accent inline-block mt-6" data-cursor-hover>
            Back to Blog
          </Link>
        </div>
      </section>
    )
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article id="blog-post" className="relative py-16 md:py-24">
      <div className="divider mb-16" />
      <div ref={ref} className="max-w-3xl mx-auto px-6 md:px-12">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <Link
            to="/blog"
            className="text-xs font-display tracking-[0.15em] uppercase text-cream-dim/50 hover:text-vermilion transition-colors flex items-center gap-2 inline-flex"
            data-cursor-hover
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="17" y1="7" x2="7" y2="17" />
              <polyline points="17 17 7 17 7 7" />
            </svg>
            Back to Blog
          </Link>
        </motion.div>

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-display tracking-wider uppercase px-3 py-1 border border-surface-light/50 text-cream-dim/50"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-light text-cream mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-cream-dim/50">
            <span>{formattedDate}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="prose prose-invert max-w-none"
        >
          <MDXRemote source={content} components={components} />
        </motion.div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-surface-light/20">
          <Link
            to="/blog"
            className="magnetic-btn inline-block"
            data-cursor-hover
          >
            ← All Posts
          </Link>
        </div>
      </div>
    </article>
  )
}