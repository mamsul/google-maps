import { createContext, memo, useContext } from 'react'
import { Libraries, useJsApiLoader } from '@react-google-maps/api'

interface IGoogleMapsContext {
  isLoaded: boolean
  error: Error | undefined
}

const GoogleMapsContext = createContext<IGoogleMapsContext | null>(null)

const libraries = ['places']

function GoogleMapsProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_APP_GMAPS_API_KEY,
    region: 'ID',
    libraries: libraries as Libraries,
  })

  return <GoogleMapsContext.Provider value={{ isLoaded, error: loadError }}>{children}</GoogleMapsContext.Provider>
}

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext)

  if (!context) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider')
  }
  return context
}

export default memo(GoogleMapsProvider)
