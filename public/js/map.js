
    mapboxgl.accessToken=mapToken;
    const map = new mapboxgl.Map({
         
        // accessToken: 'pk.eyJ1IjoibmF3YXo4OSIsImEiOiJjbXV3ZThtamgwMTMxMnhxeWc1dmc1NmN4In0.kxt7ENchvqqrOm_8RGz6vw',
        container: 'map', // container ID
        center:listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 10// starting zoom
    });

    // console.log(coordinates);

    const marker = new mapboxgl.Marker({color:"red"})
        .setLngLat(listing.geometry.coordinates)
        .setPopup( new mapboxgl.Popup({offset:25})
    .setHTML(`<h4> ${listing.title}</h4>
        <p> EXact location after booking</p>`))
   
        .addTo(map);