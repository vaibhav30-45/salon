import { useState, useEffect, useRef } from "react";

export default function HairStyles() {
   const boysData = [
  { 
    name: "Crew Cut", 
    image: "https://storage.googleapis.com/postcrafts-public-content/hairstyleai/blog/549edd52-ff15-408d-80b1-a88e15d2bc99.jpg" 
  },
  { 
    name: "Fade Cut", 
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLsYjflaqBthXvURpylsQwRE0U4rAXV9SRVg&s" 
  },
  { 
    name: "Undercut", 
    image:"https://cdn.shopify.com/s/files/1/0029/0868/4397/files/Side-Swept-Undercut.webp?v=1756304439"
  },
  { 
    name: "Buzz Cut", 
    image: "https://haircutinspiration.com/wp-content/uploads/Pitch-Perfect-Buzz-Cut.jpg" 
  },
  { 
    name: "Quiff", 
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxXETSsrhiPwaE4R4-oyyVBaJmUy_SN3iFbhw_cgK323h-eUXaZ4pHsTMqMgtppRGylS0&usqp=CAU" 
  },
  { 
    name: "Pompadour", 
    image: "https://i.pinimg.com/564x/48/d6/76/48d6761fe230ad0734d0817e603f08ec.jpg" 
  },
  { 
    name: "Side Part", 
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5LS2u9rbV4KMA-GF7YDxyEHsV_KbjiyIEYg&s" 
  },
  { 
    name: "French Crop", 
    image: "https://i.pinimg.com/736x/2c/33/e9/2c33e968bb9cee7e973462865f50a0fa.jpg" 
  },
  { 
    name: "Textured Crop", 
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop" 
  },
  { 
    name: "Spiky Haircut", 
    image: "https://cdn.shopify.com/s/files/1/0029/0868/4397/files/medium-spiky-hairstyle-men.webp?v=1758794611" 
  }
];


  const girlsData = [
  { 
    name: "Balayage Waves", 
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrRYWJcqRghPeI7io2IUiPOfe6XvL2ATfb_A&s" 
  },
  { 
    name: "French Bob", 
    image: "https://i.pinimg.com/736x/4a/62/d9/4a62d9aad328db864609182726dde5a8.jpg" 
  },
  { 
    name: "Beach Waves", 
    image: "https://i.pinimg.com/736x/73/2b/30/732b30bf5f8f4f468da3fe74f8cec84f.jpg" 
  },
  { 
    name: "Braided Updo", 
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHXiTZ2SdvRVm84p_G7bD2sFH0bQrRBpz6VQ&s" 
  },
  {
    name: "Layered Cut",
    image: "https://i.pinimg.com/736x/9a/9b/ac/9a9bacb61318eb306b1ff8dc0ccedfd6.jpg"
  },
  {
    name: "Curtain Bangs",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGEuzzUqAqz427HDeD6ahQCqfLJqD-qRuiIg&s"
  },
  {
    name: "Straight Long Hair",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6tMcPoikNWY3f5k3v5KFL23E1tnSeWDg-vw&s"
  },
  {
    name: "Messy Bun",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYiGwCuMTfKhur5aXh7lCWLifGE7KEBwA2XA&s"
  },
  {
    name: "Half-Up Half-Down",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj11c-vCe856AuZwZ71zlYn9P2WgoBR5_nhA&s"
  },
  {
    name: "Pixie Cut",
    image: "https://i2.wp.com/www.hadviser.com/wp-content/uploads/2023/01/2-trendy-french-pixie-bob-Cr-N9voNIEd.jpg?resize=787%2C917&ssl=1"
  }
];



  const boysSliderRef = useRef(null);
  const girlsSliderRef = useRef(null);

  // Duplicate items for infinite effect
  const boysItems = [...boysData, ...boysData];
  const girlsItems = [...girlsData, ...girlsData];


  return (
    <>
    <style>{`
  .hairstyles-section {
  width: 100%;
  padding: 40px 0;
 
}

.title {
  font-size: 20px;
  font-weight: 500;
  margin: 18px 0;
  text-align: center;
  
}

.auto-slider-div {
  width: 100%;
  overflow: hidden;
  position: relative;
  padding: 10px 0;
  margin-bottom: 20px;
  
}

/* slider track */
.auto-slider {
  display: flex;
  width: max-content;
  animation: scroll 35s linear infinite;
}

.auto-slider-div:hover .auto-slider {
  animation-play-state: paused;
}

/* slide card */
.slide {
  flex: 0 0 280px;
  margin-right: 20px;
 
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  position: relative;
}

.slide img {
  width: 100%;
  height: 350px;
  object-fit: cover;
}

/* Name overlay */
.slide-name {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.55), transparent);
  color: white;
  padding: 10px;
  font-size: 16px;
  font-weight: 600;
}

/* infinite animation */
@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Responsive */
@media (max-width: 768px) {
  .slide { flex: 0 0 220px; }
  .slide img { height: 260px; }
}

@media (max-width: 480px) {
  .slide { flex: 0 0 180px; }
  .slide img { height: 220px; }
}


    `}</style>
    <section id="hairstyles" className="auto-slider-section">
      <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-display font-bold tracking-tight">Hair Styles</h2>
          <p className="mt-3 text-gray-600">Trendy looks for boys and girls, tailored by our stylists.</p>
        </div>
 <h3 className="title">Boys Hairstyles</h3>
      <div className="auto-slider-div">
        <div className="auto-slider" ref={boysSliderRef}>
          {boysItems.map((style, index) => (
            <div className="slide" key={index}>
              <img src={style.image} alt={style.name} />
              <div className="slide-name">{style.name}</div>
            </div>
          ))}
        </div>
      </div>

      <h3 className="title" style={{ marginTop: "60px" }}>Girls Hairstyles</h3>
      <div className="auto-slider-div">
        <div className="auto-slider" ref={girlsSliderRef}>
          {girlsItems.map((style, index) => (
            <div className="slide" key={index}>
              <img src={style.image} alt={style.name} />
              <div className="slide-name">{style.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section></>
  );
}





