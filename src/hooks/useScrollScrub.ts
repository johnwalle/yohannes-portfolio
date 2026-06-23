import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Pins `containerRef` for the duration of `sceneCount` "chapters" and reports
 * a continuous progress value (0 → sceneCount - 1) on every scroll tick.
 *
 * Deliberately avoids React state for the per-frame value — consumers read
 * `progressRef.current` inside their own useFrame/rAF loop instead, so the
 * scrub never triggers a React render and stays silky at 60fps.
 *
 * `onChapterChange` fires only when the rounded chapter index actually
 * changes — use it to drive cheap, discrete text crossfades.
 */
export function useScrollScrub(sceneCount: number, onChapterChange?: (index: number) => void) {
  const containerRef = useRef<HTMLDivElement>(null!)
  const progressRef = useRef(0)
  const lastChapter = useRef(0)

  useEffect(() => {
    if (!containerRef.current || sceneCount < 2) return

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: `+=${(sceneCount - 1) * 100}%`,
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress * (sceneCount - 1)
        const chapter = Math.round(progressRef.current)
        if (chapter !== lastChapter.current) {
          lastChapter.current = chapter
          onChapterChange?.(chapter)
        }
      },
    })

    return () => st.kill()
  }, [sceneCount, onChapterChange])

  return { containerRef, progressRef }
}