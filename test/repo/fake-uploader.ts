import { Uploader, UploadParams, UploadResult } from "@/domain/marketplace/app/storage/uploader";

export class FakeUploader implements Uploader {
  public uploads: UploadParams[] = [];
  public url: string = "https://fake-storage.com/file.png";

  async upload(params: UploadParams): Promise<UploadResult> {
    this.uploads.push(params);
    return { url: this.url };
  }
}
