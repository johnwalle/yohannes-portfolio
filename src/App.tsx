import { useState } from 'react'
import { Navbar }       from '@components/layout/Navbar'
import { Footer }       from '@components/layout/Footer'
import { Loader }       from '@components/ui/Loader'
import { Cursor }       from '@components/ui/Cursor'
import { ScrollyIntro } from '@sections/ScrollyIntro'
import { Work }         from '@sections/Work'
import { Skills }       from '@sections/Skills'
import { Contact }      from '@sections/Contact'
import { useLenis } from '@hooks/useLenis'
import { useReducedMotion } from '@hooks/useReducedMotion'
import '@styles/globals.css'
import '@styles/animations.css'

export default function App() {
  const [loaderDone, setLoaderDone] = useState(false)

  useLenis()
  useReducedMotion()

  return (
    <>
      {/* Loader overlays content — content always renders underneath */}
      {!loaderDone && <Loader onComplete={() => setLoaderDone(true)} />}

      <Cursor />

      <Navbar />
      <main>
        <ScrollyIntro />
        <Work />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  )
}