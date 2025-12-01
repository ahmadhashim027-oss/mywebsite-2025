export default function AboutUs() {
  return (
    <>
      <div className="sectionTitle d-flex flex-row text-light">
        <h3>01.</h3>
        <h4>About Us</h4>
      </div>

      <div className="row justify-content-center align-items-center text-light">
        {/* Left Side - Text Section */}
        <div className="col-lg-8 mt-4">
          <p>
            <em>
              Welcome to <strong>Fabric Materials & Fashion Design</strong> —
              your one-stop destination for the latest and most stylish fabric
              materials. We design and create all kinds of fashionable clothing
              to meet your taste and preference. Our main priority is to
            </em>
            <strong>
              {" "}
              satisfy and exceed the expectations of our valued customers
            </strong>
            . Thank you for trusting us with your fashion needs!
          </p>

          <p>
            We proudly offer delivery and customization for all your fashion
            desires. Whether it’s
            <strong> men’s or women’s fashion</strong>, we’ve got you covered
            with high-quality materials and elegant designs.
          </p>

          <h5 className="mt-4">Our Services Include:</h5>

          <div className="d-flex flex-column gap-3 mt-3">
            <div className="d-flex flex-row align-items-center gap-3">
              <i className="bi bi-window"></i>
              <h6 className="mb-0">Latest Shadda</h6>
            </div>

            <div className="d-flex flex-row align-items-center gap-3">
              <i className="bi bi-window"></i>
              <h6 className="mb-0">Latest Lace</h6>
            </div>

            <div className="d-flex flex-row align-items-center gap-3">
              <i className="bi bi-window"></i>
              <h6 className="mb-0">Custom Fashion Clothes</h6>
            </div>

            <div className="d-flex flex-row align-items-center gap-3">
              <i className="bi bi-window"></i>
              <h6 className="mb-0">Abbah Yerd</h6>
            </div>

            <div className="d-flex flex-row align-items-center gap-3">
              <i className="bi bi-window"></i>
              <h6 className="mb-0">Gini Campala</h6>
            </div>

            <div className="d-flex flex-row align-items-center gap-3">
              <i className="bi bi-window"></i>
              <h6 className="mb-0">Hijab & Abaya (and more)</h6>
            </div>
          </div>
        </div>

        {/* Right Side - Image Section */}
        <div className="col-lg-4 mt-4 mt-lg-0">
          <img
            src="/about.jpg"
            alt="About Fabric Materials & Fashion Design"
            className="img-fluid rounded shadow"
          />
        </div>
      </div>
    </>
  );
}
