import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Loader from "./components/Loader";

const THUMBNAIL_SIZE = 200;
const FULL_SIZE = 500;
const DOWNLOAD_SIZE = 1000;
const IMAGES_PER_SCROLL = 30;

const App = () => {
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [offset, setoffset] = useState(0);
  const [flag, setflag] = useState(false);
  const [data, setData] = useState([]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.slingacademy.com/v1/sample-data/photos?limit=${IMAGES_PER_SCROLL}&offset=${offset}`
      );
      const fetchedImages = response.data.photos.map((image, index) => ({
        id: image.id,
        url: `http://via.placeholder.com/${THUMBNAIL_SIZE}x${THUMBNAIL_SIZE}?text=${image.id}`,
        fullSizeUrl: `http://via.placeholder.com/${FULL_SIZE}x${FULL_SIZE}?text=${image.id}`,
        downloadSizeUrl: `http://via.placeholder.com/${DOWNLOAD_SIZE}x${DOWNLOAD_SIZE}?text=${image.id}`,
      }));

      if (offset === 0) {
        setImages(fetchedImages);
      } else {
        setImages((prevImages) => [...prevImages, ...fetchedImages]);
      }

      setoffset(offset + 30);
      setLoading(false);
      setData(response.data.photos);
    } catch (error) {
      console.error("Error fetching images:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (flag) {
      fetchImages();
      setflag(false);
    }
  }, [offset, flag]);
  useEffect(() => {
    fetchImages();
  }, []);
  useEffect(() => {}, [data]);
  console.log(offset);
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setflag(true);
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

  const handleKeyDown = (event) => {
    if (selectedImageIndex !== null) {
      if (event.key === "ArrowLeft") {
        navigateImage(-1);
      } else if (event.key === "ArrowRight") {
        navigateImage(1);
      }
    }
  };

  const navigateImage = (direction) => {
    const newIndex = selectedImageIndex + direction;
    if (newIndex >= 0 && newIndex < images.length) {
      setSelectedImageIndex(newIndex);
    }
  };

  const handleClickOutside = (event) => {
    if (selectedImageIndex !== null && !event.target.closest(".image-viewer")) {
      closeImage();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="app">
      <h1 className="heading"> EventGraphia - Part1 </h1>
      <div className="grid">
        {images.map((image, index) => (
          <div
            className="thumbnail"
            key={image.title}
            onClick={() => openImage(index)}
          >
            <img src={image.url} alt={`Image ${index + 1}`} />
          </div>
        ))}
      </div>
      {selectedImageIndex !== null && (
        <div className="overlay" onClick={closeImage}>
          <div className="image-viewer">
            {selectedImageIndex > 0 && (
              <div
                className="arrow-left"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage(-1);
                }}
              >
                &lt;
              </div>
            )}
            <img
              src={images[selectedImageIndex].fullSizeUrl}
              alt={`Image ${selectedImageIndex + 1}`}
            />
            {selectedImageIndex < images.length - 1 && (
              <div
                className="arrow-right"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage(1);
                }}
              >
                &gt;
              </div>
            )}
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
      {loading && <Loader />}
    </div>
  );
};

export default App;
