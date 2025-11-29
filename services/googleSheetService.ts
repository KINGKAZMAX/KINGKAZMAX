import Papa from 'papaparse';
import { LocationStatus, Contact } from '../types';

// This file might be deprecated or used by other components in the future.
// For now, the main sheet fetching function is removed as its component was replaced.

// If other sheet parsing is needed, new functions can be added here.

// FIX: Re-implementing fetchLocationStatusFromSheet to fix compile error in LocationStatusBoard.tsx.
// This allows the LocationStatusBoard component to function as intended by fetching live data from the specified Google Sheet.
export const fetchLocationStatusFromSheet = (): Promise<LocationStatus[]> => {
  const SHEET_ID = '1C0jp45oyC0zMeBq2mcvPxWmkln8lZw3ELxajxdsuhYg';
  const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

  return new Promise((resolve, reject) => {
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data as Record<string, string>[];
          const locations: LocationStatus[] = data
            // FIX: Add an explicit return type to the .map() callback. This prevents TypeScript from inferring a stricter type
            // for the returned object literal, which would be incompatible with the 'loc is LocationStatus' type predicate below.
            .map((row, index): LocationStatus | null => {
              if (!row.location_name || row.location_name.trim() === '') {
                return null;
              }

              const contacts: Contact[] = [];
              if (row.contact_name_1 && row.contact_phone_1) {
                contacts.push({ name: row.contact_name_1.trim(), phone: row.contact_phone_1.trim() });
              }
              if (row.contact_name_2 && row.contact_phone_2) {
                contacts.push({ name: row.contact_name_2.trim(), phone: row.contact_phone_2.trim() });
              }
              
              let needsSupport: boolean | string | null = null;
              const supportStatus = row.needs_support?.trim().toUpperCase();
              if (supportStatus === 'TRUE') {
                needsSupport = true;
              } else if (supportStatus === 'FALSE') {
                needsSupport = false;
              } else if (row.needs_support) {
                needsSupport = row.needs_support.trim();
              }

              return {
                id: `sheet-${index}-${row.location_name.trim()}`,
                location_name: row.location_name.trim(),
                contacts,
                current_status: row.current_status?.trim() || '',
                needs_support: needsSupport,
                needed_items: row.needed_items ? row.needed_items.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
              };
            })
            .filter((loc): loc is LocationStatus => loc !== null);
          
          resolve(locations);
        } catch (error) {
          console.error('Error processing sheet data:', error);
          reject(error);
        }
      },
      error: (error) => {
        console.error('Error fetching sheet data:', error);
        reject(error);
      }
    });
  });
};