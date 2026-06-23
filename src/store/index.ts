import { create } from 'zustand'

interface PortfolioStore {
  sceneLoaded: boolean
  setSceneLoaded: (v: boolean) => void

  activeProject: string | null
  setActiveProject: (id: string | null) => void

  navOpen: boolean
  setNavOpen: (v: boolean) => void

  reducedMotion: boolean
  setReducedMotion: (v: boolean) => void
}

export const useStore = create<PortfolioStore>((set) => ({
  sceneLoaded: false,
  setSceneLoaded: (v) => set({ sceneLoaded: v }),

  activeProject: null,
  setActiveProject: (id) => set({ activeProject: id }),

  navOpen: false,
  setNavOpen: (v) => set({ navOpen: v }),

  reducedMotion: false,
  setReducedMotion: (v) => set({ reducedMotion: v }),
}))
