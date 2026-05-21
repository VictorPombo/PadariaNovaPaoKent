'use client'

import { useState, useEffect } from 'react'

interface BakeryLogoProps {
  size?: number
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
}

export default function BakeryLogo({ size, width, height, className, style }: BakeryLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string>('/logo-raw.png')

  useEffect(() => {
    const img = new Image()
    img.src = '/logo-raw.png'
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imgData.data
        
        let minX = canvas.width
        let maxX = 0
        let minY = canvas.height
        let maxY = 0

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const idx = (y * canvas.width + x) * 4
            const r = data[idx]
            const g = data[idx+1]
            const b = data[idx+2]
            
            // If it is NOT close to white
            if (r < 240 || g < 240 || b < 240) {
              if (x < minX) minX = x
              if (x > maxX) maxX = x
              if (y < minY) minY = y
              if (y > maxY) maxY = y
              
              // Boost transparency and color contrast slightly for premium look
              data[idx+3] = 255
            } else {
              data[idx+3] = 0
            }
          }
        }
        
        if (maxX >= minX && maxY >= minY) {
          const cropWidth = maxX - minX + 1
          const cropHeight = maxY - minY + 1
          
          ctx.putImageData(imgData, 0, 0)
          
          const cropCanvas = document.createElement('canvas')
          cropCanvas.width = cropWidth
          cropCanvas.height = cropHeight
          const cropCtx = cropCanvas.getContext('2d')
          if (cropCtx) {
            cropCtx.drawImage(canvas, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)
            setLogoUrl(cropCanvas.toDataURL())
          }
        }
      }
    }
  }, [])

  const displayWidth = width || size || 60
  const displayHeight = height || size || 60

  return (
    <img
      src={logoUrl}
      alt="Padaria Nova Pão Kent"
      width={displayWidth}
      height={displayHeight}
      className={className}
      style={{
        display: 'block',
        objectFit: 'contain',
        ...style
      }}
    />
  )
}
