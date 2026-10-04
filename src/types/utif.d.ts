declare module "utif" {
    export interface IFD {
        width: number
        height: number
        /** NewSubfileType: bit 0 set means a reduced-resolution copy of another page. */
        t254?: number[]
        /** XResolution / YResolution / ResolutionUnit (2 = inch, 3 = cm). */
        t282?: number[]
        t283?: number[]
        t296?: number[]
        [key: string]: unknown
    }
    const UTIF: {
        decode(buffer: ArrayBuffer): IFD[]
        decodeImage(buffer: ArrayBuffer, ifd: IFD): void
        toRGBA8(ifd: IFD): Uint8Array
    }
    export default UTIF
}
