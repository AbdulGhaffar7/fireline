import React from "react";
import { Card, Typography, Button, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const images = [
  {
    original: "https://picsum.photos/id/1018/1000/600/",
    thumbnail: "https://picsum.photos/id/1018/250/150/",
  },
  {
    original: "https://picsum.photos/id/1015/1000/600/",
    thumbnail: "https://picsum.photos/id/1015/250/150/",
  },
  {
    original: "https://picsum.photos/id/1019/1000/600/",
    thumbnail: "https://picsum.photos/id/1019/250/150/",
  },
];

const { Title, Paragraph } = Typography;

const IncidentDetails = () => {
  const incident = {
    title: "Wildfire in Yellowstone",
    address:
      "Brotherton Drive, Blackfriars, Lower Broughton, Salford, Greater Manchester, England, M3 6BH, United Kingdom",
    description:
      "Sequoia National Forest lands, roads, trails, and recreation sites around the Trout and Long Fires are temporarily closed under Forest Order No. 0513-24-12. Lands, roads, trails, and recreation sites around the Borel Fire are closed under Forest Order No. 0513-24-14. Fire restrictions are in effect under Forest Order No. 0513-24-10. All orders, maps, and accompanying appendices can be found on the Forest’s website: tinyurl.com/2en2d36kExternal Link. The Bureau of Land Management Bakersfield Field Office has temporarily closed Long Valley Campground, Chimney Creek Campground, and portions of the Pacific Crest Trail (PCT). View the emergency closure order here: tinyurl.com/4mprcb9bExternal Link. The PCT is closed between Hwy 178 at Walker Pass (mile 653) and the South Fork of the Kern River bridge (mile 717.7).",
    images: ["/images/map_banner/1.png", "/images/map_banner/2.png"],
  };

  const navigate = useNavigate();

  if (!incident) return <p>No incident data available.</p>;

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
        <ImageGallery items={images} />
      </Col>
    </Row>
  );
};

export default IncidentDetails;
