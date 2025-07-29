import React from 'react'
import { renderMath } from '@/utils/mathRenderer'

interface LaTeXTextProps {
  text: string
  className?: string
}

/**
 * Component for rendering text with LaTeX math expressions
 * Automatically detects and renders LaTeX expressions between $ symbols
 */
const LaTeXText: React.FC<LaTeXTextProps> = ({ text, className = '' }) => {
  const renderedHtml = renderMath(text)
  
  return (
    <span 
      className={className}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  )
}

export default LaTeXText
