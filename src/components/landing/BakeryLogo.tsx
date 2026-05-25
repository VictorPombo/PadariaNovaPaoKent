'use client'

import { useState, useEffect } from 'react'

interface BakeryLogoProps {
  size?: number
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
  variant?: 'default' | 'white'
}

export default function BakeryLogo({
  size,
  width,
  height,
  className,
  style,
  variant = 'default',
}: BakeryLogoProps) {
  // Start with the raw logo immediately — canvas result replaces it if successful
  const [logoUrl, setLogoUrl] = useState<string>('/logo-raw.png')
  const [canvasDone, setCanvasDone] = useState(false)

  const displayWidth = width || size || 60
  const displayHeight = height || size || 60

  useEffect(() => {
    let cancelled = false

    const img = new Image()
    img.src = '/logo-raw.png'

    img.onerror = () => {
      // raw load failed — keep showing raw url, nothing to do
    }

    img.onload = () => {
      if (cancelled) return
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.drawImage(img, 0, 0)

        let imgData: ImageData
        try {
          imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        } catch {
          // Canvas tainted (SecurityError) — keep showing raw image
          return
        }

        const data = imgData.data
        let minX = canvas.width, maxX = 0, minY = canvas.height, maxY = 0

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const idx = (y * canvas.width + x) * 4
            const r = data[idx], g = data[idx + 1], b = data[idx + 2]
            // Non-white pixel: keep visible, track crop bounds
            if (r < 240 || g < 240 || b < 240) {
              if (x < minX) minX = x
              if (x > maxX) maxX = x
              if (y < minY) minY = y
              if (y > maxY) maxY = y
              data[idx + 3] = 255
            } else {
              // White background: make transparent
              data[idx + 3] = 0
            }
          }
        }

        if (maxX >= minX && maxY >= minY) {
          const cropW = maxX - minX + 1
          const cropH = maxY - minY + 1
          ctx.putImageData(imgData, 0, 0)

          const cropCanvas = document.createElement('canvas')
          cropCanvas.width = cropW
          cropCanvas.height = cropH
          const cropCtx = cropCanvas.getContext('2d')
          if (cropCtx) {
            cropCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH)
            if (!cancelled) {
              setLogoUrl(cropCanvas.toDataURL())
              setCanvasDone(true)
            }
          }
        }
      } catch {
        // Silent fail — raw image already visible
      }
    }

    return () => { cancelled = true }
  }, [])

  // Raw image style (white background) — used when canvas hasn't processed yet
  // On dark backgrounds: mix-blend-mode: multiply makes white blend into dark
  // On light backgrounds: white background is naturally invisible
  const rawStyle: React.CSSProperties = {
    display: 'block',
    objectFit: 'contain',
    width: '100%',
    height: '100%',
    // multiply: white pixels (1,1,1) × dark bg ≈ dark bg color → white disappears
    mixBlendMode: 'multiply',
  }

  // Processed transparent image style
  const processedStyle: React.CSSProperties = {
    display: 'block',
    objectFit: 'contain',
    width: '100%',
    height: '100%',
    ...(variant === 'white' ? { filter: 'brightness(0) invert(1)' } : {}),
  }

  return (
    <div
      className={className}
      style={{
        width: displayWidth,
        height: displayHeight,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        // For white variant on dark: use screen blend mode on container
        // This makes the white background of the raw logo disappear on dark backgrounds
        mixBlendMode: (!canvasDone && variant === 'white') ? 'screen' : undefined,
        ...style,
      }}
    >
      <img
        src={logoUrl}
        alt="Padaria Nova Pão Kent"
        width={displayWidth}
        height={displayHeight}
        style={canvasDone ? processedStyle : rawStyle}
      />
    </div>
  )
}
