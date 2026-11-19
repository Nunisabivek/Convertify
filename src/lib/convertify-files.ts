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
        /** Sub-folder under Downloads/Convertify (the library folder's name). */
        folder?: string
    }): Promise<{ ok: boolean; uri: string }>
    openFile(options: { appPath: string; mime?: string }): Promise<void>
    fileExists(options: { appPath: string }): Promise<{ exists: boolean }>
    getSafeAreaInsets(): Promise<SafeAreaInsets>
    shareFile(options: { appPath: string; mime?: string }): Promise<{ ok: boolean }>
    /** Google Play in-app review dialog (Play decides whether it actually shows). */
    requestReview(): Promise<void>
    /** System touch feedback: tap (keys), select (chips, sliders), heavy (shutter), success, error. */
    haptic(options: { type: 'tap' | 'select' | 'heavy' | 'success' | 'error' }): Promise<void>
    /** Drops the Android system splash; the web splash under it starts on the same frame. */
    splashReady(): Promise<void>
}

const ConvertifyFiles = registerPlugin<ConvertifyFilesPlugin>('ConvertifyFiles')

export default ConvertifyFiles
