mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map ({
    container: 'map', //containerId
    // Choose from Mapbox's core styles or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-74.5,40],
    zoom: 9
    });




// let mapToken = "<%= process.env.MAP_TOKEN %>";
// let mapToken = mapToken;
// console.log(mapToken);