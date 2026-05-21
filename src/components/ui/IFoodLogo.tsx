'use client'

import { useState, useEffect } from 'react'

interface IFoodLogoProps {
  size?: number
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
  whiteOnly?: boolean
}

export default function IFoodLogo({ size, width, height, className, style, whiteOnly = true }: IFoodLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string>('/ifood-logo.png')

  useEffect(() => {
    const img = new Image()
    img.src = '/ifood-logo.png'
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
            
            // Key out red: R is high, G and B are low
            const isRed = r > 180 && g < 100 && b < 100
            
            if (!isRed) {
              // Non-red pixel (white text/smile)
              if (x < minX) minX = x
              if (x > maxX) maxX = x
              if (y < minY) minY = y
              if (y > maxY) maxY = y
              
              if (whiteOnly) {
                data[idx] = 255
                data[idx+1] = 255
                data[idx+2] = 255
              }
              data[idx+3] = 255
            } else {
              data[idx+3] = 0 // make transparent
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
  }, [whiteOnly])

  const displayWidth = width || size || 50
  const displayHeight = height || (size ? Math.round(size * 0.7) : 35)

  return (
    <img
      src={logoUrl}
      alt="iFood"
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
