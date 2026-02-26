import { createContext, useContext, useState } from 'react'

const LangContext = createContext({ lang: 'uz', setLang: () => {} })

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('admin_lang') || 'uz')

  const handleSetLang = (l) => {
    setLang(l)
    localStorage.setItem('admin_lang', l)
  }

  return (
    <LangContext.Provider value={{ lang, setLang: handleSetLang }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
