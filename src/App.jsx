import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const THUMBNAIL_SIZE = 200;
const FULL_SIZE = 500;
const DOWNLOAD_SIZE = 1000;
const IMAGES_PER_SCROLL = 30;

const App = () => {
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `https://api.slingacademy.com/v1/sample-data/photos?limit=${IMAGES_PER_SCROLL}`
      );
      const fetchedImages = response.data.photos.map((image, index) => ({
        id: image.id,
        url: `http://via.placeholder.com/${THUMBNAIL_SIZE}x${THUMBNAIL_SIZE}?text=${
          index + 1
        }`,
        fullSizeUrl: `http://via.placeholder.com/${FULL_SIZE}x${FULL_SIZE}?text=${
          index + 1
        }`,
        downloadSizeUrl: `http://via.placeholder.com/${DOWNLOAD_SIZE}x${DOWNLOAD_SIZE}?text=${
          index + 1
        }`,
      }));
      setImages((prevImages) => [...prevImages, ...fetchedImages]);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      fetchImages();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const openImage = (index) => {
    setSelectedImageIndex(index);
    document.addEventListener("keydown", handleKeyDown);
  };

  const closeImage = () => {
    setSelectedImageIndex(null);
    document.removeEventListener("keydown", handleKeyDown);
  };

  const downloadImage = (imageUrl) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app">
      <h1 className="heading"> EventGraphia - Part1 </h1>
      <div className="grid">
        {images.map((image, index) => (
          <div
            className="thumbnail"
            key={image.id}
            onClick={() => openImage(index)}
          >
            <img src={image.url} alt={`Image ${index + 1}`} />
          </div>
        ))}
      </div>
      {selectedImageIndex !== null && (
        <div className="overlay" onClick={closeImage}>
          <div className="image-viewer">
            <img
              src={images[selectedImageIndex].fullSizeUrl}
              alt={`Image ${selectedImageIndex + 1}`}
            />
            <div
              className="download"
              onClick={() =>
                downloadImage(images[selectedImageIndex].downloadSizeUrl)
              }
            >
              Download
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
