import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getAllPosts } from '../lib/blog'

export default function Blog() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const posts = getAllPosts()

  return (
    <section id="blog" className="relative py-32 md:py-40">
      <div className="divider mb-32" />
      <div ref={ref} className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <span className="text-[10px] font-display font-medium tracking-[0.3em] uppercase text-vermilion">
            Writing
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-cream mt-4">
            Blog & Technical Writing
          </h2>
          <p className="text-base md:text-lg text-cream-dim/70 leading-relaxed font-light max-w-2xl mt-4">
            Deep dives into systems I've built, algorithms I've studied, and lessons from competitions.
            No fluff — just technical substance.
          </p>
        </motion.div>

        {/* Posts Grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {posts.map((post) => (
            <motion.article
              key={post.frontmatter.slug}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="p-6 md:p-8 border border-surface-light/20 bg-surface/10 hover:border-cream/10 transition-all duration-500 group"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {post.frontmatter.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-display tracking-wider uppercase px-2.5 py-1 border border-surface-light/50 text-cream-dim/50 group-hover:border-vermilion/40 group-hover:text-vermilion transition-all duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                to={`/blog/${post.frontmatter.slug}`}
                className="group"
                data-cursor-hover
              >
                <h3 className="font-display text-xl md:text-2xl font-semibold text-cream mb-3 group-hover:text-vermilion transition-colors">
                  {post.frontmatter.title}
                </h3>
              </Link>
              <p className="text-sm text-cream-dim/60 leading-relaxed mb-4 font-light line-clamp-3">
                {post.frontmatter.excerpt}
              </p>
              <div className="flex items-center gap-4 text-[10px] font-display tracking-[0.2em] uppercase text-cream-dim/40">
                <span>{post.frontmatter.date}</span>
                <span>·</span>
                <span>{post.frontmatter.readTime}</span>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 text-center"
        >
          <p className="text-cream-dim/50 mb-4 font-light">
            Want more? I write about AI, systems, and engineering strategy.
          </p>
          <a
            href="https://github.com/ankitkumarrrrr"
            target="_blank"
            rel="noopener noreferrer"
            className="magnetic-btn magnetic-btn-accent inline-block"
            data-cursor-hover
          >
            Follow on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  )
}