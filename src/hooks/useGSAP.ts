import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type SetupFn = (ctx: gsap.Context) => void

export function useGSAP(setup: SetupFn) {
  const ref = useRef<HTMLElement>(null!)

  useEffect(() => {
    const ctx = gsap.context((self) => setup(self), ref)   // ← the fix
    return () => ctx.revert()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return ref
}

export function refreshST() {
  ScrollTrigger.refresh()
}