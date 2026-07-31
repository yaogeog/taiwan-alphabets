import { useState } from 'react';
import { getAlphabets } from "../data/getAlphabets";
import { useAudio } from "../hooks/useAudio";

export default function Alphabets() {
  const [viewMode, setViewMode] = useState('taigi');

  const alphabets = getAlphabets(viewMode);
  const [selectedSoundKey, setSelectedSoundKey] = useState(null);
  const { playAudio } = useAudio();

  const handleSoundClick = (typeItemId, sound, e) => {
    e.stopPropagation();
    playAudio(sound.audio);
    const currentKey = `${typeItemId}-${sound.seq}`;
    setSelectedSoundKey(currentKey);
  };

  const langs = [
    { code: 'taigi', name: '台語' },
    { code: 'hakka', name: '客語' },
  ];

  return (
    <div className="min-h-screen bg-mist-200 text-mist-800 antialiased">
      {/* 網頁頁首與標題區 */}
      <header className="pt-6 pb-4 px-4 max-w-3xl mx-auto text-center">
        <h1 className="text-xl font-bold tracking-tight text-mist-900 mb-3">
          臺灣本土語言字母
        </h1>

        <div className="inline-flex p-1 bg-mist-100 rounded-lg gap-1">
          {langs.map((lang) => {
            const isActive = viewMode === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setViewMode(lang.code)}
                className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer ${isActive
                  ? 'bg-white text-lime-700 font-semibold shadow-xs'
                  : 'text-mist-600 font-medium hover:text-mist-900 hover:bg-mist-200/60'
                  }`}
              >
                {lang.name}
              </button>
            );
          })}
        </div>
      </header>

      {/* 主要內容區 */}
      <main className="px-4 pb-24 w-full max-w-xl mx-auto">
        <div
          className="space-y-3"
          onClick={() => setSelectedSoundKey(null)}
        >
          {alphabets
            .sort((a, b) => a.seq - b.seq)
            .map((typeItem, idx) => {
              const sortedSounds = [...typeItem.sounds].sort((a, b) => a.seq - b.seq);

              return (
                <section
                  key={idx}
                  className="bg-white rounded-md p-5 py-4 border border-mist-100 shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* 分類標題區 */}
                  <div className="flex items-baseline gap-3 mb-3">
                    <h2 className="text-lg font-bold text-mist-900">
                      {typeItem.typeName['zh-tw']}
                    </h2>
                    <span className="text-md font-semibold text-lime-700">
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
                            ? 'bg-lime-600 text-white border-lime-600 shadow-md shadow-lime-100 scale-105'
                            : 'bg-mist-100/60 border-mist-200/80 text-mist-700 hover:bg-lime-50 hover:border-lime-200 hover:text-lime-700 active:scale-95'
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
                        className="mt-4 p-2 bg-mist-100/80 rounded-md border border-mist-200/60 animate-in fade-in slide-in-from-top-1 duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {sound.examples?.map((exp, idx) => (
                            <button
                              key={exp.seq || idx}
                              onClick={() => playAudio(exp.audio)}
                              className="flex flex-col items-center justify-center p-2 rounded-lg bg-white border border-mist-200/80 shadow-2xs hover:border-lime-300 hover:shadow-sm active:bg-lime-50/30 transition-all cursor-pointer group text-center"
                            >
                              <span className="font-semibold text-lime-700 transition-transform">
                                {exp.text?.twl}
                              </span>
                              <span className="text-sm text-mist-600 mt-0.5">
                                {exp.text?.twh}
                              </span>
                              {exp.meaning?.['zh-tw'] || exp.meaning?.en ?
                                (<span className="text-xs text-mist-400 mt-0.5">
                                  ( {exp.meaning?.['zh-tw']} / {exp.meaning?.en} )
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