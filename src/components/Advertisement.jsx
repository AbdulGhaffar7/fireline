import React, { useState, useEffect } from "react";

const Advertisement = () => {
  const products = [
    {
      id: 1,
      name: "Product 1",
      link: "https://example.com/product1",
      description: "Description for Product 1",
    },
    {
      id: 2,
      name: "Product 2",
      link: "https://example.com/product2",
      description: "Description for Product 2",
    },
    {
      id: 3,
      name: "Product 3",
      link: "https://example.com/product3",
      description: "Description for Product 3",
    },
    {
      id: 4,
      name: "Product 4",
      link: "https://example.com/product4",
      description: "Description for Product 4",
    },
    {
      id: 5,
      name: "Product 5",
      link: "https://example.com/product5",
      description: "Description for Product 5",
    },
  ];

  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProductIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div>
        <a
          href={products[currentProductIndex].link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            transition: "opacity 1s ease-in-out",
          }}
        >
          {products[currentProductIndex].name}:{" "}
          {products[currentProductIndex].description}
        </a>
      </div>
    </div>
  );
};

export default Advertisement;
