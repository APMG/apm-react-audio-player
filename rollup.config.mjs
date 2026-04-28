import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import pkg from './package.json' with { type: 'json' }

const deps = Object.keys(pkg.dependencies || {})
const peerDeps = Object.keys(pkg.peerDependencies || {})
const defaultExternal = deps.concat(peerDeps)

export default [
  {
    input: 'src/index.js',
    external: defaultExternal,
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      babel({
        exclude: ['node_modules/**', '*.json']
      }),
      json()
    ]
  }
]
