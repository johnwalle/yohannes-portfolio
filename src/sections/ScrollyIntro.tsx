import { useCallback, useState } from 'react'
import { AvatarScene }    from '@three/scene/AvatarScene'
import { useScrollScrub } from '@hooks/useScrollScrub'
import { scrollScenes }   from '@data/scrollScenes'
import { SocialRail }     from '@components/ui/SocialRail'
import { ResumeBadge }    from '@components/ui/ResumeBadge'
import styles from './ScrollyIntro.module.css'


export function ScrollyIntro() {
  const [activeIndex, setActiveIndex] = useState(0)
  const onChapterChange = useCallback((i: number) => setActiveIndex(i), [])
  const { containerRef, progressRef } = useScrollScrub(scrollScenes.length, onChapterChange)

  return (
    <section ref={containerRef} className={styles.pinned} id="hero">

      {/* 3D Canvas — fills the background */}
      <AvatarScene progressRef={progressRef} />

      {/* Social icon rail */}
      <SocialRail />

      {/* Résumé — hanging ID badge, top-right, flips to reveal download */}
      <ResumeBadge />

      {/* Right-side role text — only visible on hero chapter */}
      <div className={`${styles.heroRole} ${activeIndex === 0 ? styles.visible : ''}`}>
        <p className={styles.heroRoleAlt}>DESIGNER</p>
        <p className={styles.heroRoleMain}>DEVELOPER</p>
      </div>

      {/* Text panels — one per scroll scene */}
      <div className={styles.panels}>
        {scrollScenes.map((scene, i) => (
          <div
            key={scene.id}
            className={`${styles.panel} ${i === activeIndex ? styles.active : ''}`}
          >
            {scene.eyebrow && (
              <p className={styles.eyebrow}>{scene.eyebrow}</p>
            )}
            <h2 className={styles.heading}>{scene.heading}</h2>
            {scene.body && (
              <p className={styles.body}>{scene.body}</p>
            )}
          </div>
        ))}
      </div>

      {/* Scroll progress dots */}
      <div className={styles.progress}>
        {scrollScenes.map((scene, i) => (
          <span
            key={scene.id}
            className={i === activeIndex ? styles.dotActive : styles.dot}
          />
        ))}
      </div>

      {/* Scroll hint — only on first chapter */}
      {activeIndex === 0 && (
        <div className={styles.scrollHint}>
          <div className={styles.scrollLine} />
          <span className={styles.scrollLabel}>scroll</span>
        </div>
      )}

    </section>
  )
}