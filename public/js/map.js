delete L.Icon.Default.prototype._getIconUrl;

if (!mapCoordinates || mapCoordinates.length !== 2 || (mapCoordinates[0] === 0 && mapCoordinates[1] === 0)) {
    document.getElementById('map').innerHTML = "<p>Location not available for this listing.</p>";
} else {
    const map = L.map('map').setView(
        [mapCoordinates[1], mapCoordinates[0]],
        10
    );

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(map);

const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `
        <svg width="40" height="52" viewBox="0 0 40 52" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 0C8.95 0 0 8.95 0 20c0 14 20 32 20 32s20-18 20-32C40 8.95 31.05 0 20 0z" 
                  fill="#fe424d" 
                  stroke="#ffffff" 
                  stroke-width="2"/>
            <circle cx="20" cy="20" r="8" fill="#ffffff"/>
        </svg>
    `,
    iconSize: [40, 52],
    iconAnchor: [20, 52],     // bottom tip points to exact location
    popupAnchor: [0, -52]
});

    L.marker([mapCoordinates[1], mapCoordinates[0]], { icon: customIcon })
        .addTo(map)
        .bindPopup(`<b>${listingTitle}</b><br>${listingLocation}`)
        .openPopup();
}