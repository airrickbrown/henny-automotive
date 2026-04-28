import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { getSiteImages, DEFAULT_IMAGES } from '../lib/siteImages'

type ImagesMap = Record<string, string>

const ImagesContext = createContext<ImagesMap>(DEFAULT_IMAGES)

export function useImages() { return useContext(ImagesContext) }

export function ImagesProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<ImagesMap>(DEFAULT_IMAGES)

  useEffect(() => {
    getSiteImages()
      .then(data => setImages({ ...DEFAULT_IMAGES, ...data }))
      .catch(() => {})

    const channel = supabase
      .channel('site-images-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_images' }, () => {
        getSiteImages()
          .then(data => setImages({ ...DEFAULT_IMAGES, ...data }))
          .catch(() => {})
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return (
    <ImagesContext.Provider value={images}>
      {children}
    </ImagesContext.Provider>
  )
}
