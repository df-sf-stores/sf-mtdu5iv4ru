const linkLine = /^\[(.+)\]\((\/[^)]*)\)$/

export type FaqItem = { question: string; answer: string[]; link: { label: string; href: string } | null }
export type FaqGroup = { title: string; items: FaqItem[] }

/**
 * The FAQ from content: blocks split by a blank line, '## ' starting a group, and a question
 * block being 'Q: question', its answer lines, then an optional '[label](address)' line.
 */
export const groupsOf = (text: string): FaqGroup[] =>
  text.split('\n\n').reduce<FaqGroup[]>((groups, block) => {
    if (block.startsWith('## ')) return [...groups, { title: block.slice(3), items: [] }]
    const [first = '', ...rest] = block.split('\n')
    const match = linkLine.exec(rest.at(-1) ?? '')
    const item = { question: first.replace(/^Q:\s*/, ''), answer: match ? rest.slice(0, -1) : rest, link: match ? { label: match[1] ?? '', href: match[2] ?? '/' } : null }
    const last = groups.at(-1)
    return last ? [...groups.slice(0, -1), { ...last, items: [...last.items, item] }] : groups
  }, [])
