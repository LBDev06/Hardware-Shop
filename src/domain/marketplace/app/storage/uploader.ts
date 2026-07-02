export interface UploadParams {
  fileName: string;
  fileType: string;
  body: Buffer;
}

export interface UploadResult {
  url: string;
}

export interface Uploader {
  upload(params: UploadParams): Promise<UploadResult>;
}
