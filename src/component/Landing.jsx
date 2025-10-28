import React from "react";

export default function LandingPage() {
  return (
    <section
      id="mainPage"
      className="mainPage min-hv-100 d-flex align-items-center"
    >
      <div className="container">
        <div className="row king">
          <div className="col-lg-6 d-flex flex-column justify-content-center text-start  order-2 order-lg-1 ">
            <h1 data-aos="fade-up">Hashim</h1>
            <h1 data-aos="fade-up">Ahmad.</h1>

            <h2 data-aos="fade-up" data-aos-delay="400">
              WE GIVE YOU THE   <br />
              BEST QUALITY AND GARANTEE FABRIG FASHI0N MATERIALS.
            </h2>
            
            
            <div
              data-aos="fade-in"
              data-aos-delay="600"
              className="d-flex flex-row gap-4 justify-content-ceter align-items-center"
            >
              {/** main page button setting */}
              <div className="text-center text-lg-start mt-4">
                <a
                  href="#about"
                  className=" btn btn-lg text-uppercase rounded-0 bg-warning rou scrollto d-inline-flex align-items-center justify-content-center align-self-center"
                >
                  view my work
                  
                </a>
              </div>
              <div className="text-center text-lg-start mt-4">
                <a
                  href="#about"
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
