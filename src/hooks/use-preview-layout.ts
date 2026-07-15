import { useState, useEffect } from "react";
import { parseMediaUrl, encodeMediaUrl, MediaLayoutOptions } from "@/lib/media-utils";

interface UsePreviewLayoutOptions {
  imageUrl: string;
  onApply: (newImageUrl: string) => void;
  onClose: () => void;
}

export interface PreviewLayoutState {
  localImageUrl: string;
  parsed: ReturnType<typeof parseMediaUrl>;
  linkLayouts: boolean;
  detailFit: string;
  detailX: number;
  detailY: number;
  cardFitVal: string;
  cardXVal: number;
  cardYVal: number;
  handleUpdateDetailOptions: (updates: Partial<Pick<MediaLayoutOptions, "fit" | "x" | "y">>) => void;
  handleUpdateCardOptions: (updates: Partial<Pick<MediaLayoutOptions, "cardFit" | "cardX" | "cardY">>) => void;
  handleToggleLink: (checked: boolean) => void;
  handleApply: () => void;
}

export function usePreviewLayout({ imageUrl, onApply, onClose }: UsePreviewLayoutOptions): PreviewLayoutState {
  const [localImageUrl, setLocalImageUrl] = useState(imageUrl);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const parsed = parseMediaUrl(localImageUrl);
  const { fit, x, y, cardFit, cardX, cardY } = parsed.options;

  // Linked if card options are undefined in the hash
  const linkLayouts = cardFit === undefined && cardX === undefined && cardY === undefined;

  const handleUpdateDetailOptions = (updates: Partial<Pick<MediaLayoutOptions, "fit" | "x" | "y">>) => {
    if (parsed.url) {
      const newOptions: MediaLayoutOptions = {
        ...parsed.options,
        ...updates,
      };
      if (linkLayouts) {
        newOptions.cardFit = undefined;
        newOptions.cardX = undefined;
        newOptions.cardY = undefined;
      }
      setLocalImageUrl(encodeMediaUrl(parsed.url, newOptions));
    }
  };

  const handleUpdateCardOptions = (updates: Partial<Pick<MediaLayoutOptions, "cardFit" | "cardX" | "cardY">>) => {
    if (parsed.url) {
      const newOptions: MediaLayoutOptions = {
        ...parsed.options,
        ...updates,
      };
      setLocalImageUrl(encodeMediaUrl(parsed.url, newOptions));
    }
  };

  const handleToggleLink = (checked: boolean) => {
    if (parsed.url) {
      if (checked) {
        const newOptions: MediaLayoutOptions = {
          fit: parsed.options.fit,
          x: parsed.options.x,
          y: parsed.options.y,
          cardFit: undefined,
          cardX: undefined,
          cardY: undefined,
        };
        setLocalImageUrl(encodeMediaUrl(parsed.url, newOptions));
      } else {
        const newOptions: MediaLayoutOptions = {
          fit: parsed.options.fit,
          x: parsed.options.x,
          y: parsed.options.y,
          cardFit: parsed.options.fit,
          cardX: parsed.options.x,
          cardY: parsed.options.y,
        };
        setLocalImageUrl(encodeMediaUrl(parsed.url, newOptions));
      }
    }
  };

  const handleApply = () => {
    onApply(localImageUrl);
    onClose();
  };

  // Safe parsed values for UI inputs
  const detailFit = fit;
  const detailX = x;
  const detailY = y;
  const cardFitVal = cardFit || fit;
  const cardXVal = cardX !== undefined ? cardX : x;
  const cardYVal = cardY !== undefined ? cardY : y;

  return {
    localImageUrl,
    parsed,
    linkLayouts,
    detailFit,
    detailX,
    detailY,
    cardFitVal,
    cardXVal,
    cardYVal,
    handleUpdateDetailOptions,
    handleUpdateCardOptions,
    handleToggleLink,
    handleApply,
  };
}