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
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Could not get canvas context'));
                        return;
                    }

                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob((blob) => {
                        if (!blob) {
                            reject(new Error('Conversion to WebP failed'));
                            return;
                        }
                        const url = URL.createObjectURL(blob);
                        resolve({ url, blob });
                    }, 'image/webp', 0.85); // Quality 0.85
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
