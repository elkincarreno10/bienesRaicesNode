(function() {
    
    // Logical Or
    const lat = document.querySelector('#lat').value || 8.2386949;
    const lng = document.querySelector('#lng').value || -73.3524963;
    const mapa = L.map('mapa').setView([lat, lng ], 15); 
    let marker;

    // Utilizar Provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService()

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // EL Pin
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(mapa)

    // Detecta el movimiento del pin
    marker.on('moveend', function(e) {
        marker = e.target

        const posicion = marker.getLatLng()

        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))

        // Obtener la información de la calle al soltar el pin
        geocodeService.reverse().latlng(posicion, 13).run(function(error, resultado) {

            marker.bindPopup(resultado.address.LongLabel)

            console.log(resultado)

            // Llenar los campos
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? ''
            document.querySelector('#calle').value = resultado?.address?.Address ?? ''
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? ''
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? ''
        })
    })

})()