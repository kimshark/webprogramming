import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Card from './components/Card';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './index.css'; // Use global index.css for all styling

function App() {
  const cardData = [
    { id: 1, title: 'Blazing Fast', description: 'Optimized for speed and minimal footprint.' },
    { id: 2, title: 'Modern Aesthetics', description: 'Rich shadows, glassmorphism, and bold colors.' },
    { id: 3, title: 'Fully Responsive', description: 'Looks beautiful and flawless on every device.' }
  ];

  return (
    <>
      <Navbar />
      <Hero />
      <section id="features" className="features-section">
        <h2 className="section-title">Discover Our Features</h2>
        <div className="cards-container">
          {cardData.map(card => (
            <Card key={card.id} title={card.title} description={card.description} />
          ))}
        </div>
      </section>
      <Contact />
      <Footer />
    </>
  );
}

export default App;
