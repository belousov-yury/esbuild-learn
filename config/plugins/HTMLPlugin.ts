import {Plugin} from 'esbuild'
import {writeFile} from 'fs/promises'
import path from 'path'

export interface HTMLPluginOptions {
  template?: string
  title?: string
  jsPath?: string[]
  cssPath?: string[]

}

const renderHTML = (options: HTMLPluginOptions): string => {
  return options.template || `
    <!DOCTYPE html>
    <html lang=\'en\'>\n
      <head>
          <meta charset=\'UTF-8\'>
          <title>${options.title || 'TITLE'}</title>
          ${options?.cssPath?.map(path => `<link rel='stylesheet' href='${path}'/>`).join(' ')}
      </head>
      <body>
        <div id='app'></div>
        ${options?.jsPath?.map(path => `<script src='${path}'></script>`).join(' ')}
        <script>
            const evtSource = new EventSource('http://localhost:3000/subscribe')
            evtSource.onopen = function() {
              console.log('open')
            }
            evtSource.onerror = function() {
              console.log('error')
            }
            evtSource.onmessage = function() {
              console.log('message')
              window.location.reload()
            }
        </script>
      </body>
    </html>
`
}

const preparePath = (outputs: string[]) => {
  return outputs.reduce<Array<string[]>>((acc, path) => {
    const [js, css] = acc
    const splittedFilename = path.split('/').pop()
    if (splittedFilename?.endsWith('.js')) {
      js.push(splittedFilename)
    } else if (splittedFilename?.endsWith('.css')) {
      css.push(splittedFilename)
    }
    return acc
  }, [[], []])
}

export const HTMLPlugin = (options: HTMLPluginOptions): Plugin => {
  return {
    name: 'HTMLPlugin',
    setup(build) {
      const outdir = build.initialOptions.outdir

      build.onEnd(async (result) => {
        const outputs = result.metafile?.outputs
        const [jsPath, cssPath] = preparePath(Object.keys(outputs || {}))
        if (outdir) {
          await writeFile(
            path.resolve(outdir, 'index.html'),
            renderHTML({...options, jsPath, cssPath})
          )
        }
      })
    }
  }
}