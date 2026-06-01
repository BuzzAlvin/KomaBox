export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const imageUrl = url.searchParams.get("url");

    if (!imageUrl) {
      return new Response("No URL provided", { status: 400 });
    }

    // Security: Only allow MangaDex domains
    const allowedDomains = [
      "uploads.mangadex.org",
      "mangadex.network",
    ];

    const isAllowed = allowedDomains.some((domain) => imageUrl.includes(domain));
    if (!isAllowed) {
      return new Response("Domain not allowed", { status: 403 });
    }

    // Fetch with proper Referer header
    const response = await fetch(imageUrl, {
      headers: {
        "Referer": "https://mangadex.org/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return new Response("Image fetch failed", { status: response.status });
    }

    // Get content type from MangaDex response
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Return the image with proper headers
    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch (error) {
    console.error("Image proxy error:", error);
    return new Response("Failed to proxy image", { status: 500 });
  }
}