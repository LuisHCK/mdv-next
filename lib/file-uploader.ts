import { on } from 'node:stream'

interface postFileOptions {
    file: File | Blob
    onProgress?: (percent: number) => void
    onError?: (error: Error) => void
    onSuccess?: () => void
    pbCollection: unknown
    url: string
}

export default async function postFile<T>({
    file,
    pbCollection,
    onProgress,
    onError,
    onSuccess,
    url
}: postFileOptions): Promise<T> {
    const formdata = new FormData()
    formdata.append('file', file)

    const request = new XMLHttpRequest()

    request.upload.addEventListener('progress', function (e) {
        var file1Size = file.size

        if (e.loaded <= file1Size) {
            const percent = Math.round((e.loaded / file1Size) * 100)
            onProgress && onProgress(percent)
        }

        if (e.loaded == e.total) {
            onSuccess && onSuccess()
        }
    })

    request.upload.addEventListener('error', function (e) {
        onError && onError(new Error('Upload failed'))
    })

    request.upload.addEventListener('abort', function (e) {
        onError && onError(new Error('Upload aborted'))
    })

    try {
        request.open('post', url)
        request.timeout = 45000

        // Append pbCollection fields to formdata if it's an object
        if (pbCollection && typeof pbCollection === 'object') {
            Object.entries(pbCollection).forEach(([key, value]) => {
            formdata.append(key, value as any)
            })
        }
        request.send(formdata)

        return new Promise((resolve, reject) => {
            request.onload = () => {
                if (request.status >= 200 && request.status < 300) {
                    resolve(request.response)
                } else {
                    reject(new Error(`Upload failed with status ${request.status}`))
                }
            }
        })
    } catch (error) {
        console.error(error)
        onError && onError(error as Error)
        return Promise.reject(error)
    }
}
