import { useState, useCallback } from 'react';

export interface ConvertedImage {
    originalFile: File;
    previewUrl: string; // The WebP Data URL
    blob: Blob;
    status: 'pending' | 'converting' | 'completed' | 'error';
}

export const useWebPConverter = () => {
    const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const convertToWebP = useCallback(async (files: File[]) => {
        setIsProcessing(true);

        // Initialize placeholders
        const newImages: ConvertedImage[] = files.map(file => ({
            originalFile: file,
            previewUrl: '',
            blob: new Blob(),
            status: 'pending'
        }));

        setConvertedImages(prev => [...newImages, ...prev]);

        // Process each file
        for (const image of newImages) {
            setConvertedImages(prev => prev.map(img =>
                img.originalFile === image.originalFile ? { ...img, status: 'converting' } : img
            ));

            try {
                const result = await processFile(image.originalFile);
                setConvertedImages(prev => prev.map(img =>
                    img.originalFile === image.originalFile
                        ? { ...img, previewUrl: result.url, blob: result.blob, status: 'completed' }
                        : img
                ));
            } catch (error) {
                console.error("Conversion failed", error);
                setConvertedImages(prev => prev.map(img =>
                    img.originalFile === image.originalFile ? { ...img, status: 'error' } : img
                ));
            }
        }

        setIsProcessing(false);
    }, []);

    const processFile = (file: File): Promise<{ url: string, blob: Blob }> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();
                img.onload = async () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Could not get canvas context'));
                        return;
                    }

                    ctx.drawImage(img, 0, 0);

                    // Helper to convert with specific quality
                    const convertToBlob = (quality: number): Promise<Blob | null> => {
                        return new Promise((res) => {
                            canvas.toBlob(res, 'image/webp', quality);
                        });
                    };

                    // Smart Quality Strategy
                    // 1. Try fairly high quality (0.8)
                    let blob = await convertToBlob(0.8);

                    if (!blob) {
                        reject(new Error('Conversion to WebP failed'));
                        return;
                    }

                    // 2. If result is larger than original, try aggressive compression (0.6)
                    if (blob.size >= file.size) {
                        const midQualityBlob = await convertToBlob(0.6);
                        if (midQualityBlob && midQualityBlob.size < blob.size) {
                            blob = midQualityBlob;
                        }
                    }

                    // 3. If result is STILL larger/same, try very aggressive compression (0.4)
                    if (blob.size >= file.size) {
                        const lowQualityBlob = await convertToBlob(0.4);
                        if (lowQualityBlob && lowQualityBlob.size < blob.size) {
                            blob = lowQualityBlob;
                        }
                    }

                    const url = URL.createObjectURL(blob);
                    resolve({ url, blob });
                };

                img.onerror = reject;
                img.src = e.target?.result as string;
            };

            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const removeImage = useCallback((index: number) => {
        setConvertedImages(prev => prev.filter((_, i) => i !== index));
    }, []);

    return { convertedImages, convertToWebP, isProcessing, removeImage };
};
