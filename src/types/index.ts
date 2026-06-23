export interface Project {
  id: string
  title: string
  tag: string
  description: string
  longDescription: string
  tech: string[]
  url?: string
  github?: string
  year: number
  featured: boolean
}

export interface Skill {
  name: string
  category: 'frontend' | 'backend' | 'three' | 'tools'
}

export interface NavLink {
  label: string
  href: string
}

export type Theme = 'dark'

export interface ContactFormData {
  name: string
  email: string
  message: string
}
