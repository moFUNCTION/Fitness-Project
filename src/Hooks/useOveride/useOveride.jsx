import React, { useEffect } from "react";

export const useOveride = () => {
  useEffect(() => {
    const handler = (e) => {
      e.stopImmediatePropagation();
    };
    document.addEventListener("wheel", handler, {
      capture: true,
      passive: true,
    });
    return () => {
      document.removeEventListener("wheel", handler);
    };
  }, []);
};
