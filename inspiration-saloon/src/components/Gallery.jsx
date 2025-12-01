import React, { useState, useEffect } from 'react';

const Gallery = () => {
  const [filter, setFilter] = useState('all');
 useEffect(() => {
    const fetchImages = async () => {
      const res = await axios.get("/api/gallery");
      setGalleryImages(res.data.images); 
    };

    fetchImages();
  }, []);
  // Mobile show-limit states
  const [visibleCount, setVisibleCount] = useState(4);
  const [isMobile, setIsMobile] = useState(false);

  const galleryImages = [
    { id: 1, src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400', alt: 'Hair Styling', category: 'hair' },
    { id: 2, src: 'https://images.unsplash.com/photo-1629189784191-9afdcbcb0398?w=600&auto=format&fit=crop&q=60', alt: 'Hair Coloring', category: 'hair' },
    { id: 3, src: 'https://images.unsplash.com/photo-1684868265715-03e19a3e0e00?q=80&w=686&auto=format&fit=crop', alt: 'Makeup', category: 'makeup' },
    { id: 4, src: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400', alt: 'Facial', category: 'skincare' },
    { id: 5, src: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400', alt: 'Nail Art', category: 'nails' },
    { id: 6, src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400', alt: 'Skin Care', category: 'skincare' },
    { id: 7, src: 'https://plus.unsplash.com/premium_photo-1669675935857-d0d04023d728?q=80&w=713&auto=format&fit=crop', alt: 'Hair Coloring', category: 'hair' },
    { id: 8, src: 'https://images.unsplash.com/photo-1654097800183-574ba7368f74?q=80&w=735&auto=format&fit=crop', alt: 'Hair Coloring', category: 'hair' },
    { id: 9, src: 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?q=80&w=1170&auto=format&fit=crop', alt: 'Hair Coloring', category: 'hair' },
    { id: 10, src: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&auto=format&fit=crop&q=60', alt: 'Nail Art', category: 'nails' },
    { id: 11, src: 'https://images.unsplash.com/photo-1677691257001-8bfd91e288ff?q=80&w=1974&auto=format&fit=crop', alt: 'Makeup', category: 'makeup' },
    { id: 12, src: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400', alt: 'Facial', category: 'skincare' },
  ];

  // Detect mobile screen
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 600);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const filteredImages =
    filter === 'all' ? galleryImages : galleryImages.filter(img => img.category === filter);

  const displayedImages = isMobile
    ? filteredImages.slice(0, visibleCount)
    : filteredImages;

  return (
    <>
      <style>{`
        .gallery-section {
          padding: 80px 20px;
        }
        .gallery-container {
          max-width: 1200px;
          margin: auto;
        }
          .gallery-header { text-align: center; margin-bottom: 50px; } .gallery-title { font-size: 3rem; font-weight: 300; color: #2c3e50; margin-bottom: 15px; background: linear-gradient(45deg, #000000ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; } .gallery-subtitle { font-size: 1.2rem; color: #7f8c8d; font-weight: 300; }

        /* Masonry Grid */
        .masonry-grid {
          column-count: 3;
          column-gap: 20px;
        }
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
        .masonry-item img {
          width: 100%;
          display: block;
        }

        /* Fade Animation */
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Filter Buttons */
        .filter-buttons {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 35px;
          flex-wrap: wrap;
        }
        .filter-btn {
          padding: 10px 22px;
          border-radius: 25px;
          border: 2px solid #b18c5a;
          background: transparent;
          cursor: pointer;
          font-weight: 600;
          transition: 0.2s ease;
        }
        .filter-btn.active,
        .filter-btn:hover {
          background: #b18c5a;
          color: white;
        }

        /* Responsive */
       @media (max-width: 768px) {
  .masonry-grid { column-count: 2; }
}

@media (max-width: 480px) {
  .masonry-grid { column-count: 2; } /* keep 2 instead of 1 */
  .masonry-item img { border-radius: 10px; }
}
      `}</style>

     <section className="gallery-section"> 
      <div className="gallery-container">
         <div className="gallery-header"> 
          <h2 className="gallery-title">Gallery</h2> <p className="gallery-subtitle">Discover our amazing transformations and styles</p> </div>
          {/* Filter Buttons */}
         <div className="filter-buttons">
  {['all', 'hair', 'makeup', 'skincare', 'nails'].map(category => (
    <button
      key={category}
      className={`filter-btn ${filter === category ? 'active' : ''}`}
      onClick={() => {
        setFilter(category);
        setVisibleCount(4); // reset limit when changing filter
      }}
    >
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </button>
  ))}
</div>


          {/* Masonry Layout */}
          <div className="masonry-grid">
            {displayedImages.map((img, index) => (
              <div
                className="masonry-item"
                style={{ animationDelay: `${index * 0.08}s` }}
                key={img.id}
              >
                <img src={img.src} alt={img.alt} loading="lazy" />
              </div>
            ))}
          </div>

          {/* Load More Button (mobile only) */}
          {isMobile && visibleCount < filteredImages.length && (
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
