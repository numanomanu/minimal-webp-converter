import { useCallback, useEffect } from 'react';
/* Add font import to head roughly or via CSS, here using a simple style injection or linking in index.html is better, but let's stick to CSS/HTML later. For now, assuming index.html modification */
import { DropZone } from './components/DropZone';
import { ImageCard } from './components/ImageCard';
import { useWebPConverter } from './hooks/useWebPConverter';

function App() {
  const { convertedImages, convertToWebP, removeImage } = useWebPConverter();

  const handleFilesDropped = useCallback((newFiles: File[]) => {
    convertToWebP(newFiles);
  }, [convertToWebP]);

  // Log for debugging
  useEffect(() => {
    console.log('Current images:', convertedImages);
  }, [convertedImages]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#16181D] font-sans text-white">

      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-orange-500/10 blur-[100px] animate-float pointer-events-none opacity-60 mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-yellow-600/10 blur-[100px] animate-float-delayed pointer-events-none opacity-60 mix-blend-screen" />

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16 flex flex-col items-center min-h-screen">

        {/* Header */}
        <header className="mb-8 md:mb-12 text-center space-y-2">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 drop-shadow-sm tracking-tight">
            WebP Converter
          </h1>
          <p className="text-white/60 text-lg md:text-xl font-light tracking-wide">
            Minimal. Fast. Local.
          </p>
        </header>

        {/* Main Interface */}
        <main className="w-full max-w-5xl space-y-8 flex flex-col items-center">

          {/* Drop Zone */}
          <div className="w-full max-w-2xl glass-card p-2 md:p-3 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
            <DropZone onFilesDropped={handleFilesDropped} />
          </div>

          {/* Results Grid */}
          {convertedImages.length > 0 && (
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 animate-in fade-in zoom-in duration-500 slide-in-from-bottom-4">
              {convertedImages.map((image, i) => (
                <div key={`${image.originalFile.name}-${i}`} className="h-64 md:h-72">
                  <ImageCard
                    image={image}
                    onRemove={() => removeImage(i)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Empty State / Prompt (Optional, if list is empty but after initial load) */}

        </main>

        <footer className="mt-auto pt-12 text-center text-white/30 text-xs md:text-sm">
          <p>Privacy focused. Your images never leave your device.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
