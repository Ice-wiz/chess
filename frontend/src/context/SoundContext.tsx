import { useContext, useState, createContext } from "react";
import React from "react";

type SonundContextType = {
  enabled: boolean;
  toggleSound: () => void;
};

const SoundContext = createContext<SonundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
  const [enabled, setEnabled] = useState(true);
  const toggleSound = () => setEnabled((prev) => !prev);
  return (
    <SoundContext.Provider value={{enabled, toggleSound}}>
        {children}
    </SoundContext.Provider>
  )
};

export const useSoundContext = () => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error("useSoundContext must be used within a SoundProvider");
    }
    return context;
}

