export async function compressImage(
  file: File,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  }
): Promise<File> {
  const {
    maxWidth = 1280,
    maxHeight = 1280,
    quality = 0.7 // 70% → biasanya hemat 80–90%
  } = options || {};

  const imageBitmap = await createImageBitmap(file);

  let { width, height } = imageBitmap;

  // hitung rasio
  const ratio = Math.min(
    maxWidth / width,
    maxHeight / height,
    1
  );

  width = Math.round(width * ratio);
  height = Math.round(height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(imageBitmap, 0, 0, width, height);

  const blob: Blob = await new Promise(resolve =>
    canvas.toBlob(
      b => resolve(b as Blob),
      "image/jpeg",
      quality
    )
  );

  return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
    type: "image/jpeg"
  });
}
