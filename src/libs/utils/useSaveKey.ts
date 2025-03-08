"use client"

import { useEffect } from 'react';

export default function useSaveKey(saveFunc: ()=> void) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isMac = window.navigator.userAgent.indexOf("Mac") !== -1;
      const isCtrl = isMac ? e.metaKey : e.ctrlKey;
      if (e.key === 's' && isCtrl) {
        e.preventDefault();
        saveFunc();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [saveFunc])
}