import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { validateAndRenderMath, LATEX_SYMBOLS } from '@/utils/mathRenderer'
import { Eye, EyeOff, AlertCircle, CheckCircle, Type, Calculator, Sigma, Zap } from 'lucide-react'

interface LatexInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  label?: string
  error?: string
}

const LatexInput: React.FC<LatexInputProps> = ({
  value,
  onChange,
  placeholder = "Enter your text here... Use $...$ for math expressions",
  className = "",
  label,
  error
}) => {
  const [showPreview, setShowPreview] = useState(false)
  const [showSymbols, setShowSymbols] = useState(false)
  const [validation, setValidation] = useState<{ isValid: boolean; error?: string }>({ isValid: true })
  const [activeTab, setActiveTab] = useState<'basic' | 'functions' | 'calculus' | 'greek'>('basic')

  // Validate LaTeX on value change
  useEffect(() => {
    if (value.trim()) {
      const result = validateAndRenderMath(value)
      setValidation({ isValid: result.isValid, error: result.error })
    } else {
      setValidation({ isValid: true })
    }
  }, [value])

  const handleSymbolInsert = (latex: string) => {
    const textarea = document.getElementById('latex-input') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const beforeCursor = value.substring(0, start)
      const afterCursor = value.substring(end)
      
      // Wrap in $ signs if not already present
      const wrappedLatex = latex.startsWith('\\') ? `$${latex}$` : latex
      const newValue = beforeCursor + wrappedLatex + afterCursor
      
      onChange(newValue)
      
      // Set cursor position after inserted text
      setTimeout(() => {
        const newPosition = start + wrappedLatex.length
        textarea.setSelectionRange(newPosition, newPosition)
        textarea.focus()
      }, 0)
    }
  }

  const renderPreview = () => {
    if (!value.trim()) return <div className="text-gray-400 italic">Preview will appear here...</div>
    
    const result = validateAndRenderMath(value)
    if (result.isValid && result.renderedHtml) {
      return <div dangerouslySetInnerHTML={{ __html: result.renderedHtml }} />
    }
    return <div className="text-red-600">Preview unavailable due to syntax errors</div>
  }

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          {label}
        </label>
      )}
      
      {/* Input Controls */}
      <div className="flex gap-2 flex-wrap">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2"
        >
          {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowSymbols(!showSymbols)}
          className="flex items-center gap-2"
        >
          <Sigma className="h-4 w-4" />
          {showSymbols ? 'Hide Symbols' : 'LaTeX Symbols'}
        </Button>
      </div>

      {/* Symbol Picker */}
      {showSymbols && (
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Tabs */}
              <div className="flex gap-2 border-b">
                {Object.keys(LATEX_SYMBOLS).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-3 py-1 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              {/* Symbol Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {LATEX_SYMBOLS[activeTab].map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSymbolInsert(item.latex)}
                    className="p-2 border rounded hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
                    title={item.description}
                  >
                    <div className="font-mono text-sm">{item.symbol}</div>
                    <div className="text-xs text-gray-500 truncate">{item.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input Area */}
      <div className="relative">
        <textarea
          id="latex-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full p-4 border-2 rounded-lg h-32 resize-none transition-all ${
            validation.isValid
              ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              : 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
          } ${className}`}
        />
        
        {/* Validation Status */}
        <div className="absolute top-2 right-2">
          {value.trim() && (
            validation.isValid ? (
              <div title="Valid LaTeX syntax">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            ) : (
              <div title="Invalid LaTeX syntax">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            )
          )}
        </div>
      </div>

      {/* Error Messages */}
      {(error || validation.error) && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          {error || validation.error}
        </div>
      )}

      {/* Preview */}
      {showPreview && (
        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Live Preview</span>
            </div>
            <div className="bg-white p-3 border rounded min-h-[50px] text-base">
              {renderPreview()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Text */}
      <div className="text-xs text-gray-500">
        <strong>LaTeX Help:</strong> Wrap math expressions in $ signs. Example: $x^2 + 3x + 1$ → x² + 3x + 1
      </div>
    </div>
  )
}

export default LatexInput
