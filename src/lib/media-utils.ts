/**
 * Represents the layout options that can be encoded into a media URL.
 */
export interface MediaLayoutOptions {
  fit: "cover" | "contain";
  x: number; // 0 to 100 (%)
  y: number; // 0 to 100 (%)
}

/**
 * Parses a media URL and extracts the base URL and layout options if present.
 * Uses a hash fragment like: #fit=cover&x=50&y=50
 */
export function parseMediaUrl(fullUrl: string | undefined): {
  url: string | undefined;
  options: MediaLayoutOptions;
  style: React.CSSProperties;
} {
  const defaultOptions: MediaLayoutOptions = { fit: "cover", x: 50, y: 50 };

  if (!fullUrl) {
    return {
      url: undefined,
      options: defaultOptions,
      style: { objectFit: "cover", objectPosition: "50% 50%" },
    };
  }

  const [baseUrl, hash] = fullUrl.split("#");
  
  if (!hash) {
    return {
      url: baseUrl,
      options: defaultOptions,
      style: { objectFit: "cover", objectPosition: "50% 50%" },
    };
  }

  const params = new URLSearchParams(hash);
  const fitParam = params.get("fit");
  const xParam = params.get("x");
  const yParam = params.get("y");

  const options: MediaLayoutOptions = {
    fit: (fitParam === "contain" || fitParam === "cover") ? fitParam : "cover",
    x: xParam ? parseInt(xParam, 10) : 50,
    y: yParam ? parseInt(yParam, 10) : 50,
  };

  return {
    url: baseUrl,
    options,
    style: {
      objectFit: options.fit,
      objectPosition: `${options.x}% ${options.y}%`,
    },
  };
}

/**
 * Encodes layout options into a URL's hash fragment.
 */
export function encodeMediaUrl(baseUrl: string, options: MediaLayoutOptions): string {
  if (!baseUrl) return baseUrl;
  
  // Strip existing hash
  const cleanUrl = baseUrl.split("#")[0];
  
  const params = new URLSearchParams();
  params.set("fit", options.fit);
  params.set("x", options.x.toString());
  params.set("y", options.y.toString());
  
  return `${cleanUrl}#${params.toString()}`;
}
