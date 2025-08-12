'use client';

import { useState, useEffect } from 'react';
interface GoogleFont {
  family: string;
  variants: string[];
}

const GOOGLE_FONTS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY;
const GOOGLE_FONTS_API_URL = 'https://www.googleapis.com/webfonts/v1/webfonts';

export function useGoogleFonts() {
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        setLoading(true);
        
        // Fallback popular fonts if API key is not available
        if (!GOOGLE_FONTS_API_KEY) {
          const popularFonts: GoogleFont[] = [
            { family: 'Open Sans', variants: ['300', '400', '600', '700'] },
            { family: 'Roboto', variants: ['300', '400', '500', '700'] },
            { family: 'Lato', variants: ['300', '400', '700'] },
            { family: 'Montserrat', variants: ['300', '400', '500', '600', '700'] },
            { family: 'Source Sans Pro', variants: ['300', '400', '600', '700'] },
            { family: 'Poppins', variants: ['300', '400', '500', '600', '700'] },
            { family: 'Playfair Display', variants: ['400', '700'] },
            { family: 'Inter', variants: ['300', '400', '500', '600', '700'] },
            { family: 'Nunito', variants: ['300', '400', '600', '700'] },
            { family: 'Merriweather', variants: ['300', '400', '700'] },
            { family: 'Oswald', variants: ['300', '400', '500', '600', '700'] },
            { family: 'Raleway', variants: ['300', '400', '500', '600', '700'] },
            { family: 'PT Sans', variants: ['400', '700'] },
            { family: 'Ubuntu', variants: ['300', '400', '500', '700'] },
            { family: 'Quicksand', variants: ['300', '400', '500', '600', '700'] },
          ];
          setFonts(popularFonts);
          setLoading(false);
          return;
        }

        const response = await fetch(`${GOOGLE_FONTS_API_URL}?key=${GOOGLE_FONTS_API_KEY}&sort=popularity`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch Google Fonts');
        }

        const data = await response.json();
        const formattedFonts: GoogleFont[] = data.items.slice(0, 100).map((font: any) => ({
          family: font.family,
          variants: font.variants,
        }));

        setFonts(formattedFonts);
        setError(null);
      } catch (err) {
        console.error('Error fetching Google Fonts:', err);
        setError('Failed to load fonts');
        
        // Use fallback fonts on error
        const fallbackFonts: GoogleFont[] = [
          { family: 'Open Sans', variants: ['300', '400', '600', '700'] },
          { family: 'Roboto', variants: ['300', '400', '500', '700'] },
          { family: 'Lato', variants: ['300', '400', '700'] },
        ];
        setFonts(fallbackFonts);
      } finally {
        setLoading(false);
      }
    };

    fetchFonts();
  }, []);

  return { fonts, loading, error };
}