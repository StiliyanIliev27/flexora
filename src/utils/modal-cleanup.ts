/**
 * Utility function to aggressively clean up modal-related DOM and CSS issues
 * that can cause UI freezing after modal close
 */
export const cleanupModalState = (debugLabel: string = 'Modal') => {
  setTimeout(() => {
    // Force enable body interactions
    document.body.style.overflow = ''
    document.body.style.pointerEvents = ''
    document.body.style.userSelect = ''
    
    // Remove any potential overlay elements that might be stuck
    const overlays = document.querySelectorAll('[data-radix-popper-content-wrapper]')
    overlays.forEach(overlay => overlay.remove())
    
    // Remove any stuck backdrop elements
    const backdrops = document.querySelectorAll('[data-state="open"]')
    backdrops.forEach(backdrop => {
      if (backdrop.getAttribute('data-state') === 'open') {
        backdrop.setAttribute('data-state', 'closed')
      }
    })
    
    // Force remove any lingering modal states
    document.documentElement.style.pointerEvents = ''
    
    console.log(`${debugLabel} cleanup completed`)
  }, 100)
}
