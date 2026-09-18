declare module "pdf-lib-encrypt" {
    export function configure(pdfLib: any): void;
    export function lock(
        plainBytes: Uint8Array,
        password: string,
        opts?: {
            userPassword?: string;
            ownerPassword?: string;
            algo?: "aes-256" | "aes256" | "rc4";
            permissions?: number | {
                printing?: "highResolution" | "lowResolution" | "none";
                modifying?: boolean;
                copying?: boolean;
                annotating?: boolean;
                fillingForms?: boolean;
                contentAccessibility?: boolean;
                documentAssembly?: boolean;
            };
        }
    ): Promise<Uint8Array>;
    export function unlockInPlace(pdfDoc: any, password: string): Promise<boolean>;
}
