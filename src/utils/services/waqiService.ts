
interface Station {
  uid: number;
  aqi: string | number;
  station: {
    name: string;
    geo: [number, number];
  };
}

export async function getStationsInBounds(lat: number, lng: number, distance = 50): Promise<Station[]> {
  try {
    const token = '5a1271b20fbbb9c972814a7b8d31512e061e83e6';
    const response = await fetch(`https://api.waqi.info/map/bounds/?latlng=${lat-distance/100},${lng-distance/100},${lat+distance/100},${lng+distance/100}&token=${token}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching stations: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(`API error: ${data.status}`);
    }
    
    return data.data || [];
  } catch (error) {
    console.error('Error in getStationsInBounds:', error);
    return [];
  }
}

export async function searchStationsNear(lat: number, lng: number, radiusKm: number = 5): Promise<Station[]> {
  try {
    console.log(`Searching for stations near lat=${lat}, lng=${lng}, radius=${radiusKm}km`);
    // Convert km to degrees for bounding box (approximate)
    const boundaryDegree = radiusKm / 111; // ~111km per degree
    const stations = await getStationsInBounds(lat, lng, boundaryDegree * 100);
    
    // Make sure we have valid stations data before returning
    return Array.isArray(stations) ? stations : [];
  } catch (error) {
    console.error('Error searching for stations:', error);
    return [];
  }
}
