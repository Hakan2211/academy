import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import glsl from 'vite-plugin-glsl'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    // Turn `.glsl` imports into strings (for our custom shaders).
    glsl(),
    // MDX MUST run before @vitejs/plugin-react so .mdx becomes JSX first.
    // `enforce: 'pre'` guarantees ordering regardless of array position;
    // `providerImportSource` lets MDXProvider inject our custom components.
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
        ],
        providerImportSource: '@mdx-js/react',
      }),
    },
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart(),
    // Process .mdx output (plain JS/JSX) through React's transform too.
    viteReact({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
  ],
})

export default config
