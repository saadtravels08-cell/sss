
/**
 * Utility to fix unsupported CSS color functions (oklch, oklab) for html2canvas.
 * html2canvas's CSS parser does not support these modern color functions and will throw an error.
 * This utility traverses the cloned document and replaces these colors with safe fallbacks.
 */
export const fixUnsupportedColors = (clonedDoc: Document) => {
  const allElements = clonedDoc.getElementsByTagName('*');
  const win = clonedDoc.defaultView || window;

  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i] as HTMLElement;
    if (!el.style) continue;

    const style = el.style;
    
    // Properties to check for oklch/oklab
    const colorProps = [
      'color', 'backgroundColor', 'borderColor', 'borderTopColor', 
      'borderRightColor', 'borderBottomColor', 'borderLeftColor',
      'outlineColor', 'textDecorationColor', 'boxShadow', 'fill', 'stroke',
      'columnRuleColor', 'caretColor', 'background', 'border', 'outline', 'stopColor', 'borderImage'
    ];
    
    colorProps.forEach(prop => {
      try {
        // Convert camelCase to kebab-case for getPropertyValue
        const kebabProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
        const computedStyle = win.getComputedStyle(el);
        const value = computedStyle.getPropertyValue(kebabProp);
        
        if (value && (value.includes('oklch') || value.includes('oklab'))) {
          if (prop === 'boxShadow') {
            style.boxShadow = 'none';
          } else if (prop === 'backgroundColor') {
            // If it's a background color, white is usually a safe bet for documents
            style.backgroundColor = '#ffffff';
          } else if (prop === 'color') {
            style.color = '#000000';
          } else if (prop === 'background' || prop === 'border' || prop === 'outline' || prop === 'borderImage') {
            // @ts-ignore
            style[prop] = 'none';
          } else {
            // For other properties, inherit or a safe default
            // @ts-ignore
            style[prop] = 'currentColor';
          }
        }
      } catch (e) {
        // Ignore errors for elements that might not have computed styles
      }
    });

    // Check for gradients in background-image
    try {
      const computedStyle = win.getComputedStyle(el);
      const bgImage = computedStyle.getPropertyValue('background-image');
      if (bgImage && (bgImage.includes('oklch') || bgImage.includes('oklab'))) {
        style.backgroundImage = 'none';
      }
    } catch (e) {}
  }

  // Inject a global style to override common Tailwind v4 variables that use oklch
  const styleTag = clonedDoc.createElement('style');
  styleTag.innerHTML = `
    * {
      --tw-shadow-color: rgba(0, 0, 0, 0.1) !important;
      --tw-ring-color: rgba(59, 130, 246, 0.5) !important;
      --tw-ring-offset-color: #fff !important;
      --tw-ring-shadow: none !important;
      --tw-shadow: none !important;
      --tw-outline-color: currentColor !important;
      --tw-border-color: currentColor !important;
      --tw-bg-color: transparent !important;
    }
  `;
  clonedDoc.head.appendChild(styleTag);
};
