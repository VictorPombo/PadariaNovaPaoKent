'use client'

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
  const displayWidth = width || size || 60
  const displayHeight = height || size || 60

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
        ...style,
      }}
    >
      <img
        src="/images/logos/LogoFundoTransparente.png"
        alt="Padaria Nova Pão Kent"
        width={displayWidth}
        height={displayHeight}
        style={processedStyle}
      />
    </div>
  )
}
