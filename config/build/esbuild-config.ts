import ESBuild, {BuildOptions} from 'esbuild'
import path from 'path'
import {CleanPlugin} from '../plugins/CleanPlugin';
import {HTMLPlugin} from '../plugins/HTMLPlugin';


const mode = process.env.MODE || 'development'

const isDev = mode === 'development'
const isProd = mode === 'production'

const resolveRoot = (...options: string[]) => {
  return path.resolve(__dirname, '..', '..', ...options)
}

const config:BuildOptions = {
  outdir: resolveRoot('build'),
  entryNames: '[dir]/bundle.[name]-[hash]',
  entryPoints: [resolveRoot('src', 'index.tsx')],
  bundle: true,
  tsconfig: resolveRoot('tsconfig.json'),
  minify: isProd,
  sourcemap: isDev,
  allowOverwrite: true,
  plugins: [
    CleanPlugin,
    HTMLPlugin({
      title: 'Yury'
    })
  ],
  metafile: true,
  loader: {
    '.jpg': 'file',
    '.png': 'file',
    '.svg': 'file'
  }
}

export default config
