export const degreesToRadians = (degrees) => degrees * (Math.PI / 180);

export const positionFromCoordinates = (lat, lon, r) => {
  const latRad = degreesToRadians(90 - lat);
  const lonRad = degreesToRadians(lon);

  const z = r * Math.cos(lonRad) * Math.sin(latRad);
  const x = r * Math.sin(lonRad) * Math.sin(latRad);
  const y = r * Math.cos(latRad);

  return {x, y, z};
}

export const fetchIssCoordinates = async () => {
  try {
    const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    alert('Error fetching ISS location');
  }
}
