// Vite-compatible blog loader using import.meta.glob with raw import
// This runs at build time, not runtime

const postModules = import.meta.glob('/src/content/blog/*.mdx', { eager: true, query: '?raw', import: 'default' })

function parseFrontmatter(content: string) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)
  if (!match) return { data: {}, content: content }
  
  const fm = match[1]
  const data: Record<string, any> = {}
  fm.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':')
    if (key && valueParts.length) {
      let value = valueParts.join(':').trim()
      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      // Parse arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          value = JSON.parse(value.replace(/'/g, '"'))
        } catch {
          value = value.slice(1, -1).split(',').map(v => v.trim())
        }
      }
      // Parse numbers
      if (!isNaN(Number(value)) && !value.includes('.')) {
        value = Number(value)
      } else if (!isNaN(Number(value))) {
        value = Number(value)
      }
      // Parse booleans
      if (value === 'true') value = true
      if (value === 'false') value = false
      data[key.trim()] = value
    }
  })
  
  const contentWithoutFm = content.replace(frontmatterRegex, '').trim()
  return { data, content: contentWithoutFm }
}

export function getAllPostSlugs() {
  return Object.keys(postModules).map(path => {
    return path.replace('/src/content/blog/', '').replace('.mdx', '')
  })
}

export function getPostBySlug(slug: string) {
  const path = `/src/content/blog/${slug}.mdx`
  const rawContent = postModules[path]
  if (!rawContent) return null
  
  const { data, content } = parseFrontmatter(rawContent)
  return {
    frontmatter: {
      slug,
      ...data,
    },
    content,
  }
}

export function getAllPosts() {
  return getAllPostSlugs()
    .map(slug => getPostBySlug(slug))
    .filter(Boolean)
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
}