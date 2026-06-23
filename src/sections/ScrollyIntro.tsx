import { useCallback, useState } from 'react'
import { AvatarScene } from '@three/scene/AvatarScene'
import { useScrollScrub } from '@hooks/useScrollScrub'
import { scrollScenes } from '@data/scrollScenes'
import styles from './ScrollyIntro.module.css'

// Set this once you have a real rigged GLB in /public/models/
const AVATAR_MODEL_URL: string | undefined = undefined // e.g. '/models/avatar.glb'

export function ScrollyIntro() {
  const [activeIndex, setActiveIndex] = useState(0)
  const onChapterChange = useCallback((i: number) => setActiveIndex(i), [])
  const { containerRef, progressRef } = useScrollScrub(scrollScenes.length, onChapterChange)

  return (
    <section ref={containerRef} className={styles.pinned} id="hero">
      <AvatarScene progressRef={progressRef} modelUrl={AVATAR_MODEL_URL} />

      <div className={styles.panels}>
        {scrollScenes.map((scene, i) => (
          <div key={scene.id} className={`${styles.panel} ${i === activeIndex ? styles.active : ''}`}>
            {scene.eyebrow && <p className={styles.eyebrow}>{scene.eyebrow}</p>}
            <h2 className={styles.heading}>{scene.heading}</h2>
            {scene.body && <p className={styles.body}>{scene.body}</p>}
          </div>
        ))}
      </div>

      <div className={styles.progress}>
        {scrollScenes.map((scene, i) => (
          <span key={scene.id} className={i === activeIndex ? styles.dotActive : styles.dot} />
        ))}
      </div>
    </section>
  )
}