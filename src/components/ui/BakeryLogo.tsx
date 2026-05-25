import Image from 'next/image'

interface BakeryLogoProps {
  size?: number
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
  variant?: 'default' | 'white'
}

/**
 * BakeryLogo — usa LogoNovaPaoKent.png (RGBA com transparência nativa).
 * Sem canvas, sem useEffect, sem flash. Renderiza no servidor (SSR-safe).
 */
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

  return (
    <Image
      src={variant === 'white' ? '/LogoNovaPaoKent_WhiteText.png' : '/LogoNovaPaoKent.png'}
      alt="Padaria Nova Pão Kent"
      width={displayWidth}
      height={displayHeight}
      className={className}
      priority
      style={{
        objectFit: 'contain',
        ...style,
      }}
    />
  )
}
