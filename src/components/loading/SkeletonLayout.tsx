import { Skeleton } from '@/components/ui/skeleton'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// Layout section types
interface SkeletonSection {
  type: 'header' | 'content' | 'sidebar' | 'card' | 'grid' | 'list' | 'custom'
  className?: string
  children?: SkeletonElement[]
}

interface SkeletonElement {
  type: 'skeleton' | 'text' | 'button' | 'input' | 'image' | 'spinner' | 'divider'
  width?: string | number
  height?: string | number
  className?: string
  count?: number // For repeating elements
  text?: string // For static text
}

interface SkeletonLayoutProps {
  layout: 'dashboard' | 'auth' | 'grid' | 'list' | 'custom'
  navigation?: boolean
  sections?: SkeletonSection[]
  showSpinner?: boolean
  spinnerText?: string
  className?: string
}

// Predefined layout configurations
const LAYOUT_PRESETS = {
  dashboard: {
    navigation: true,
    sections: [
      {
        type: 'content' as const,
        className: 'container mx-auto px-4 py-8',
        children: [
          { type: 'skeleton' as const, width: '24rem', height: '2.25rem', className: 'mx-auto mb-4' },
          { type: 'skeleton' as const, width: '16rem', height: '1.25rem', className: 'mx-auto mb-8' },
          {
            type: 'custom' as const,
            className: 'bg-white rounded-lg shadow-md p-6 max-w-md mx-auto',
            children: [
              { type: 'skeleton' as const, width: '8rem', height: '1.5rem', className: 'mx-auto mb-4' },
              { type: 'skeleton' as const, width: '100%', height: '1rem', className: 'mb-2', count: 4 }
            ]
          }
        ]
      }
    ]
  },
  auth: {
    navigation: false,
    sections: [
      {
        type: 'content' as const,
        className: 'min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8',
        children: [
          {
            type: 'custom' as const,
            className: 'sm:mx-auto sm:w-full sm:max-w-md',
            children: [
              { type: 'text' as const, text: 'Flexora', className: 'text-4xl font-bold text-blue-600 text-center' },
              { type: 'skeleton' as const, width: '12rem', height: '1rem', className: 'mx-auto mt-2' }
            ]
          },
          {
            type: 'custom' as const,
            className: 'mt-8 sm:mx-auto sm:w-full sm:max-w-md',
            children: [
              {
                type: 'custom' as const,
                className: 'bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-6',
                children: [
                  { type: 'skeleton' as const, width: '12rem', height: '2rem', className: 'mx-auto' },
                  { type: 'skeleton' as const, width: '100%', height: '2.5rem' },
                  { type: 'divider' as const },
                  { type: 'skeleton' as const, width: '100%', height: '2.25rem', count: 3 }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  grid: {
    navigation: true,
    sections: [
      {
        type: 'content' as const,
        className: 'container mx-auto px-4 py-8',
        children: [
          { type: 'skeleton' as const, width: '12rem', height: '2rem', className: 'mb-4' },
          { type: 'skeleton' as const, width: '24rem', height: '1rem', className: 'mb-8' },
          {
            type: 'custom' as const,
            className: 'flex gap-4 mb-8',
            children: [
              { type: 'skeleton' as const, width: '100%', height: '2.5rem', className: 'flex-1' },
              { type: 'skeleton' as const, width: '8rem', height: '2.5rem' },
              { type: 'skeleton' as const, width: '6rem', height: '2.5rem' }
            ]
          },
          {
            type: 'grid' as const,
            className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
            children: [
              {
                type: 'custom' as const,
                className: 'bg-white rounded-lg shadow-md p-4',
                count: 12,
                children: [
                  { type: 'skeleton' as const, width: '100%', height: '12rem', className: 'mb-4 rounded' },
                  { type: 'skeleton' as const, width: '75%', height: '1.5rem', className: 'mb-2' },
                  { type: 'skeleton' as const, width: '100%', height: '1rem', className: 'mb-3' },
                  { type: 'skeleton' as const, width: '100%', height: '2.25rem' }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  list: {
    navigation: true,
    sections: [
      {
        type: 'content' as const,
        className: 'container mx-auto px-4 py-8',
        children: [
          { type: 'skeleton' as const, width: '12rem', height: '2rem', className: 'mb-8' },
          {
            type: 'custom' as const,
            className: 'space-y-4',
            children: [
              {
                type: 'custom' as const,
                className: 'bg-white rounded-lg shadow-md p-4 flex items-center gap-4',
                count: 8,
                children: [
                  { type: 'skeleton' as const, width: '4rem', height: '4rem', className: 'rounded-full' },
                  {
                    type: 'custom' as const,
                    className: 'flex-1',
                    children: [
                      { type: 'skeleton' as const, width: '75%', height: '1.5rem', className: 'mb-2' },
                      { type: 'skeleton' as const, width: '100%', height: '1rem' }
                    ]
                  },
                  { type: 'skeleton' as const, width: '6rem', height: '2rem' }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}

function renderSkeletonElement(element: SkeletonElement, index: number): React.ReactNode {
  const key = `skeleton-${index}`
  
  switch (element.type) {
    case 'skeleton':
      return (
        <Skeleton
          key={key}
          className={element.className}
          style={{
            width: element.width,
            height: element.height
          }}
        />
      )
    case 'spinner':
      return (
        <LoadingSpinner
          key={key}
          size="lg"
          className={`text-blue-600 ${element.className || ''}`}
        />
      )
    case 'text':
      return (
        <div key={key} className={element.className}>
          {element.text}
        </div>
      )
    case 'divider':
      return (
        <div key={key} className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>
      )
    default:
      return null
  }
}

function renderSkeletonSection(section: SkeletonSection, index: number): React.ReactNode {
  const key = `section-${index}`
  
  if (section.type === 'grid' && section.children) {
    const gridChild = section.children[0]
    if (gridChild?.count) {
      return (
        <div key={key} className={section.className}>
          {Array.from({ length: gridChild.count }).map((_, i) => (
            <div key={`grid-item-${i}`} className={gridChild.className}>
              {gridChild.children?.map((child, j) => renderSkeletonElement(child, j))}
            </div>
          ))}
        </div>
      )
    }
  }

  const content = section.children?.map((child, i) => {
    if (child.count) {
      return Array.from({ length: child.count }).map((_, j) => (
        <div key={`${i}-${j}`} className={child.className}>
          {child.children?.map((grandchild, k) => renderSkeletonElement(grandchild, k))}
        </div>
      ))
    }
    
    if (child.type === 'custom' && child.children) {
      return (
        <div key={i} className={child.className}>
          {child.children.map((grandchild, j) => renderSkeletonElement(grandchild, j))}
        </div>
      )
    }
    
    return renderSkeletonElement(child, i)
  })

  return (
    <div key={key} className={section.className}>
      {content}
    </div>
  )
}

export function SkeletonLayout({
  layout,
  navigation = true,
  sections,
  showSpinner = false,
  spinnerText = "Loading...",
  className = ""
}: SkeletonLayoutProps) {
  // Use preset or custom sections
  const layoutConfig = sections ? { navigation, sections } : LAYOUT_PRESETS[layout] || LAYOUT_PRESETS.dashboard
  
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Navigation skeleton */}
      {layoutConfig.navigation && (
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">Flexora</h1>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </nav>
      )}

      {/* Show spinner with message */}
      {showSpinner && (
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner size="lg" className="text-blue-600" />
              <p className="text-gray-600">{spinnerText}</p>
            </div>
          </div>
        </main>
      )}

      {/* Render sections */}
      {!showSpinner && layoutConfig.sections?.map((section, index) => 
        renderSkeletonSection(section, index)
      )}
    </div>
  )
} 