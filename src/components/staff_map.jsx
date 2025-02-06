import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { Modal, Input, Button, Spin, Popconfirm, Popover } from "antd";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import customIcon1 from "/images/logo.webp";
import customIcon2 from "/images/vehicle.webp";
import {
  deleteIncident,
  getIncidents,
  uploadIncident,
} from "../services/incidents";
import { getVehicles, uploadVehicle } from "../services/vehicles";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const createCustomIcon = (iconUrl) =>
  L.icon({
    iconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

const StaffMap = () => {
  const isLargeScreen = window.innerWidth > 900;
  const defaultCenter = [53.4835, -2.2422];
  const [modalVisible, setModalVisible] = useState(false);
  const [newIncident, setNewIncident] = useState({
    lat: 0,
    lng: 0,
    address: "",
    description: "",
    title: "",
  });

  const [newVehicle, setNewVehicle] = useState({
    lat: 0,
    lng: 0,
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
    if (!newIncident.description || !newIncident.title) {
      message.error("Missing Title or Description!");
      return;
    }

    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    const convertImagesToBase64 = async (images) => {
      const base64Images = await Promise.all(
        images.map((image) => convertToBase64(image))
      );
      return base64Images;
    };

    const submitIncident = async () => {
      const base64Images = await convertImagesToBase64(
        newIncident.images || []
      );
      const formattedIncident = {
        title: newIncident.title,
        description: newIncident.description,
        location: [newIncident?.lat, newIncident?.lng],
        address: newIncident.address,
        images: base64Images,
      };

      try {
        const response = await uploadIncident(formattedIncident);
        if (response?.insertedId) {
          setModalVisible(false);
          setUpdate(!update);
          message.success("Incident added successfully");
        } else {
          message.error("Error adding incident");
        }
      } catch (error) {
        message.error("Error adding incident");
        console.error("Error adding incident:", error);
      }
    };

    submitIncident();
  };

  const [center, setCenter] = useState(defaultCenter);
  const [incidents, setIncidents] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [map, setMap] = useState(null);
  const [update, setUpdate] = useState(false);

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

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        handleMapClick(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  const navigate = useNavigate();

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "75vh", width: "100%" }}
      ref={setMap}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClickHandler />
      {incidents?.map((incident, index) => (
        <Marker
          position={incident?.location}
          icon={createCustomIcon(customIcon1)}
          key={index}
        >
          <Popup position={incident?.location}>
            <div>
              <p>
                {incident.location[0]} {incident.location[1]}
              </p>
              <h3>{incident.title}</h3>
              <p>{incident.description?.substring(0, 100)}...</p>

              <Popover
                content={
                  <div>
                    <p>
                      <strong>Starting Latitude:</strong>
                    </p>

                    <Input
                      placeholder="Enter starting latitude"
                      value={newVehicle?.lat}
                      onChange={(e) =>
                        setNewVehicle({
                          ...newVehicle,
                          lat: e.target.value,
                        })
                      }
                    />
                    <p>
                      <strong>Starting Longitude:</strong>
                    </p>
                    <Input
                      placeholder="Enter starting longitude"
                      value={newVehicle?.lng}
                      onChange={(e) =>
                        setNewVehicle({
                          ...newVehicle,
                          lng: e.target.value,
                        })
                      }
                    />
                    <Button
                      style={{
                        marginTop: "8px",
                      }}
                      type="primary"
                      onClick={async () => {
                        const time = Math.floor(Math.random() * 26 + 5) * 60000;
                        const formattedVehicle = {
                          location: [newVehicle?.lat, newVehicle?.lng],
                          destination: incident?.location,
                          travelTime: time,
                          reachTime: new Date(Date.now() + time).toISOString(),
                        };
                        const response = await uploadVehicle(formattedVehicle);
                        if (response?.insertedId) {
                          message.success("Vehicle assigned successfully");
                          setUpdate(!update);
                        }
                      }}
                    >
                      Confirm
                    </Button>
                    <Button
                      onClick={() => {
                        setNewVehicle({
                          lat:
                            incident.location[0] +
                            (Math.random() * 0.03 - 0.001),
                          lng:
                            incident.location[1] +
                            (Math.random() * 0.03 - 0.001),
                        });
                      }}
                      style={{
                        marginLeft: "8px",
                      }}
                    >
                      Random Start
                    </Button>
                  </div>
                }
                title="Assign Vehicle Starting Point"
                trigger="click"
              >
                <Button
                  type="primary"
                  style={{
                    marginRight: "8px",
                  }}
                >
                  Assign Vehicle
                </Button>
              </Popover>
              <Popconfirm
                title={`Are you sure you want to delete the incident ${incident?.title}`}
                onConfirm={async () => {
                  const response = await deleteIncident(incident?._id);
                  setUpdate(!update);
                }}
              >
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "red",
                  }}
                >
                  Delete
                </Button>
              </Popconfirm>
            </div>
          </Popup>
        </Marker>
      ))}

      {vehicles.map((vehicle, index) => (
        <Marker
          position={vehicle?.location}
          icon={createCustomIcon(customIcon2)}
          key={index}
        ></Marker>
      ))}

      <Modal
        title="Add Fire Incident"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        destroyOnClose
        okText="Submit"
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
          <strong>Title:</strong>
        </p>

        <Input
          placeholder="Please write a Title"
          value={newIncident.title}
          onChange={(e) =>
            setNewIncident({ ...newIncident, title: e.target.value })
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
