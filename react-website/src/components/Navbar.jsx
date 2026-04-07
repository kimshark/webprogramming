export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="logo">Cosmic<span>UI</span></h1>
        <ul className="nav-links">
          <li><a href="#hero">Home</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}
