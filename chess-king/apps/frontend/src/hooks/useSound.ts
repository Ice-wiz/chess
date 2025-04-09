import { useSoundContext } from "../context/SoundContext";

const audioCache: Record<string, HTMLAudioElement> = {};

export const useSound = () => {
  const { enabled } = useSoundContext();

  const play = (name: string) => {
    if (!enabled) return;
    if (!audioCache[name]) {
      const audio = new Audio(`sounds/${name}.mp3`);
      audioCache[name] = audio;
    }

    const sound = audioCache[name];
    sound.currentTime = 0;
    sound.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  };

  return { play };
};
