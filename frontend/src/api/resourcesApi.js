const RESOURCES_URL = '/api/resources'

async function parseResponse(response) {
  let payload = null

  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok || !payload?.success) {
    const error = new Error(payload?.message || 'Unable to load resources.')
    error.status = response.status
    throw error
  }

  return payload.data
}

export async function fetchResources() {
  const response = await fetch(RESOURCES_URL)
  return parseResponse(response)
}

export async function fetchResource(id) {
  const response = await fetch(`${RESOURCES_URL}/${encodeURIComponent(id)}`)
  return parseResponse(response)
}

export function getResourceFileUrl(id, { download = false } = {}) {
  const base = `${RESOURCES_URL}/${encodeURIComponent(id)}/file`
  return download ? `${base}?download=1` : base
}

export function uploadResource(formData, { onProgress } = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', RESOURCES_URL)

    xhr.upload.onprogress = (event) => {
      if (!onProgress || !event.lengthComputable) return
      onProgress(Math.round((event.loaded / event.total) * 100))
    }

    xhr.onload = () => {
      let payload = null
      try {
        payload = JSON.parse(xhr.responseText)
      } catch {
        payload = null
      }

      if (xhr.status >= 200 && xhr.status < 300 && payload?.success) {
        resolve(payload.data)
        return
      }

      reject(new Error(payload?.message || 'The upload failed. Please try again.'))
    }

    xhr.onerror = () => {
      reject(new Error('We could not reach the server. Please try again.'))
    }

    xhr.send(formData)
  })
}
