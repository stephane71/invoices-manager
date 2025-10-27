/**
 * Fetches a logo from a URL and converts it to a base64 data URI
 * @param logoUrl - The URL of the logo to fetch
 * @returns A base64-encoded data URI string, or undefined if the logo cannot be fetched
 */
export async function fetchLogoAsBase64(
  logoUrl: string,
): Promise<string | undefined> {
  try {
    const response = await fetch(logoUrl);
    if (!response.ok) {
      console.warn(
        `Failed to fetch logo: ${response.status} ${response.statusText}`,
      );
      return undefined;
    }

    const logoBuffer = Buffer.from(await response.arrayBuffer());

    // Detect image type from Content-Type header or URL extension
    let mimeType = "image/png"; // default
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("jpeg") || contentType?.includes("jpg")) {
      mimeType = "image/jpeg";
    } else if (contentType?.includes("png")) {
      mimeType = "image/png";
    } else {
      // Fallback: detect from URL extension
      const urlLower = logoUrl.toLowerCase();
      if (urlLower.includes(".jpg") || urlLower.includes(".jpeg")) {
        mimeType = "image/jpeg";
      }
    }

    return `data:${mimeType};base64,${logoBuffer.toString("base64")}`;
  } catch (error) {
    console.warn("Failed to fetch profile logo:", error);
    return undefined;
  }
}
