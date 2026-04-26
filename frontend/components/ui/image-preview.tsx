"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { X, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";

export interface ImagePreviewProps {
  urls?: string;
  files?: File[];
  onFilesChange?: (files: File[]) => void;
  onUrlsChange?: (urls: string) => void;
  disabled?: boolean;
}

interface ImageItem {
  id: string;
  url: string;
  status: "loading" | "loaded" | "error";
  type: "url" | "file";
  file?: File;
}

export function ImagePreview({
  urls,
  files = [],
  onFilesChange,
  onUrlsChange,
  disabled = false,
}: ImagePreviewProps) {
  const [imageStatuses, setImageStatuses] = useState<Record<string, "loading" | "loaded" | "error">>({});
  const createdUrlsRef = useRef<Map<File, string>>(new Map());

  const revokeUrl = useCallback((url: string) => {
    if (url.startsWith("blob:")) URL.revokeObjectURL(url);
  }, []);

  useEffect(() => {
    const currentFiles = new Set(files);
    const newCreatedUrls = new Map<File, string>();

    createdUrlsRef.current.forEach((url, file) => {
      if (!currentFiles.has(file)) {
        revokeUrl(url);
      } else {
        newCreatedUrls.set(file, url);
      }
    });

    files.forEach((file) => {
      if (!newCreatedUrls.has(file)) {
        newCreatedUrls.set(file, URL.createObjectURL(file));
      }
    });

    createdUrlsRef.current = newCreatedUrls;
  }, [files, revokeUrl]);

  const images = useMemo(() => {
    const fileItems: ImageItem[] = files.map((file, index) => ({
      id: `file-${index}-${file.name}`,
      url: createdUrlsRef.current.get(file) || "",
      status: "loaded" as const,
      type: "file" as const,
      file,
    }));

    const parsedUrls = urls
      ? urls.split(",").map((url) => url.trim()).filter(Boolean)
      : [];
    
    const urlItems: ImageItem[] = parsedUrls.map((url, index) => ({
      id: `url-${index}-${url}`,
      url,
      status: imageStatuses[url] || "loading",
      type: "url" as const,
    }));

    return [...fileItems, ...urlItems];
  }, [files, urls, imageStatuses]);

  useEffect(() => {
    return () => {
      createdUrlsRef.current.forEach((url) => revokeUrl(url));
    };
  }, [revokeUrl]);

  const handleImageLoad = useCallback((url: string) => {
    setImageStatuses((prev) => ({ ...prev, [url]: "loaded" }));
  }, []);

  const handleImageError = useCallback((url: string) => {
    setImageStatuses((prev) => ({ ...prev, [url]: "error" }));
  }, []);

  const handleRemove = useCallback(
    (idToRemove: string) => {
      const itemToRemove = images.find((item) => item.id === idToRemove);
      if (!itemToRemove) return;

      if (itemToRemove.type === "file" && itemToRemove.file) {
        const newFiles = files.filter(f => f !== itemToRemove.file);
        onFilesChange?.(newFiles);
      } else if (itemToRemove.type === "url") {
        const newUrls = images
          .filter((item) => item.type === "url" && item.id !== idToRemove)
          .map((item) => item.url)
          .join(", ");
        onUrlsChange?.(newUrls);
      }
    },
    [images, files, onFilesChange, onUrlsChange]
  );

  if (images.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {images.map((item) => (
        <div
          key={item.id}
          className="relative group w-24 h-24 rounded-xl overflow-hidden border border-white/10 bg-black/60 backdrop-blur-md transition-all duration-300 hover:border-white/30"
        >
          {item.status === "loading" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-6 animate-spin text-white/40" />
            </div>
          )}

          {item.status === "error" && (
            <div className="absolute inset-0 flex items-center justify-center bg-destructive/10">
              <AlertCircle className="size-6 text-destructive" />
            </div>
          )}

          <Image
            src={item.url}
            alt="Preview"
            fill
            unoptimized={item.url.startsWith("blob:")}
            className={`object-cover transition-all duration-500 group-hover:scale-110 ${
              item.status === "loaded" ? "opacity-100" : "opacity-0"
            }`}
            onLoadingComplete={() => item.type === "url" && handleImageLoad(item.url)}
            onError={() => item.type === "url" && handleImageError(item.url)}
          />

          {item.status === "loading" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <Loader2 className="size-6 animate-spin text-white/40" />
            </div>
          )}

          {item.status === "loaded" && item.type === "file" && (
            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-white/10 backdrop-blur-md text-white text-[9px] font-medium rounded-full border border-white/20">
              LOCAL
            </div>
          )}

          {!disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRemove(item.id);
              }}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 backdrop-blur-xl border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive hover:border-destructive z-20"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
