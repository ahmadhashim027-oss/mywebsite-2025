import React from "react";

export default function LandingPage() {
  return (
    <section
      id="mainPage"
      className="mainPage min-vh-100 d-flex align-items-center"
    >
      <div className="container">
        <div className="row king">
          <div className="col-lg-6 d-flex flex-column justify-content-center text-light order-2 order-lg-1">
            <h3>
              <em>Fabric Materils And.</em>
            </h3>
            <h1>
              <em>Fashion Design.</em>
            </h1>

            <h2>
              WE GIVE YOU THE <br />
              BEST QUALITY AND GUARANTEED FABRIC FASHION MATERIALS.
            </h2>

            <div
              data-aos="fade-in"
              data-aos-delay="600"
              className="d-flex flex-row gap-4 justify-content-ceter align-items-center"
            >
              {/** main page button setting */}
              <div className="text-center text-lg-start mt-4">
                <a
                  href="/projects"
                  className=" btn btn-lg text-uppercase rounded-0 bg-warning rou scrollto d-inline-flex align-items-center justify-content-center align-self-center"
                >
                  view my work
                </a>
              </div>
              <div className="text-center text-lg-start mt-4">
                <a
                  href="/contact"
                  className=" btn btn-lg text-uppercase rounded-0 btn-outline-warning rou scrollto d-inline-flex align-items-center justify-content-center align-self-center"
                >
                  get in touch
                </a>
              </div>
            </div>
          </div>
          <div
            className="col-lg-6 hero-img order-lg-1 order-1 "
            data-aos="zoom-out"
            data-aos-delay="200"
          >
            <img src="/FFF.jpg" className="img-fluid p-4 " alt="img" />
          </div>
        </div>
      </div>
    </section>
  );
}
