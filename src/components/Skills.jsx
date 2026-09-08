import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const skillCategories = [
  {
    title: 'Languages',
    skills: ['Python', 'Java', 'JavaScript', 'HTML', 'CSS'],
  },
  {
    title: 'Frameworks & Libraries',
    skills: ['React', 'Next.js', 'Node.js', 'Express.js', 'OpenCV', 'NumPy', 'Pandas', 'Scikit-learn'],
  },
  {
    title: 'Databases',
    skills: ['MongoDB', 'PostgreSQL', 'Prisma ORM'],
  },
  {
    title: 'Developer Tools',
    skills: ['Git', 'GitHub', 'Figma', 'REST APIs', 'Vercel'],
  },
  {
    title: 'Hardware & Embedded',
    skills: ['Drone Systems', 'Embedded Systems', 'Sensors', 'Computer Vision'],
  },
  {
    title: 'Core Strengths',
    skills: ['Problem Solving', 'System Design', 'Team Leadership', 'Hackathon Strategy', 'Adaptability'],
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="skills" className="relative py-32 md:py-40">
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
            Capabilities
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-cream mt-4">
            Technical Skills
          </h2>
        </motion.div>

        {/* Skills grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillCategories.map((cat) => (
            <motion.div
              key={cat.title}
              variants={itemVariants}
              className="p-6 md:p-8 border border-surface-light/20 bg-surface/10 transition-all duration-500 hover:border-cream/10"
            >
              <h3 className="font-display text-xs font-semibold tracking-[0.2em] uppercase text-cream-dim/40 mb-4">
                {cat.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm font-body text-cream/70 px-3 py-1.5 border border-surface-light/30 hover:border-vermilion/40 hover:text-vermilion transition-all duration-300 cursor-default"
                    data-cursor-hover
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
