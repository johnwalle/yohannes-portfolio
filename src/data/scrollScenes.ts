export interface AvatarPose {
  position: [number, number, number]
  rotation: [number, number, number] // radians
}

export interface CameraPreset {
  position: [number, number, number]
  fov: number
}

export interface ScrollScene {
  id: string
  pose: AvatarPose
  camera: CameraPreset
  eyebrow?: string
  heading: string
  body?: string
}

// The figure stays seated at the desk the whole time — only turns/leans
// slightly between chapters. Camera does the storytelling: a wide shot for
// the hero, a closer face-on shot for "about," and a pulled-back full-desk
// shot once he's actively coding.
export const scrollScenes: ScrollScene[] = [
  {
    id: 'hero',
    pose: { position: [0, 0, 0], rotation: [0, 0.1, 0] },
    camera: { position: [0.4, 1.05, 3.6], fov: 32 },
    eyebrow: "Hello! I'm",
    heading: 'Yohannes Wale',
    body: 'A Web & Mobile App Developer',
  },
  {
    id: 'about',
    pose: { position: [0, 0, 0], rotation: [0, -0.15, 0] },
    camera: { position: [-0.5, 1.15, 2.4], fov: 28 },
    eyebrow: 'About me',
    heading: 'MERN specialist',
    body: 'I build web and mobile apps end to end — from React Native and React on the front to Node.js and MongoDB on the back. Driven by curiosity, always learning, always shipping.',
  },
  {
    id: 'what-i-do',
    pose: { position: [0, 0, 0], rotation: [0, 0.3, 0] },
    camera: { position: [1.1, 0.95, 4.4], fov: 38 },
    eyebrow: 'What I do',
    heading: 'Develop & design',
    body: 'JavaScript, TypeScript, React, Next.js and React Native on the frontend; Node.js, MongoDB and PostgreSQL on the backend — deployed with Vercel and Render.',
  },
]