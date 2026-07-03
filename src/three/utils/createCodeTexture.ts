import * as THREE from 'three'

const KEYWORD = '#c792ea'
const STRING  = '#7ee787'
const TEXT    = '#9aa5b1'
const COMMENT = '#4b5563'
const BG      = '#0a0e14'
const PALETTE = [KEYWORD, STRING, TEXT, COMMENT, TEXT]

export function createCodeTexture(seed = 1): THREE.CanvasTexture {
  const canvas    = document.createElement('canvas')
  canvas.width    = 256
  canvas.height   = 256
  const ctx       = canvas.getContext('2d')!
  ctx.fillStyle   = BG
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  let rand        = seed
  const next      = () => {
    rand = (rand * 9301 + 49297) % 233280
    return rand / 233280
  }

  const lineHeight = 10
  let y            = 8

  while (y < canvas.height - lineHeight) {
    const indent   = Math.floor(next() * 4) * 9
    let x          = 8 + indent
    const segments = 1 + Math.floor(next() * 3)

    for (let s = 0; s < segments; s++) {
      const w        = 10 + next() * 46
      ctx.fillStyle  = PALETTE[Math.floor(next() * PALETTE.length)]
      ctx.fillRect(x, y, w, 3.4)
      x             += w + 6
      if (x > canvas.width - 10) break
    }
    y += lineHeight
  }

  const texture        = new THREE.CanvasTexture(canvas)
  texture.wrapS        = THREE.RepeatWrapping
  texture.wrapT        = THREE.RepeatWrapping
  texture.colorSpace   = THREE.SRGBColorSpace
  return texture
}