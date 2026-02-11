import React from 'react';
import { Download, X, Check, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import type { ConvertedImage } from '../hooks/useWebPConverter';

interface ImageCardProps {
    image: ConvertedImage;
    onRemove: () => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, onRemove }) => {
    const { originalFile, previewUrl, status, blob } = image;

    const fileSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const extension = originalFile.name.split('.').pop()?.toLowerCase() || 'img';
    const newName = originalFile.name.replace(/\.[^/.]+$/, "") + ".webp";

    const handleDownload = () => {
        if (status !== 'completed') return;
        const link = document.createElement('a');
        link.href = previewUrl;
        link.download = newName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="glass-card overflow-hidden group relative flex flex-col h-full bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-300">

            {/* Remove Button */}
            <button
                onClick={onRemove}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-opacity opacity-0 group-hover:opacity-100 z-20"
            >
                <X size={14} />
            </button>

            {/* Image Preview Area */}
            <div className="relative aspect-square w-full bg-black/10 flex items-center justify-center overflow-hidden">
                {status === 'completed' && previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Converted"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        // For mobile "Long Press to Save"
                        onContextMenu={() => {
                            // Let default context menu appear for saving
                        }}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-white/50 space-y-2">
                        {status === 'converting' ? (
                            <Loader2 className="animate-spin w-8 h-8" />
                        ) : status === 'error' ? (
                            <AlertCircle className="w-8 h-8 text-red-400" />
                        ) : (
                            <div className="w-12 h-12 rounded-lg bg-white/10" />
                        )}
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-[10px] font-medium backdrop-blur-md bg-black/20 text-white/90">
                    {status === 'completed' ? 'WEBP' : extension.toUpperCase()}
                </div>
            </div>

            {/* Info & Actions */}
            <div className="p-4 flex flex-col flex-1 gap-2">
                <div className="min-w-0">
                    <h4 className="text-sm font-medium text-white truncate" title={originalFile.name}>
                        {originalFile.name}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-white/50 mt-1">
                        <span>{fileSize(originalFile.size)}</span>
                        {status === 'completed' && (
                            <span className="text-green-300 flex items-center gap-1">
                                <Check size={10} /> {fileSize(blob.size)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Download Button (Desktop primarily, but works on mobile too) */}
                <div className="mt-auto pt-2">
                    <button
                        disabled={status !== 'completed'}
                        onClick={handleDownload}
                        className={cn(
                            "w-full py-2 px-3 rounded-xl flex items-center justify-center gap-2",
                            "text-sm font-medium transition-all duration-200",
                            status === 'completed'
                                ? "bg-white/20 hover:bg-white/30 text-white shadow-lg"
                                : "bg-white/5 text-white/30 cursor-not-allowed"
                        )}
                    >
                        <Download size={16} />
                        Save <span className="hidden sm:inline">WebP</span>
                    </button>
                    {status === 'completed' && (
                        <p className="text-[10px] text-center text-white/30 mt-2 sm:hidden">
                            Result available. Long press image to save.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
