import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import customIcon1 from "/images/logo.webp";
import customIcon2 from "/images/vehicle.webp";

const createCustomIcon = (iconUrl) =>
  L.icon({
    iconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

const MapWithMarkers = () => {
  const isLargeScreen = window.innerWidth > 900;

  const center = [53.4835, -2.2422];
  const logoMarkers = [
    [53.4612, -2.2478],
    [53.4893, -2.1934],
    [53.5189, -2.2098],
    [53.4921, -2.2156],
    [53.4754, -2.2289],
    [53.4832, -2.2457],
    [53.4967, -2.2283],
  ];
  const vehicleMarkers = [
    [53.4794, -2.2453],
    [53.4807, -2.2367],
    [53.4668, -2.2908],
    [53.5118, -2.2118],
    [53.4547, -2.2681],
  ];

  const bannerImages = [
    { src: "/images/map_banner/1.png", url: "https://example.com/1" },
    { src: "/images/map_banner/2.png", url: "https://example.com/2" },
    { src: "/images/map_banner/3.png", url: "https://example.com/3" },
    { src: "/images/map_banner/4.png", url: "https://example.com/4" },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % bannerImages.length
      );
    }, 10000); // Change image every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "75vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {logoMarkers.map((position, index) => (
        <Marker
          position={position}
          icon={createCustomIcon(customIcon1)}
          key={index}
        ></Marker>
      ))}

      {vehicleMarkers.map((position, index) => (
        <Marker
          position={position}
          icon={createCustomIcon(customIcon2)}
          key={index}
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
          //border: "5px solid #b50000",
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
