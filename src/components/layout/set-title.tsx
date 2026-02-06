"use client";

import { useEffect } from "react";
import { useTitle } from "./title-context";

interface SetTitleProps {
  title: string;
  userId?: string;
  lastActiveAt?: string | null;
}

export function SetTitle({ title, userId, lastActiveAt }: SetTitleProps) {
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle({ name: title, userId, lastActiveAt });
  }, [title, userId, lastActiveAt, setTitle]);

  return null;
}
