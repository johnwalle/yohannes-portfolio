import type { Skill } from '@types-local/index'

export const skills: Skill[] = [
  { name: 'React / Next.js',     category: 'frontend' },
  { name: 'TypeScript',          category: 'frontend' },
  { name: 'Tailwind CSS',        category: 'frontend' },
  { name: 'Framer Motion',       category: 'frontend' },
  { name: 'Three.js',            category: 'three'    },
  { name: 'React Three Fiber',   category: 'three'    },
  { name: 'GSAP / ScrollTrigger',category: 'three'    },
  { name: 'GLSL Shaders',        category: 'three'    },
  { name: 'Node.js / Express',   category: 'backend'  },
  { name: 'PostgreSQL',          category: 'backend'  },
  { name: 'GraphQL',             category: 'backend'  },
  { name: 'Docker / AWS',        category: 'tools'    },
  { name: 'Git / GitHub',        category: 'tools'    },
  { name: 'Figma',               category: 'tools'    },
]

export const skillCategories = ['frontend', 'three', 'backend', 'tools'] as const
