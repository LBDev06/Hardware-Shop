import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAttachmentRepository } from "test/repo/in-memory-attachment-repository";
import { FakeUploader } from "test/repo/fake-uploader";
import { UploadAttachmentUseCase } from "./upload-attachment";

let inMemoryAttachmentRepository: InMemoryAttachmentRepository;
let fakeUploader: FakeUploader;
let sut: UploadAttachmentUseCase;

describe("Upload Attachment Use Case", () => {
  beforeEach(() => {
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository();
    fakeUploader = new FakeUploader();
    sut = new UploadAttachmentUseCase(fakeUploader, inMemoryAttachmentRepository);
  });

  it("should be able to upload an attachment", async () => {
    const result = await sut.execute({
      fileName: "file.png",
      fileType: "image/png",
      body: Buffer.from("file content"),
    });

    expect(result).toBeRight();
    expect(result.value).toEqual({
      attachment: expect.objectContaining({
        link: "https://fake-storage.com/file.png",
      }),
    });
  });

  it("should call uploader with correct params", async () => {
    const body = Buffer.from("file content");

    await sut.execute({
      fileName: "file.png",
      fileType: "image/png",
      body,
    });

    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual({
      fileName: "file.png",
      fileType: "image/png",
      body,
    });
  });

  it("should persist the attachment with the uploaded url", async () => {
    const result = await sut.execute({
      fileName: "file.png",
      fileType: "image/png",
      body: Buffer.from("file content"),
    });

    expect(inMemoryAttachmentRepository.items).toHaveLength(1);
    expect(inMemoryAttachmentRepository.items[0].link).toEqual(
      result.value.attachment.link,
    );
  });
});
