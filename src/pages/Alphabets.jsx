import { useState } from 'react';
import { getAlphabets } from "../data/getAlphabets";
import { useAudio } from "../hooks/useAudio";
import { Volume2, VolumeOff } from 'lucide-react';

export default function Alphabets() {
  const [viewMode, setViewMode] = useState('taigi');
  const [isVolumeOn, setIsVolumeOn] = useState(true);

  const alphabets = getAlphabets(viewMode);
  const [selectedSoundKey, setSelectedSoundKey] = useState(null);
  const { playAudio } = useAudio();

  const handleSoundClick = (typeItemId, sound, e) => {
    e.stopPropagation();
    if (isVolumeOn) {
      playAudio(sound.audio);
    }
    const currentKey = `${typeItemId}-${sound.seq}`;
    setSelectedSoundKey(currentKey);
  };

  const langs = [
    { code: 'taigi', name: '台語' },
    { code: 'hakka', name: '客語' },
  ];

  return (
    <div className="min-h-screen bg-taupe-200 text-taupe-800 antialiased">
      {/* 網頁頁首與標題區 */}
      <header className="pt-6 pb-4 px-4 max-w-xl mx-auto text-center">
        <h1 className="text-2xl font-bold tracking-tight text-taupe-800 mb-2">
          臺灣語言字母
        </h1>

        <div className='flex items-center justify-between gap-3 px-3 py-2 w-full mx-auto bg-taupe-100 rounded-lg shadow-sm'>
          <div className="inline-flex gap-2">
            {langs.map((lang) => {
              const isActive = viewMode === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setViewMode(lang.code)}
                  className={`px-4 py-1.5 rounded-lg text-lg transition-all duration-200 cursor-pointer ${isActive
                    ? 'bg-taupe-50 text-taupe-800 font-bold shadow-xs'
                    : 'text-taupe-500 font-medium hover:text-taupe-600 hover:bg-taupe-200/60'
                    }`}
                >
                  {lang.name}
                </button>
              );
            })}
          </div>

          <div>
            <button
              onClick={() => setIsVolumeOn(!isVolumeOn)}
              className="rounded-full p-2 cursor-pointer text-taupe-500"
            >
              {isVolumeOn ? <Volume2 size={18} /> : <VolumeOff size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* 主要內容區 */}
      <main className="px-4 pb-24 w-full max-w-xl mx-auto">
        <div
          className="space-y-4"
          onClick={() => setSelectedSoundKey(null)}
        >
          {alphabets
            .sort((a, b) => a.seq - b.seq)
            .map((typeItem, idx) => {
              const sortedSounds = [...typeItem.sounds].sort((a, b) => a.seq - b.seq);

              return (
                <section
                  key={idx}
                  className="bg-taupe-100 rounded-md p-5 py-4 border border-taupe-200 shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* 分類標題區 */}
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-3 px-1">
                    <h2 className="text-lg font-bold text-taupe-800 whitespace-nowrap">
                      {typeItem.typeName['zh-tw']}
                    </h2>
                    <span className="text-md font-semibold text-lime-700 whitespace-nowrap">
                      {typeItem.typeName['en']}
                    </span>
                  </div>

                  {/* 字母網格 */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                    {sortedSounds?.map((sound) => {
                      const currentKey = `${idx}-${sound.seq}`;
                      const isSelected = selectedSoundKey === currentKey;

                      return (
                        <button
                          key={sound.seq}
                          onClick={(e) => handleSoundClick(idx, sound, e)}
                          className={`group flex flex-col items-center justify-center p-1.5 rounded-md border font-semibold text-lg transition-all cursor-pointer ${isSelected
                            ? 'bg-lime-600 text-white border-lime-600 shadow-md scale-105'
                            : 'bg-taupe-50 border-taupe-300 text-taupe-700 hover:bg-lime-50 hover:border-lime-500 hover:text-lime-700 active:scale-95'
                            }`}
                        >
                          <span>{sound.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* 展開的範例詞彙區 */}
                  {sortedSounds.map((sound) => {
                    const currentKey = `${idx}-${sound.seq}`;
                    const isSelected = selectedSoundKey === currentKey;

                    if (!isSelected) return null;

                    return (
                      <div
                        key={`exp-${currentKey}`}
                        className="mt-3 px-3 py-2 bg-taupe-200 rounded-md animate-in fade-in slide-in-from-top-1 duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {sound.examples?.map((exp, idx) => (
                            <button
                              key={exp.seq || idx}
                              onClick={() => playAudio(exp.audio)}
                              className="flex flex-col items-center justify-center p-2 rounded-lg bg-taupe-50 border border-taupe-200 shadow-xs hover:border-lime-300 hover:shadow-sm active:bg-lime-50 transition-all cursor-pointer group text-center"
                            >
                              <span className="font-semibold text-lime-700 transition-transform">
                                {exp.text?.twl}
                              </span>
                              <span className="text-sm text-taupe-600 mt-0.5">
                                {exp.text?.twh}
                              </span>
                              {exp.meaning?.['zh-tw'] || exp.meaning?.en ?
                                (<span className="text-xs text-taupe-500 mt-0.5">
                                  {exp.meaning?.['zh-tw']} / {exp.meaning?.en}
                                </span>)
                                : null
                              }
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </section>
              );
            })}
        </div>
      </main>
    </div>
  );
}