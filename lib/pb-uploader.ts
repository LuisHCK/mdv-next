import type { PBUploadConfig } from '@/types'
import type Client from 'pocketbase'
// Node-only imports (safe to exist in bundle; used only server-side)
import axios from 'axios'
import FormDataNode from 'form-data'
import { Readable } from 'node:stream'

let nanoid = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

interface FileUpload {
    _uploadID: string
    name: string
    progress: number
}

interface UploadFilesProps {
    files: File[]
    callback: () => void
    pbInstance: Client
    config: PBUploadConfig
}

let filesArr: FileUpload[] = []

/**
 * Uploads multiple files using XMLHttpRequest with progress tracking and callback support.
 *
 * This function iterates over the files provided in the `formEvent`, uploads each file
 * individually to a PocketBase backend, and tracks the progress of each upload. It also
 * supports invoking a callback function after each successful upload.
 *
 * @param formEvent - The form event containing the file input element with selected files.
 * @param callback - Optional callback function to be called after each file upload completes.
 * @param config - Configuration object containing PocketBase URL, collection ID, and record ID.
 * @param pbInstance - An instance of the PocketBase client, used for authentication.
 *
 * @remarks
 * - The function uses XMLHttpRequest to enable progress tracking for each file upload.
 * - Each file is uploaded with a unique upload ID for tracking.
 * - The function awaits each upload sequentially; uploads are not parallelized.
 * - The name of the form field for files must be updated from 'FILES_COLUMN_NAME_CHANGE_ME+' to match your backend schema.
 *
 * @throws Will reject the promise if an upload fails.
 */
export const uploadFiles = async ({
    files,
    callback,
    config,
    pbInstance
}: UploadFilesProps) => {
    filesArr = []

    if (!files) return

    // Map to store uploadID and filename for each xhr instance
    const isBrowser = typeof window !== 'undefined'
    const uploadMeta = isBrowser
        ? new Map<XMLHttpRequest, { uploadID: string; filename: string }>()
        : new Map<any, { uploadID: string; filename: string }>()

    for (var i = 0; i < files.length; i++) {
        // Runtime-specific FormData
        const formDataBrowser = isBrowser ? new FormData() : null
        const formDataNode = isBrowser ? null : new FormDataNode()

        if (isBrowser && formDataBrowser) {
            formDataBrowser.append('FILES_COLUMN_NAME_CHANGE_ME+', files[i] as any)
        } else if (formDataNode) {
            // Convert Web File (undici File) to Node Readable
            // Node 18+: Readable.fromWeb can convert web streams to Node streams
            const file = files[i] as unknown as File
            const nodeStream = Readable.fromWeb((file as any).stream())
            formDataNode.append('FILES_COLUMN_NAME_CHANGE_ME+', nodeStream, {
                filename: file.name,
                contentType: (file as any).type || 'application/octet-stream'
            })
        }

        let _uploadID = nanoid()
        filesArr.push({
            _uploadID: _uploadID,
            name: files[i].name,
            progress: 0
        })

        if (isBrowser) {
            let xhr = new XMLHttpRequest()
            uploadMeta.set(xhr, { uploadID: _uploadID, filename: files[i].name })

            // Promisify the XMLHttpRequest
            await new Promise((resolve, reject) => {
                // listen for upload start
                xhr.upload.onloadstart = function () {
                    const meta = uploadMeta.get(xhr)
                    if (meta) {
                        console.log('Upload started.', meta.uploadID, meta.filename)
                    }
                }

                // listen for upload progress
                xhr.upload.onprogress = function (event) {
                    const meta = uploadMeta.get(xhr)
                    if (meta) {
                        let percent = Math.round((100 * event.loaded) / event.total)
                        const file = filesArr.find((item) => item._uploadID === meta.uploadID)
                        if (file) {
                            file.progress = parseInt(percent.toString())
                            console.log('Upload progress:', file, percent)
                        }
                    }
                }

                // handle error
                xhr.upload.onerror = function () {
                    const meta = uploadMeta.get(xhr)
                    if (meta) {
                        console.log(
                            `Error during the upload: ${xhr.status}.`,
                            meta.uploadID,
                            meta.filename
                        )
                    }
                    reject(new Error(`Upload failed with status: ${xhr.status}`))
                }

                // upload completed successfully
                xhr.upload.onload = async function () {
                    const meta = uploadMeta.get(xhr)
                    if (meta) {
                        console.log('Upload completed successfully.', meta.uploadID, meta.filename)
                        filesArr = filesArr.filter((item) => item._uploadID !== meta.uploadID)
                    }
                    if (callback) callback()

                    resolve(true)
                }

                xhr.open(
                    'PATCH',
                    `${process.env.API_URL}/api/collections/${config.collectionId}/records/${config.recordId}`
                )
                xhr.setRequestHeader('Authorization', pbInstance.authStore.token)
                xhr.send(formDataBrowser as FormData)
            })
        } else {
            // Node.js path using axios + form-data with progress
            const url = `${process.env.API_URL}/api/collections/${config.collectionId}/records/${config.recordId}`
            const headers = {
                Authorization: pbInstance.authStore.token,
                ...(formDataNode as FormDataNode).getHeaders()
            }

            await axios.patch(url, formDataNode, {
                headers,
                maxBodyLength: Infinity,
                onUploadProgress: (progressEvent: any) => {
                    const total = progressEvent.total || progressEvent.progress || 0
                    const loaded = progressEvent.loaded || 0
                    const percent = total ? Math.round((loaded * 100) / total) : 0
                    const file = filesArr.find((item) => item._uploadID === _uploadID)
                    if (file) {
                        file.progress = percent
                        console.log('Upload progress:', file, percent)
                    }
                }
            })

            // mark completed
            filesArr = filesArr.filter((item) => item._uploadID !== _uploadID)
            if (callback) callback()
        }
    }
}
