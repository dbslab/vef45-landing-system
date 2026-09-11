export function getVideoEmbedUrl(
  input: string | null | undefined
) {
  if (!input) {
    return null;
  }

  const value = input.trim();

  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");

    if (
      host === "youtube.com" ||
      host === "m.youtube.com"
    ) {
      if (url.pathname.startsWith("/embed/")) {
        return value;
      }

      if (url.pathname.startsWith("/shorts/")) {
        const id = url.pathname.split("/")[2];

        return id
          ? `https://www.youtube.com/embed/${id}`
          : value;
      }

      const id = url.searchParams.get("v");

      return id
        ? `https://www.youtube.com/embed/${id}`
        : value;
    }

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];

      return id
        ? `https://www.youtube.com/embed/${id}`
        : value;
    }

    if (host === "vimeo.com") {
      const id = url.pathname
        .split("/")
        .filter(Boolean)
        .find((part) => /^\d+$/.test(part));

      return id
        ? `https://player.vimeo.com/video/${id}`
        : value;
    }

    return value;
  } catch {
    return value;
  }
}
