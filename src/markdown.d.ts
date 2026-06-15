declare module "*.md" {
  const attributes: Record<string, any>
  const html: string
  const toc: { level: string; content: string; slug: string }[]
  export { attributes, html, toc }
}
