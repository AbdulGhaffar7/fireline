import React, { useState, useEffect } from "react";

const Advertisement = () => {
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
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div>
        <a
          href={bannerImages[currentImageIndex].url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            transition: "opacity 1s ease-in-out",
            height: "50px",
            overflow: "hidden",
            display: "block",
          }}
        >
          <img
            src={bannerImages[currentImageIndex].src}
            alt={`Banner ${currentImageIndex + 1}`}
            style={{ height: "50px", width: "auto" }}
          />
        </a>
      </div>
    </div>
  );
};

export default Advertisement;
