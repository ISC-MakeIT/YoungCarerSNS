"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

interface TitleData {
  name: string;
  userId?: string;
  lastActiveAt?: string | null;
}

interface TitleContextType {
  title: string; // compatibility with existing code
  titleData: TitleData;
  setTitle: (value: string | TitleData) => void;
}

const TitleContext = createContext<TitleContextType | undefined>(undefined);

export function TitleProvider({ children }: { children: React.ReactNode }) {
  const [titleData, setTitleData] = useState<TitleData>({ name: "YoungCarer SNS" });

  const setTitle = useCallback((value: string | TitleData) => {
    const newData = typeof value === "string" ? { name: value } : value;
    
    setTitleData((prev) => {
      // 値が変わっていない場合は更新しない（無限ループ防止の2段構え）
      if (
        prev.name === newData.name &&
        prev.userId === newData.userId &&
        prev.lastActiveAt === newData.lastActiveAt
      ) {
        return prev;
      }
      return newData;
    });
  }, []);

  const value = useMemo(() => ({
    title: titleData.name,
    titleData,
    setTitle,
  }), [titleData, setTitle]);

  return (
    <TitleContext.Provider value={value}>
      {children}
    </TitleContext.Provider>
  );
}

export function useTitle() {
  const context = useContext(TitleContext);
  if (!context) {
    throw new Error("useTitle must be used within a TitleProvider");
  }
  return context;
}
