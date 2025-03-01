import React from 'react'
import { motion } from 'framer-motion'

const emojis = ['😭'] // Customize emojis

const EmojiRain = () => {
  return (
    <div className="pointer-events-none fixed bottom-0 right-0 z-0 size-full overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)]
        const startX = Math.random() * window.innerWidth // Random X position
        const delay = Math.random() * 2 // Staggered start

        return (
          <motion.div
            key={i}
            initial={{ y: window.innerHeight, x: startX, opacity: 1 }}
            animate={{ y: 0 }}
            transition={{
              duration: 3,
              ease: 'linear',
              repeat: Infinity,
              delay
            }}
            className="absolute text-3xl"
            style={{ left: startX }}
          >
            {emoji}
          </motion.div>
        )
      })}
    </div>
  )
}

export default EmojiRain
