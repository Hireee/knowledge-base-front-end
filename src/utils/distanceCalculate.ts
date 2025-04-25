const getDistance = (location1:any, location2:any) => {
  console.log(location1,location2);
  
    const lat1 = parseFloat(location1.latitude);
    const lon1 = parseFloat(location1.longitude);
    const lat2 = parseFloat(location2.latitude);
    const lon2 = parseFloat(location2.longitude);
    console.log(lat1,lat2);
    console.log(lon1,lon2);
    
  
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    const distance = R * c; // Distance in kilometers
    return distance;
  }
  
  export default getDistance;
  