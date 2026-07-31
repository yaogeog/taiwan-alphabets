import { useState, useRef, useEffect } from "react";

const audioUrlPrefix = import.meta.env.VITE_AUDIO_URL || "";
const audioUrlSuffix = ".mp3";

/** 播放音檔 */
export function useAudio() {
  const audioRef = useRef(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = (filename) => {
    if (!filename) {
      console.log("無音檔");
      return;
    }

    const url = audioUrlPrefix + filename + audioUrlSuffix;

    // 1. 如果有舊的音檔正在播，先將它暫停並清空
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // 2. 建立新的 Audio 實例
    const newAudio = new Audio(url);
    audioRef.current = newAudio;
    setCurrentFile(filename);
    setIsPlaying(true);

    // 3. 監聽播放結束
    newAudio.onended = () => {
      setIsPlaying(false);
      setCurrentFile(null);
    };

    // 4. 開始播放
    newAudio.play().catch((err) => {
      console.error("播放失敗:", err);
      setIsPlaying(false);
      setCurrentFile(null);
    });
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
      setCurrentFile(null);
    }
  };

  // 當組件銷毀（切換頁面）時，確保聲音關閉
  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  // 回傳控制狀態與方法
  return { playAudio, stopAudio, currentFile, isPlaying };
}
