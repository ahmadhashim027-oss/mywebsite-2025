import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-md shadow-sm py-1 bg-light">
      <div className="container">
        <img
          src="/FFF.jpg"
          className="rounded-2"
          width={35}
          height={35}
          alt=""
        />

        <a href="/" className="navbar-brand fw-bolder text-uppercase ms-2">
          HASHIM AHMAD
        </a>

        <button
          className="navbar-toggler shadow-none"
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
          className="collapse navbar-collapse justify-content-end"
          id="main-nav"
        >
          <ol className="navbar-nav">
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
              <a href="/skills" className="nav-link fw-bold">
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
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle fw-bold"
                href="#"
                id="apprenticeDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Apprentice
              </a>

              <ul
                className="dropdown-menu shadow"
                aria-labelledby="apprenticeDropdown"
              >
                <li>
                  <Link href="/aparantice-register" className="dropdown-item">
                    Signup
                  </Link>
                </li>
                <li>
                  <Link href="/apparentice-login" className="dropdown-item">
                    Login
                  </Link>
                </li>
              </ul>
            </li>

            {/* 🔥 ADMIN DROPDOWN MENU */}
            <li className="nav-item">
              <a href="/admin-login" className="nav-link fw-bold">
                Admin Login
              </a>
            </li>
          </ol>
        </div>
      </div>
    </nav>
  );
}
