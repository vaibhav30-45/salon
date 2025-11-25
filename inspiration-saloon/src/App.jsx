import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import HairStyles from './components/HairStyles'
import VideoMarquee from './components/VideoMarquee'
import Gallery from './components/Gallery'
import Pricing from './components/Pricing'
import Cta from './components/Cta'
import Footer from './components/Footer'
import AiRecommendations from './components/AiRecommendations'

export default function App() {
  return (
    <div className="font-body">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <VideoMarquee />
        <HairStyles />
        <AiRecommendations />
        <Gallery />
        <Pricing />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}


