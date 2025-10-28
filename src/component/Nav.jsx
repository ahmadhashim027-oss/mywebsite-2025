export default function Nav() {
  return (
    <nav className="navbar navbar-expand-lg bg-dark text-light ">
      <div className="container">
        <a className="navbar-brand " href="#">
          <img
            src="/logo.jpg"
            alt="Logo"
            width="30"
            height="24"
            className="d-inline-block align-text-top"
          />
          Bootstrap
        </a>
        <button
          className="navbar-toggler  "
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon text-light"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center align-items-end" id="navbarNav">
          <ul className="navbar-nav ">
            <li className="nav-item">
              <a className="nav-link text-primary" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-warning" href="#">
                Features
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-success" href="#">
                Pricing
              </a>
            </li>
           
          </ul>
        </div>
      </div>
    </nav>
  );
}
