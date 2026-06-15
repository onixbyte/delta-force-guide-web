import React from "react"

interface MarkdownRendererProps {
  /** HTML string processed by vite-plugin-markdown */
  html: string
  /** Optional custom class name */
  className?: string
}

export default function MarkdownRenderer({ html, className = "" }: MarkdownRendererProps) {
  return (
    <article
      className={`prose prose-slate max-w-none dark:prose-invert ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
