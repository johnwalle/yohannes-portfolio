export interface AvatarPose {
  position: [number, number, number]
  rotation: [number, number, number] // radians
  /** Name of the GLB animation clip to blend toward for this scene, if any */
  clip?: string
}

export interface ScrollScene {
  id: string
  pose: AvatarPose
  eyebrow?: string
  heading: string
  body?: string
}

export const scrollScenes: ScrollScene[] = [
  {
    id: 'hero',
    pose: { position: [0, -0.4, 0], rotation: [0, 0.15, 0], clip: 'Wave' },
    eyebrow: "Hello! I'm",
    heading: 'Your Name',
    body: 'A creative developer & designer',
  },
  {
    id: 'about',
    pose: { position: [-1.1, -0.6, 0.6], rotation: [0, 0.55, 0], clip: 'Idle' },
    eyebrow: 'About me',
    heading: 'Creative developer & designer',
    body: 'I blend technical depth with a design eye — driven by curiosity, always learning.',
  },
  {
    id: 'what-i-do',
    pose: { position: [-1.3, -1.1, 0.2], rotation: [0, 0.85, 0], clip: 'SitDown' },
    eyebrow: 'What I do',
    heading: 'Develop & design',
    body: 'From JavaScript and PHP to TypeScript, React and Node — with a little bit of magic.',
  },
]