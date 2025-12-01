import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-md shadow-sm py-1">
      <div className="container">
        <img
          src="/FFF.jpg"
          className=" rounded-2"
          width={35}
          height={35}
          alt=""
        />
        <a href="/" className="navbar-brand fw-bolder text-uppercase">
          HASHIM AHMAD
        </a>
        <button
          className="navbar-toggler shadow-none navbar-darkN"
          
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#main-nav"
          aria-controls="main-nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end align-center"
          id="main-nav"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <a href="/" className="nav-link fw-bold">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a href="/about" className="nav-link fw-bold">
                About Us
              </a>
            </li>
            <li className="nav-item">
              <a href="skills" className="nav-link fw-bold">
                Skills
              </a>
            </li>
            <li className="nav-item">
              <a href="/projects" className="nav-link fw-bold">
                Projects
              </a>
            </li>

            <li className="nav-item">
              <a href="/contact" className="nav-link fw-bold">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
