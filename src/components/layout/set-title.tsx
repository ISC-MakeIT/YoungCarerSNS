"use client";

import { useEffect } from "react";
import { useTitle } from "./title-context";

export function SetTitle({ title }: { title: string }) {
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);

  return null;
}
