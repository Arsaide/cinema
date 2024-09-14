export interface FileResponse {
    url?: string;
    name?: string;
    videoUrls?: VideoUrls[];
    type?: string;
}

interface VideoUrls {
    url: string;
    name: string;
    quality: string;
}
