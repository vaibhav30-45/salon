import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get("/api/gallery");
        console.log("Gallery API response:", res.data);
        setGalleryImages(res.data || []); // fallback to empty array
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      }
    };
    fetchImages();
  }, []);

  // Detect mobile
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 600);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const displayedImages = isMobile
    ? galleryImages.slice(0, visibleCount)
    : galleryImages;

  return (
    <>
      <style>{`
        .gallery-section { padding: 80px 20px; }
        .gallery-container { max-width: 1200px; margin: auto; }
        .gallery-header { text-align: center; margin-bottom: 50px; }
        .gallery-title {
          font-size: 3rem;
          font-weight: 300;
          color: #2c3e50;
          margin-bottom: 15px;
          background: linear-gradient(45deg, #000000ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .gallery-subtitle { font-size: 1.2rem; color: #7f8c8d; font-weight: 300; }

        /* Masonry Grid */
        .masonry-grid { column-count: 3; column-gap: 20px; }
        .masonry-item {
          width: 100%;
          margin-bottom: 20px;
          border-radius: 14px;
          overflow: hidden;
          break-inside: avoid;
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 0.6s forwards;
        }
        .masonry-item img { width: 100%; display: block; }

        /* Fade Animation */
        @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }

        /* Responsive */
        @media (max-width: 768px) { .masonry-grid { column-count: 2; } }
        @media (max-width: 480px) { 
          .masonry-grid { column-count: 2; } 
          .masonry-item img { border-radius: 10px; } 
        }

      `}</style>

      <section className="gallery-section">
        <div className="gallery-container">
          <div className="gallery-header">
            <h2 className="gallery-title">Gallery</h2>
            <p className="gallery-subtitle">Discover our amazing transformations and styles</p>
          </div>

          {/* Masonry Grid */}
          <div className="masonry-grid">
            {displayedImages.length > 0 ? (
              displayedImages.map((img, index) => (
                <div
                  className="masonry-item"
                  style={{ animationDelay: `${index * 0.08}s` }}
                  key={img._id}
                >
                  <img src={img.url} alt={img.title || "Gallery image"} loading="lazy" />
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", color: "#888" }}>No images found</p>
            )}
          </div>

          {/* Load More (mobile only) */}
          {isMobile && visibleCount < galleryImages.length && (
            <div style={{ textAlign: "center", marginTop: "25px" }}>
              <button
                onClick={() => setVisibleCount(prev => prev + 4)}
                style={{
                  padding: "12px 24px",
                  background: "#000",
                  color: "#fff",
                  borderRadius: "8px",
                  fontSize: "16px",
                }}
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Gallery;
