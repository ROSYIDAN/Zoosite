/**
 * Represents the layout options that can be encoded into a media URL.
 */
export interface MediaLayoutOptions {
  fit: "cover" | "contain";
  x: number; // 0 to 100 (%)
  y: number; // 0 to 100 (%)
  cardFit?: "cover" | "contain";
  cardX?: number; // 0 to 100 (%)
  cardY?: number; // 0 to 100 (%)
}

/**
 * Parses a media URL and extracts the base URL and layout options if present.
 * Uses a hash fragment like: #fit=cover&x=50&y=50&c_fit=cover&c_x=45&c_y=25
 */
export function parseMediaUrl(fullUrl: string | undefined): {
  url: string | undefined;
  options: MediaLayoutOptions;
  style: React.CSSProperties;
  cardStyle: React.CSSProperties;
} {
  const defaultOptions: MediaLayoutOptions = { fit: "cover", x: 50, y: 50 };

  if (!fullUrl) {
    return {
      url: undefined,
      options: defaultOptions,
      style: { objectFit: "cover", objectPosition: "50% 50%" },
      cardStyle: { objectFit: "cover", objectPosition: "50% 50%" },
    };
  }

  const [baseUrl, hash] = fullUrl.split("#");
  
  if (!hash) {
    return {
      url: baseUrl,
      options: defaultOptions,
      style: { objectFit: "cover", objectPosition: "50% 50%" },
      cardStyle: { objectFit: "cover", objectPosition: "50% 50%" },
    };
  }

  const params = new URLSearchParams(hash);
  const fitParam = params.get("fit");
  const xParam = params.get("x");
  const yParam = params.get("y");
  
  const cardFitParam = params.get("c_fit");
  const cardXParam = params.get("c_x");
  const cardYParam = params.get("c_y");

  const options: MediaLayoutOptions = {
    fit: (fitParam === "contain" || fitParam === "cover") ? fitParam : "cover",
    x: xParam ? parseInt(xParam, 10) : 50,
    y: yParam ? parseInt(yParam, 10) : 50,
    cardFit: (cardFitParam === "contain" || cardFitParam === "cover") ? cardFitParam : undefined,
    cardX: cardXParam ? parseInt(cardXParam, 10) : undefined,
    cardY: cardYParam ? parseInt(cardYParam, 10) : undefined,
  };

  const style: React.CSSProperties = {
    objectFit: options.fit,
    objectPosition: `${options.x}% ${options.y}%`,
  };

  const cardStyle: React.CSSProperties = {
    objectFit: options.cardFit || options.fit,
    objectPosition: `${options.cardX !== undefined ? options.cardX : options.x}% ${options.cardY !== undefined ? options.cardY : options.y}%`,
  };

  return {
    url: baseUrl,
    options,
    style,
    cardStyle,
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
  
  if (options.cardFit) {
    params.set("c_fit", options.cardFit);
  }
  if (options.cardX !== undefined) {
    params.set("c_x", options.cardX.toString());
  }
  if (options.cardY !== undefined) {
    params.set("c_y", options.cardY.toString());
  }
  
  return `${cleanUrl}#${params.toString()}`;
}
