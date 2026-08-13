export const dataUrlToFile = async (dataUrl: string, filename: string) => {
  const blob = await (await fetch(dataUrl)).blob();
  return new File([blob], filename, { type: blob.type || "image/png" });
};

export const downloadDataUrl = (dataUrl: string, filename: string) => {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

export const isMobile = () =>
  typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

export const canShareFiles = (file: File) =>
  typeof navigator !== "undefined" && !!navigator.canShare && navigator.canShare({ files: [file] });

export const openTwitterIntent = (caption: string, url: string) => {
  const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(caption)}&url=${encodeURIComponent(url)}`;
  window.open(intent, "_blank", "noopener,noreferrer");
};

export const openLinkedIn = (url: string) => {
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    "_blank",
    "noopener,noreferrer",
  );
};
