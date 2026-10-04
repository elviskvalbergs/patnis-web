'use client'
import {useEffect} from 'react'

// Runs a carried-over page script as a classic global <script>, so inline handlers like onclick="toggleDocs()" work.
// The block wrapper keeps const/let local (the script runs again on revisits and in React dev double-effects),
// while function declarations inside a block still become globals in non-strict scripts.
export function LegacyScript({code}: {code: string}) {
  useEffect(() => {
    const el = document.createElement('script')
    el.textContent = `{\n${code}\n}`
    document.body.appendChild(el)
    return () => el.remove()
  }, [code])
  return null
}
