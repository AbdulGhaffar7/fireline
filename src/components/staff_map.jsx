import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { Modal, Input, Button, Spin } from "antd";
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

const StaffMap = () => {
  const isLargeScreen = window.innerWidth > 900;
  const [modalVisible, setModalVisible] = useState(false);
  const [newIncident, setNewIncident] = useState({
    lat: null,
    lng: null,
    address: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchAddress = async (lat, lng) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      setNewIncident((prev) => ({
        ...prev,
        address: data.display_name || "Address not found",
      }));
    } catch (error) {
      console.error("Error fetching address:", error);
      setNewIncident((prev) => ({
        ...prev,
        address: "Error fetching address",
      }));
    }
    setLoading(false);
  };

  const handleMapClick = (lat, lng) => {
    setNewIncident({ lat, lng, address: "", description: "" });
    setModalVisible(true);
    fetchAddress(lat, lng); // Fetch the address
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!newIncident.description) {
      alert("Please enter a description!");
      return;
    }

    console.log("Submitting:", newIncident);

    setIncidents([...incidents, { ...newIncident, id: incidents.length + 1 }]);
    setModalVisible(false);
  };

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

  const [incidents, setIncidents] = useState([...logoMarkers]);

  const bannerImages = [
    { src: "/images/map_banner/1.png", url: "https://example.com/1" },
    { src: "/images/map_banner/2.png", url: "https://example.com/2" },
    { src: "/images/map_banner/3.png", url: "https://example.com/3" },
    { src: "/images/map_banner/4.png", url: "https://example.com/4" },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setNewIncident([]);
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % bannerImages.length
      );
    }, 10000); // Change image every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const addIncident = (lat, lng) => {
    const description = prompt("Enter fire incident details:");
    if (description) {
      setIncidents([
        ...incidents,
        { id: incidents.length + 1, lat, lng, description },
      ]);
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        handleMapClick(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "75vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClickHandler />
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

      <Modal
        title="Add Fire Incident"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        destroyOnClose
      >
        <p>
          <strong>Latitude:</strong> {newIncident.lat}
        </p>
        <p>
          <strong>Longitude:</strong> {newIncident.lng}
        </p>
        <p>
          <strong>Address:</strong>
        </p>
        <Input.TextArea
          placeholder="Enter address"
          value={loading ? "Loading..." : newIncident.address}
          onChange={(e) =>
            setNewIncident({ ...newIncident, address: e.target.value })
          }
          style={{
            margin: "0px 0px 10px 0px",
          }}
          rows={3}
        />

        <p>
          <strong>Details:</strong>
        </p>

        <Input.TextArea
          placeholder="Enter incident description"
          value={newIncident.description}
          onChange={(e) =>
            setNewIncident({ ...newIncident, description: e.target.value })
          }
          rows={4}
        />
        <p>
          <strong>Upload Images:</strong>
        </p>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files);
            setNewIncident({ ...newIncident, images: files });
          }}
        />
      </Modal>
    </MapContainer>
  );
};

export default StaffMap;
