import React, { useState, useEffect, useRef } from 'react';
import './styles.js'; // Your CSS styles

const MapComponent = () => {
  const [departurePoint, setDeparturePoint] = useState('');
  const [destinationPoint, setDestinationPoint] = useState('');
  const [activeInput, setActiveInput] = useState(null);
  const [map, setMap] = useState(null);
  const [departureMarker, setDepartureMarker] = useState(null);
  const [destinationMarker, setDestinationMarker] = useState(null);
  const mapRef = useRef(null);

  const API_KEY = 'RVVfMmRhYjA3ZDdmYWMxNGNjN2FiZTU3OWRmNjMyYzkyMDc6NWMzMTA2OWUtMTBlYy00MTIxLWEwNjEtYTliNmQwNTgyNTQw';

  useEffect(() => {
    // Load MapLibre CSS and JS dynamically
    const loadMapLibre = async () => {
      // Load CSS
      if (!document.querySelector('link[href*="maplibre-gl.css"]')) {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css';
        document.head.appendChild(cssLink);
      }

      // Load JS
      if (!window.maplibregl) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.js';
        script.onload = initializeMap;
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    loadMapLibre();
  }, []);

  const initializeMap = () => {
    if (typeof window.maplibregl !== 'undefined' && mapRef.current) {
      // Set up RTL text plugin
      window.maplibregl.setRTLTextPlugin(
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
        null,
        true
      );

      const mapInstance = new window.maplibregl.Map({
        container: mapRef.current,
        zoom: 13,
        pitch: 0,
        minZoom: 2,
        center: [23.6, 46.7667], // [lng, lat] for Cluj-Napoca
        antialias: true,
        hash: true,
        style: 'https://vectormaps-resources.myptv.com/styles/latest/standard.json',
        transformRequest: (url, resourceType) => {
          if (resourceType === 'Tile' && url.startsWith('https://api.myptv.com')) {
            return {
              url: url + '?apiKey=' + API_KEY
            }
          }
        }
      });

      // Add controls
      mapInstance.addControl(new window.maplibregl.NavigationControl());
      mapInstance.addControl(new window.maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
      }));

      // Handle map clicks - MapLibre uses different event structure
      mapInstance.on('click', handleMapClick);
      
      setMap(mapInstance);
    } else {
      console.error('MapLibre GL JS library not loaded');
    }
  };

  const handleMapClick = (e) => {
    const { lng, lat } = e.lngLat; // MapLibre uses lngLat, not latlng
    
    if (activeInput === 'departure') {
      setDeparturePoint(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      addDepartureMarker(lng, lat);
    } else if (activeInput === 'destination') {
      setDestinationPoint(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      addDestinationMarker(lng, lat);
    }
  };

  const addDepartureMarker = (lng, lat) => {
    if (departureMarker) {
      departureMarker.remove();
    }

    // Create marker element
    const el = document.createElement('div');
    el.style.backgroundColor = '#4CAF50';
    el.style.width = '20px';
    el.style.height = '20px';
    el.style.borderRadius = '50%';
    el.style.border = '2px solid white';

    const marker = new window.maplibregl.Marker(el)
      .setLngLat([lng, lat])
      .addTo(map);

    setDepartureMarker(marker);
  };

  const addDestinationMarker = (lng, lat) => {
    if (destinationMarker) {
      destinationMarker.remove();
    }

    // Create marker element
    const el = document.createElement('div');
    el.style.backgroundColor = '#F44336';
    el.style.width = '20px';
    el.style.height = '20px';
    el.style.borderRadius = '50%';
    el.style.border = '2px solid white';

    const marker = new window.maplibregl.Marker(el)
      .setLngLat([lng, lat])
      .addTo(map);

    setDestinationMarker(marker);
  };

  const handleInputFocus = (inputType) => {
    setActiveInput(inputType);
  };

  const clearMarkers = () => {
    if (departureMarker) {
      departureMarker.remove();
      setDepartureMarker(null);
    }
    if (destinationMarker) {
      destinationMarker.remove();
      setDestinationMarker(null);
    }
    setDeparturePoint('');
    setDestinationPoint('');
  };

  const searchRoute = () => {
    if (departurePoint && destinationPoint) {
      console.log('Searching route from:', departurePoint, 'to:', destinationPoint);
      // Implement PTV Routing API call here
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1 className="header-title">MacBook Air - 1</h1>
      </div>

      {/* Search Container */}
      <div className="search-container">
        <div className="search-bar">
          <span className="search-placeholder">Search bar</span>
        </div>
        <div className="selection-container">
          <span className="selection-title">Selecteaza:</span>
          <button
            className={`selection-button ${activeInput === 'departure' ? 'active' : ''}`}
            onClick={() => handleInputFocus('departure')}
          >
            Punct de plecare
          </button>
          <button
            className={`selection-button ${activeInput === 'destination' ? 'active' : ''}`}
            onClick={() => handleInputFocus('destination')}
          >
            Punct de destinatie
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="map-container">
        <div
          ref={mapRef}
          className="map"
          style={{ width: '100%', height: '400px' }}
        />

        {/* Map overlay with selected points */}
        {(departurePoint || destinationPoint) && (
          <div className="map-overlay">
            <div className="points-container">
              {departurePoint && (
                <p className="point-text">
                  Plecare: {departurePoint}
                </p>
              )}
              {destinationPoint && (
                <p className="point-text">
                  Destinatie: {destinationPoint}
                </p>
              )}
              <div className="overlay-buttons">
                <button className="clear-button" onClick={clearMarkers}>
                  Clear
                </button>
                <button className="route-button" onClick={searchRoute}>
                  Search Route
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom instruction */}
      <div className="instruction-container">
        <p className="instruction-text">
          {activeInput === 'departure'
            ? 'Tap pe hartă pentru a selecta punctul de plecare'
            : activeInput === 'destination'
            ? 'Tap pe hartă pentru a selecta punctul de destinație'
            : 'Selectează un tip de punct și apoi tap pe hartă'
          }
        </p>
      </div>
    </div>
  );
};

export default MapComponent;