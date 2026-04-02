import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const execFileAsync = promisify(execFile)

type PlayerCommand = 'play' | 'pause' | 'resume' | 'stop' | 'state'

type PlayPayload = {
  encryptedId?: string
  originalId?: number | string
}

async function runNcm(command: PlayerCommand, payload?: PlayPayload) {
  const args: string[] = [command]

  if (command === 'play') {
    if (!payload?.encryptedId || !payload?.originalId) {
      throw new Error('Missing encryptedId/originalId for play command')
    }

    args.push('--song', '--encrypted-id', String(payload.encryptedId), '--original-id', String(payload.originalId), '--output', 'json')
  } else {
    args.push('--output', 'json')
  }

  const { stdout, stderr } = await execFileAsync('ncm-cli', args, {
    timeout: command === 'play' ? 15000 : 8000,
    maxBuffer: 1024 * 1024,
  })

  const output = `${stdout ?? ''}${stderr ?? ''}`.trim()

  try {
    return output ? JSON.parse(output) : { success: true, raw: '' }
  } catch {
    return { success: true, raw: output }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'ncm-local-bridge',
      configureServer(server) {
        server.middlewares.use('/api/player', async (req, res) => {
          res.setHeader('Content-Type', 'application/json; charset=utf-8')

          if (!req.url) {
            res.statusCode = 400
            res.end(JSON.stringify({ success: false, message: 'Missing URL' }))
            return
          }

          const method = req.method ?? 'GET'
          const url = new URL(req.url, 'http://localhost')
          const action = url.pathname.replace(/^\//, '') || 'state'

          try {
            if (method === 'GET' && action === 'state') {
              const result = await runNcm('state')
              res.end(JSON.stringify(result))
              return
            }

            if (method !== 'POST') {
              res.statusCode = 405
              res.end(JSON.stringify({ success: false, message: 'Method not allowed' }))
              return
            }

            let body = ''
            for await (const chunk of req) {
              body += chunk
            }
            const payload = body ? (JSON.parse(body) as PlayPayload) : undefined

            if (action === 'play') {
              const result = await runNcm('play', payload)
              if (result?.success === false) {
                res.statusCode = 502
              }
              res.end(JSON.stringify(result))
              return
            }

            if (action === 'pause' || action === 'resume' || action === 'stop') {
              const result = await runNcm(action)
              if (result?.success === false) {
                res.statusCode = 502
              }
              res.end(JSON.stringify(result))
              return
            }

            res.statusCode = 404
            res.end(JSON.stringify({ success: false, message: `Unknown action: ${action}` }))
          } catch (error) {
            res.statusCode = 500
            res.end(
              JSON.stringify({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown bridge error',
              }),
            )
          }
        })
      },
    },
  ],
})
