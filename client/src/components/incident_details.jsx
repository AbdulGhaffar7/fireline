import React, { useState, useEffect } from "react";
import { Card, Typography, Button, Row, Col, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { getIncidentById } from "../services/incidents";

const { Title, Paragraph } = Typography;

const IncidentDetails = () => {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncident = async () => {
      const data = await getIncidentById(id);
      setIncident(data);
      setLoading(false);
    };

    fetchIncident();
  }, [id]);

  if (loading)
    return (
      <div
        style={{
          width: "100%",
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );

  if (!incident) return <p>No incident data available.</p>;

  const formatImages = (images) => {
    return images.map((image) => ({
      original: `${image}`,
      thumbnail: `${image}`,
    }));
  };

  return (
    <Row>
      <Col
        xs={24}
        sm={12}
        style={{
          padding: "16px",
        }}
      >
        <Title level={1} className="text-white">
          {incident.title}
        </Title>
        <Paragraph
          style={{
            fontSize: "16px",
            fontWeight: 500,
          }}
        >
          {incident.address}
        </Paragraph>
        <Paragraph
          style={{
            fontSize: "14px",
            fontWeight: 400,
          }}
        >
          {incident.description}
        </Paragraph>
        <Button type="primary" onClick={() => navigate("/")}>
          Return
        </Button>
      </Col>
      <Col
        xs={24}
        sm={12}
        style={{
          padding: "16px",
        }}
      >
        {incident.images && incident.images.length > 0 ? (
          <ImageGallery items={formatImages(incident.images)} />
        ) : (
          <Paragraph>No images available.</Paragraph>
        )}
      </Col>
    </Row>
  );
};

export default IncidentDetails;
