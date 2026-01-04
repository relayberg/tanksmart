import { useState, useCallback, useRef } from 'react';

interface Locality {
  name: string;
  postalCode: string;
  municipality?: {
    name: string;
  };
}

interface Street {
  name: string;
  postalCode: string;
  locality: string;
}

interface LocalityApiResponse {
  name: string;
  postalCode: string;
  municipality?: {
    name: string;
  };
}

interface StreetApiResponse {
  name: string;
  postalCode: string;
  locality: {
    name: string;
  };
}

// Cache for street results
const streetCache = new Map<string, Street[]>();

export function useAddressAutocomplete() {
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [streets, setStreets] = useState<Street[]>([]);
  const [isLoadingLocalities, setIsLoadingLocalities] = useState(false);
  const [isLoadingStreets, setIsLoadingStreets] = useState(false);
  const [localityError, setLocalityError] = useState<string | null>(null);
  const [streetError, setStreetError] = useState<string | null>(null);
  const [localityValid, setLocalityValid] = useState(false);

  const streetDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const fetchLocalitiesByPostalCode = useCallback(async (postalCode: string) => {
    // Reset states
    setLocalities([]);
    setLocalityError(null);
    setLocalityValid(false);

    // Validate PLZ format
    if (!/^\d{5}$/.test(postalCode)) {
      return { localities: [], error: null };
    }

    setIsLoadingLocalities(true);

    try {
      const response = await fetch(
        `https://openplzapi.org/de/Localities?postalCode=${postalCode}`
      );

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data: LocalityApiResponse[] = await response.json();

      if (data.length === 0) {
        setLocalityError('PLZ nicht gefunden');
        setIsLoadingLocalities(false);
        return { localities: [], error: 'PLZ nicht gefunden' };
      }

      const mappedLocalities: Locality[] = data.map((item) => ({
        name: item.name,
        postalCode: item.postalCode,
        municipality: item.municipality,
      }));

      setLocalities(mappedLocalities);
      setLocalityValid(true);
      setIsLoadingLocalities(false);

      return { localities: mappedLocalities, error: null };
    } catch (error) {
      console.error('Error fetching localities:', error);
      setLocalityError('Fehler bei der PLZ-Prüfung');
      setIsLoadingLocalities(false);
      return { localities: [], error: 'Fehler bei der PLZ-Prüfung' };
    }
  }, []);

  const fetchStreets = useCallback(
    async (query: string, postalCode: string) => {
      // Clear previous debounce
      if (streetDebounceRef.current) {
        clearTimeout(streetDebounceRef.current);
      }

      // Validate inputs
      if (query.length < 2 || !/^\d{5}$/.test(postalCode)) {
        setStreets([]);
        return;
      }

      // Check cache
      const cacheKey = `${postalCode}-${query.toLowerCase()}`;
      if (streetCache.has(cacheKey)) {
        setStreets(streetCache.get(cacheKey)!);
        return;
      }

      // Debounce the API call
      streetDebounceRef.current = setTimeout(async () => {
        setIsLoadingStreets(true);
        setStreetError(null);

        try {
          const response = await fetch(
            `https://openplzapi.org/de/Streets?name=${encodeURIComponent(query)}&postalCode=${postalCode}&page=1&pageSize=10`
          );

          if (!response.ok) {
            throw new Error('API request failed');
          }

          const data: StreetApiResponse[] = await response.json();

          const mappedStreets: Street[] = data.map((item) => ({
            name: item.name,
            postalCode: item.postalCode,
            locality: item.locality?.name || '',
          }));

          // Cache the results
          streetCache.set(cacheKey, mappedStreets);

          setStreets(mappedStreets);
          setIsLoadingStreets(false);
        } catch (error) {
          console.error('Error fetching streets:', error);
          setStreetError('Fehler bei der Straßensuche');
          setStreets([]);
          setIsLoadingStreets(false);
        }
      }, 300);
    },
    []
  );

  const clearStreets = useCallback(() => {
    setStreets([]);
    setStreetError(null);
  }, []);

  const resetLocalities = useCallback(() => {
    setLocalities([]);
    setLocalityError(null);
    setLocalityValid(false);
  }, []);

  return {
    localities,
    streets,
    isLoadingLocalities,
    isLoadingStreets,
    localityError,
    streetError,
    localityValid,
    fetchLocalitiesByPostalCode,
    fetchStreets,
    clearStreets,
    resetLocalities,
  };
}
