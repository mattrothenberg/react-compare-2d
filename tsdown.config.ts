import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: ['./src/index.ts'],
    platform: 'neutral',
    dts: true,
    copy: ['./src/basic.css'],
    external: ['react', 'react-dom'],
  },
])
