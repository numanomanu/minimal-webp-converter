import React, { useCallback, useState } from 'react';
import { Upload, FileImage } from 'lucide-react';
import { cn } from '../lib/utils';

interface DropZoneProps {
    onFilesDropped: (files: File[]) => void;
    className?: string;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFilesDropped, className }) => {
    const [isDragActive, setIsDragActive] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files).filter(file =>
                file.type.startsWith('image/')
            );
            if (files.length > 0) {
                onFilesDropped(files);
            }
        }
    }, [onFilesDropped]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files).filter(file =>
                file.type.startsWith('image/')
            );
            if (files.length > 0) {
                onFilesDropped(files);
            }
        }
    }, [onFilesDropped]);

    return (
        <div
            className={cn(
                "relative group cursor-pointer transition-all duration-300 ease-in-out",
                "rounded-3xl border-2 border-dashed border-white/10",
                "bg-white/5 hover:bg-white/10 hover:border-[#F59E0B]/50",
                isDragActive ? "border-[#F59E0B] scale-[1.02] bg-[#F59E0B]/10" : "",
                className
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
        >
            <input
                id="file-upload"
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileInput}
            />

            <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                <div className={cn(
                    "p-4 rounded-full bg-white/10 transition-transform duration-300",
                    "group-hover:scale-110",
                    isDragActive ? "scale-125" : ""
                )}>
                    {isDragActive ? (
                        <Upload className="w-12 h-12 text-white/90" />
                    ) : (
                        <FileImage className="w-12 h-12 text-white/80" />
                    )}
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white/90 mb-2">
                        {isDragActive ? "Drop images here" : "Drag & Drop images"}
                    </h3>
                    <p className="text-sm text-white/60">
                        or click to browse
                    </p>
                </div>

                <div className="text-xs text-white/40 pt-4">
                    Supports JPG, PNG, GIF, BMP... {"->"} WebP
                </div>
            </div>
        </div>
    );
};
