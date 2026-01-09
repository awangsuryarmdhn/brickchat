export async function resizeImage(
  file: File,
  maxSize = 1024
): Promise<Blob> {
  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);

  await new Promise<void>(resolve => {
    img.onload = () => resolve();
  });

  let width = img.width;
  let height = img.height;

  if (width > height && width > maxSize) {
    height = Math.round((height * maxSize) / width);
    width = maxSize;
  } else if (height > maxSize) {
    width = Math.round((width * maxSize) / height);
    height = maxSize;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas not supported");
  }

  ctx.drawImage(img, 0, 0, width, height);

  return new Promise<Blob>(resolve => {
    canvas.toBlob(
      blob => resolve(blob as Blob),
      "image/jpeg",
      0.1 // 🔥 90% compression
    );
  });
}
