import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import customIcon1 from "/images/logo.webp";
import customIcon2 from "/images/vehicle.webp";
import { getIncidents } from "../services/incidents";
import { deleteVehicle, getVehicles } from "../services/vehicles";
import { message, Button } from "antd";
import { useNavigate } from "react-router-dom";

const createCustomIcon = (iconUrl) =>
  L.icon({
    iconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

const MapWithMarkers = () => {
  const isLargeScreen = window.innerWidth > 900;

  const defaultCenter = [53.4835, -2.2422];

  const bannerImages = [
    { src: "/images/map_banner/1.png", url: "https://example.com/1" },
    { src: "/images/map_banner/2.png", url: "https://example.com/2" },
    { src: "/images/map_banner/3.png", url: "https://example.com/3" },
    { src: "/images/map_banner/4.png", url: "https://example.com/4" },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [center, setCenter] = useState(defaultCenter);
  const [incidents, setIncidents] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [map, setMap] = useState(null);
  const [update, setUpdate] = useState(false);

  const navigate = useNavigate();
  const navigateToDetails = (incidentId) => {
    navigate(`/incident-details/${incidentId}`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % bannerImages.length
      );
    }, 10000); // Change image every 10 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getFireIncidents = async () => {
      try {
        const response = await getIncidents();
        if (Array.isArray(response)) {
          setIncidents(response);
          if (response.length > 0) {
            setCenter(response[0].location);
          }
        } else {
          message.error("Error fetching incidents");
        }
      } catch (error) {
        message.error("Error fetching incidents");
        console.error("Error fetching incidents:", error);
      }
    };
    const getFireVehicles = async () => {
      try {
        const response = await getVehicles();
        if (Array.isArray(response)) {
          setVehicles(response);
        } else {
          message.error("Error fetching vehicles");
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        message.error("Error fetching vehicles");
      }
    };

    getFireIncidents();
    getFireVehicles();
  }, [update]);

  useEffect(() => {
    if (center) {
      if (map) {
        map.flyTo(center);
      }
    }
  }, [center]);
  useEffect(() => {
    if (map) {
      vehicles.forEach((vehicle) => {
        if (vehicle.marker) {
          const start = vehicle.marker.getLatLng();
          const startTime = performance.now();
          const end = L.latLng(vehicle.destination);
          const duration = vehicle.travelTime;
          const reachTime = new Date(vehicle.reachTime).getTime();
          const currentTime = Date.now();
          const elapsedTime = currentTime - (reachTime - duration);
          const progress = Math.min(elapsedTime / duration, 1);

          // Set initial position based on progress
          const currentLat = start.lat + (end.lat - start.lat) * progress;
          const currentLng = start.lng + (end.lng - start.lng) * progress;
          vehicle.marker.setLatLng([currentLat, currentLng]);

          // Animation function to update position over time
          const animate = (currentTime) => {
            const currentTimeNow = Date.now();
            const elapsedTime = currentTimeNow - (reachTime - duration);
            const progress = Math.min(elapsedTime / duration, 1);

            // Set initial position based on progress
            const currentLat = start.lat + (end.lat - start.lat) * progress;
            const currentLng = start.lng + (end.lng - start.lng) * progress;
            vehicle.marker.setLatLng([currentLat, currentLng]);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              vehicle.marker.bindPopup("Vehicle arrived").openPopup();
              vehicle.marker.on("popupclose", async () => {
                await deleteVehicle(vehicle?._id);
                setUpdate(!update);
              });
            }
          };

          // Start the animation
          requestAnimationFrame(animate);
        }
      });
    }
  }, [vehicles, map]);

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "75vh", width: "100%" }}
      ref={setMap}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {incidents?.map((incident, index) => (
        <Marker
          position={incident?.location}
          icon={createCustomIcon(customIcon1)}
          key={index}
        >
          <Popup position={incident?.location}>
            <div>
              <h3>{incident.title}</h3>
              <p>{incident.description?.substring(0, 100)}...</p>
              <Button
                type="primary"
                onClick={() => navigateToDetails(incident._id)}
              >
                Details
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}

      {vehicles.map((vehicle, index) => (
        <Marker
          position={vehicle?.location}
          icon={createCustomIcon(customIcon2)}
          key={index}
          ref={(marker) => {
            vehicle.marker = marker;
          }}
        ></Marker>
      ))}

      <div
        style={{
          position: "absolute",
          top: "25px",
          left: "50px",
          width: isLargeScreen ? "350px" : "180px",
          height: isLargeScreen ? "250px" : "150px",
          backgroundColor: "#b50000",
          borderRadius: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
        }}
      >
        <img
          src={bannerImages[currentImageIndex]?.src}
          onClick={() =>
            window.open(bannerImages[currentImageIndex]?.url, "_blank")
          }
          alt="Advertisement"
          style={{
            width: "90%",
            height: "90%",
            objectFit: "cover",
            transition: "opacity 1s ease-in-out",
          }}
        />
      </div>
    </MapContainer>
  );
};

export default MapWithMarkers;
