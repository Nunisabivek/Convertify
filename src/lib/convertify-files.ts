import { registerPlugin } from '@capacitor/core'

export interface PickedNativeFile {
    name: string
    size: number
    mime: string
    appPath: string
    uri: string
}

export interface ConvertifyFilesPlugin {
    pickFiles(options: {
        multiple?: boolean
        mimeTypes?: string[]
    }): Promise<{ files: PickedNativeFile[] }>
    saveToDownloads(options: {
        appPath: string
        filename: string
        mime: string
    }): Promise<{ ok: boolean; uri: string }>
    fileExists(options: { appPath: string }): Promise<{ exists: boolean }>
}

const ConvertifyFiles = registerPlugin<ConvertifyFilesPlugin>('ConvertifyFiles')

export default ConvertifyFiles
