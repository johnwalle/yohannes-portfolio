import { useState } from 'react'
import styles from './Accordion.module.css'

interface Item {
  id: string
  title: string
  description: string
}

interface Props {
  items: Item[]
}

export function Accordion({ items }: Props) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

  return (
    <div className={styles.list}>
      {items.map((item) => {
        const open = openId === item.id
        return (
          <div key={item.id} className={styles.item}>
            <button
              className={styles.trigger}
              onClick={() => setOpenId(open ? null : item.id)}
              aria-expanded={open}
            >
              <span className={styles.title}>{item.title}</span>
              <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>⌄</span>
            </button>
            <div className={styles.panel} style={{ maxHeight: open ? '200px' : '0px' }}>
              <p className={styles.description}>{item.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}