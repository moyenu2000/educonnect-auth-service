import katex from 'katex'
import 'katex/dist/katex.min.css'

export interface MathValidationResult {
  isValid: boolean
  error?: string
  renderedHtml?: string
}

/**
 * Validates LaTeX math expressions and returns rendered HTML
 */
export function validateAndRenderMath(text: string): MathValidationResult {
  try {
    // Extract math expressions between $ symbols
    const mathExpressions = text.match(/\$([^$]+)\$/g)
    
    if (!mathExpressions) {
      return { isValid: true, renderedHtml: text }
    }

    let renderedText = text
    
    // Validate and render each math expression
    for (const expr of mathExpressions) {
      const mathContent = expr.replace(/\$/g, '')
      
      try {
        // Test if the LaTeX is valid
        const rendered = katex.renderToString(mathContent, {
          displayMode: false,
          throwOnError: true,
          strict: false
        })
        
        // Replace the LaTeX with rendered HTML
        renderedText = renderedText.replace(expr, rendered)
      } catch (mathError: any) {
        return {
          isValid: false,
          error: `Invalid LaTeX syntax in "${mathContent}": ${mathError.message}`
        }
      }
    }
    
    return { isValid: true, renderedHtml: renderedText }
  } catch (error: any) {
    return {
      isValid: false,
      error: `LaTeX validation error: ${error.message}`
    }
  }
}

/**
 * Renders LaTeX expressions in text to HTML
 */
export function renderMath(text: string): string {
  try {
    return text.replace(/\$([^$]+)\$/g, (match, mathContent) => {
      try {
        return katex.renderToString(mathContent, {
          displayMode: false,
          throwOnError: false,
          strict: false
        })
      } catch {
        return match // Return original if rendering fails
      }
    })
  } catch {
    return text // Return original text if anything goes wrong
  }
}

/**
 * Checks if text contains LaTeX expressions
 */
export function hasLatexExpressions(text: string): boolean {
  return /\$([^$]+)\$/.test(text)
}

/**
 * Common LaTeX symbols for quick insertion
 */
export const LATEX_SYMBOLS = {
  basic: [
    { symbol: '^2', latex: '^2', description: 'Superscript (x²)' },
    { symbol: '₁', latex: '_1', description: 'Subscript (x₁)' },
    { symbol: '½', latex: '\\frac{1}{2}', description: 'Fraction (½)' },
    { symbol: '√', latex: '\\sqrt{x}', description: 'Square root (√x)' },
    { symbol: '∞', latex: '\\infty', description: 'Infinity (∞)' },
    { symbol: '±', latex: '\\pm', description: 'Plus-minus (±)' },
    { symbol: '≤', latex: '\\leq', description: 'Less than or equal (≤)' },
    { symbol: '≥', latex: '\\geq', description: 'Greater than or equal (≥)' },
  ],
  functions: [
    { symbol: 'sin', latex: '\\sin', description: 'Sine function' },
    { symbol: 'cos', latex: '\\cos', description: 'Cosine function' },
    { symbol: 'tan', latex: '\\tan', description: 'Tangent function' },
    { symbol: 'log', latex: '\\log', description: 'Logarithm' },
    { symbol: 'ln', latex: '\\ln', description: 'Natural logarithm' },
    { symbol: 'lim', latex: '\\lim_{x \\to 0}', description: 'Limit' },
  ],
  calculus: [
    { symbol: '∫', latex: '\\int', description: 'Integral' },
    { symbol: '∫₀¹', latex: '\\int_0^1', description: 'Definite integral' },
    { symbol: 'd/dx', latex: '\\frac{d}{dx}', description: 'Derivative' },
    { symbol: '∂/∂x', latex: '\\frac{\\partial}{\\partial x}', description: 'Partial derivative' },
    { symbol: '∑', latex: '\\sum_{i=1}^n', description: 'Summation' },
    { symbol: '∏', latex: '\\prod_{i=1}^n', description: 'Product' },
  ],
  greek: [
    { symbol: 'α', latex: '\\alpha', description: 'Alpha' },
    { symbol: 'β', latex: '\\beta', description: 'Beta' },
    { symbol: 'γ', latex: '\\gamma', description: 'Gamma' },
    { symbol: 'δ', latex: '\\delta', description: 'Delta' },
    { symbol: 'π', latex: '\\pi', description: 'Pi' },
    { symbol: 'θ', latex: '\\theta', description: 'Theta' },
    { symbol: 'λ', latex: '\\lambda', description: 'Lambda' },
    { symbol: 'μ', latex: '\\mu', description: 'Mu' },
  ]
}
