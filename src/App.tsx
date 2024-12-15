import { useCallback, useEffect, useRef, useState } from 'react'
import { useGoogleMaps } from './google-maps/gmaps-provider'
import { GoogleMap } from '@react-google-maps/api'
import MapPin from './components/icon/map-pin'
import MapMarker from './components/icon/map-marker'

const center = {
  lat: -6.175335742705534,
  lng: 106.8271482622298,
}

function App() {
  const { isLoaded } = useGoogleMaps()
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const [currentPosition, setCurrentPosition] = useState(center)
  const [address, setAddress] = useState('')

  useEffect(() => {
    if (isLoaded) {
      mapGeocoder(new google.maps.LatLng(currentPosition.lat, currentPosition.lng))
    }

    if (isLoaded && inputRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode', 'establishment'],
        fields: ['formatted_address', 'geometry.location', 'name', 'plus_code'],
        componentRestrictions: { country: 'ID' },
      })

      // Event listener untuk menangkap hasil pilihan user
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace()
        if (place?.geometry?.location && place?.formatted_address) {
          const lat = place.geometry.location.lat()
          const lng = place.geometry.location.lng()
          setCurrentPosition({ lat, lng })
          setAddress(place.formatted_address)
        }
      })
    }
  }, [isLoaded])

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords
        setCurrentPosition({ lat: latitude, lng: longitude })
      },
      err => {
        alert('Unable to retrieve your location: ' + err.message)
      },
    )
  }

  const mapGeocoder = (location: google.maps.LatLng) => {
    const geocoder = new google.maps.Geocoder()

    geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        const components = results[0].address_components
        const fullAddress = results[0].formatted_address
        const location = results[0].geometry.location

        // Ambil data spesifik
        const street = components.find(c => c.types.includes('route'))?.long_name || 'N/A'
        const village =
          components.find(c => c.types.includes('administrative_area_level_3'))?.long_name ||
          components.find(c => c.types.includes('sublocality_level_1'))?.long_name ||
          'N/A'
        const subDistrict = components.find(c => c.types.includes('administrative_area_level_3'))?.long_name || 'N/A'
        const city = components.find(c => c.types.includes('administrative_area_level_2'))?.long_name || 'N/A'
        const province = components.find(c => c.types.includes('administrative_area_level_1'))?.long_name || 'N/A'
        const postalCode = components.find(c => c.types.includes('postal_code'))?.long_name || 'N/A'
        const country = components.find(c => c.types.includes('country'))?.long_name || 'N/A'

        console.log('Street:', street)
        console.log('Village:', village)
        console.log('Sub-District (Kecamatan):', subDistrict)
        console.log('City:', city)
        console.log('Province:', province)
        console.log('Postal Code:', postalCode)
        console.log('Country:', country)
        console.log('Location:', location)

        setAddress(fullAddress)
      } else {
        console.error('Geocoding failed:', status)
      }
    })
  }

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    // Tambahkan listener dragend pada peta
    map.addListener('dragend', () => {
      const lat = map.getCenter()?.lat()
      const lng = map.getCenter()?.lng()

      if (lat && lng) {
        setCurrentPosition({ lat, lng })
        const latLng = new google.maps.LatLng(lat, lng)

        mapGeocoder(latLng)
      }
    })
  }, [])

  return (
    <div className='flex flex-col items-center h-screen pt-20'>
      {!isLoaded ? (
        <div>Loading...</div>
      ) : (
        <div className='w-[80%] h-[50%] relative'>
          {/* Input Autocomplete */}
          <div className='absolute top-4 left-4 bg-white p-2 shadow-md z-20'>
            <input
              ref={inputRef}
              type='text'
              placeholder='Cari alamat...'
              className='p-2 border border-gray-300 rounded-md w-72'
            />
          </div>

          <GoogleMap
            mapContainerStyle={{ height: '100%', width: '100%' }}
            center={currentPosition}
            zoom={18}
            onLoad={handleMapLoad}
            options={{
              disableDefaultUI: true,
              gestureHandling: 'greedy',
            }}
          >
            <MapPin className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-full text-black size-12' />
          </GoogleMap>

          <button
            className='absolute top-4 right-4 bg-white p-2 shadow-md z-20 flex items-center'
            onClick={getCurrentLocation}
          >
            <MapMarker className='text-red-500 size-6 me-2' />
            Lokasi Saat Ini
          </button>
        </div>
      )}

      <div className='mt-10 space-y-5 max-w-lg'>
        <div className='rounded shadow space-y-2 p-5'>
          <h3 className='font-semibold'>Latitude Longitude</h3>
          <p>{`${currentPosition.lat}, ${currentPosition.lng}`}</p>
        </div>

        <div className='rounded shadow space-y-2 p-5'>
          <h3 className='font-semibold'>Alamat</h3>
          <p>{address}</p>
        </div>
      </div>
    </div>
  )
}

export default App
