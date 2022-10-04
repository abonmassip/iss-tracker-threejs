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
    const response = await fetch('http://api.open-notify.org/iss-now.json');
    const data = await response.json();

    if (data.message === 'success') {
      console.log(data);
      return data;
    } else {
      alert('The API is not working, try again later');
    }
  } catch (error) {
    console.log(error);
    alert('Error fetching ISS location. Try disabling HTTPS-only on your browser and reload the page. The API used is http://open-notify.org/');
  }
}
