import React from 'react'

const TestPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-red-600">TEST PAGE - NAVIGATION WORKING!</h1>
      <p className="text-lg mt-4">If you can see this page, navigation is working correctly.</p>
      <p className="text-sm text-muted-foreground mt-2">Current URL: {window.location.pathname}</p>
    </div>
  )
}

export default TestPage