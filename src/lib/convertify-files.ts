import { registerPlugin } from '@capacitor/core'

export interface PickedNativeFile {
    name: string
    size: number
    mime: string
    appPath: string
    uri: string
}

export interface SafeAreaInsets {
    top: number
    right: number
    bottom: number
    left: number
    edgeToEdge: boolean
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
    getSafeAreaInsets(): Promise<SafeAreaInsets>
    shareFile(options: { appPath: string; mime?: string }): Promise<{ ok: boolean }>
    /** Drops the Android system splash; the web splash under it starts on the same frame. */
    splashReady(): Promise<void>
}

const ConvertifyFiles = registerPlugin<ConvertifyFilesPlugin>('ConvertifyFiles')

export default ConvertifyFiles
