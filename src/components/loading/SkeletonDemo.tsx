// Demo file to show how the abstract skeleton system works
// This file can be deleted - it's just for demonstration

import { SkeletonLayout } from './SkeletonLayout'

export function SkeletonDemo() {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold mb-4">Skeleton Layout Examples</h1>
      
      {/* Dashboard Layout */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Dashboard Layout</h2>
        <div className="border rounded-lg overflow-hidden">
          <SkeletonLayout layout="dashboard" />
        </div>
      </div>

      {/* Auth Layout */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Auth Layout</h2>
        <div className="border rounded-lg overflow-hidden">
          <SkeletonLayout layout="auth" />
        </div>
      </div>

      {/* Grid Layout (Exercise Library) */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Grid Layout (Exercise Library)</h2>
        <div className="border rounded-lg overflow-hidden">
          <SkeletonLayout layout="grid" />
        </div>
      </div>

      {/* List Layout */}
      <div>
        <h2 className="text-lg font-semibold mb-2">List Layout</h2>
        <div className="border rounded-lg overflow-hidden">
          <SkeletonLayout layout="list" />
        </div>
      </div>

      {/* Custom Layout Example */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Custom Layout Example</h2>
        <div className="border rounded-lg overflow-hidden">
          <SkeletonLayout 
            layout="custom"
            navigation={true}
            sections={[
              {
                type: 'content',
                className: 'container mx-auto px-4 py-8',
                children: [
                  { type: 'skeleton', width: '200px', height: '32px', className: 'mb-4' },
                  { type: 'skeleton', width: '100%', height: '200px', className: 'mb-4' },
                  {
                    type: 'custom',
                    className: 'flex gap-4',
                    children: [
                      { type: 'skeleton', width: '150px', height: '40px' },
                      { type: 'skeleton', width: '150px', height: '40px' },
                    ]
                  }
                ]
              }
            ]}
          />
        </div>
      </div>

      {/* Spinner with Message */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Spinner Mode</h2>
        <div className="border rounded-lg overflow-hidden">
          <SkeletonLayout 
            layout="dashboard"
            showSpinner={true}
            spinnerText="Loading exercise data..."
          />
        </div>
      </div>
    </div>
  )
}

// Usage examples for developers:

// Basic usage with presets:
// <SkeletonLayout layout="dashboard" />
// <SkeletonLayout layout="auth" />
// <SkeletonLayout layout="grid" />
// <SkeletonLayout layout="list" />

// Spinner mode:
// <SkeletonLayout layout="dashboard" showSpinner={true} spinnerText="Loading..." />

// Custom layout:
// <SkeletonLayout 
//   layout="custom"
//   navigation={true}
//   sections={[...your custom sections]}
// />

// No navigation:
// <SkeletonLayout layout="dashboard" navigation={false} /> 