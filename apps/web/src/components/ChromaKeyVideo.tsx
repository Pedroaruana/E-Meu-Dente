import { useEffect, useRef } from 'react'

interface ChromaKeyVideoProps {
  src: string
  size: number
  onEnded?: () => void
}

export function ChromaKeyVideo({ src, size, onEnded }: ChromaKeyVideoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const onEndedRef = useRef(onEnded)
  onEndedRef.current = onEnded

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    let raf = 0
    let ended = false

    const draw = () => {
      if (video.videoWidth && video.videoHeight) {
        const targetRatio = canvas.width / canvas.height
        const sourceRatio = video.videoWidth / video.videoHeight
        let sx = 0
        let sy = 0
        let sw = video.videoWidth
        let sh = video.videoHeight

        if (sourceRatio > targetRatio) {
          sw = video.videoHeight * targetRatio
          sx = (video.videoWidth - sw) / 2
        } else {
          sh = video.videoWidth / targetRatio
          sy = (video.videoHeight - sh) / 2
        }

        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)

        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = frame.data
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          if (g > 85 && g > r * 1.22 && g > b * 1.22) {
            data[i + 3] = 0
          }
        }
        ctx.putImageData(frame, 0, 0)
      }

      if (!video.ended) {
        raf = requestAnimationFrame(draw)
      } else if (!ended) {
        ended = true
        onEndedRef.current?.()
      }
    }

    video.play().catch(() => {})
    raf = requestAnimationFrame(draw)

    return () => cancelAnimationFrame(raf)
  }, [src])

  return (
    <>
      <video ref={videoRef} src={src} muted playsInline style={{ display: 'none' }} />
      <canvas
        ref={canvasRef}
        className="landing__mascot"
        width={size * 2}
        height={size * 2}
        style={{ width: size, height: size, display: 'block' }}
      />
    </>
  )
}
