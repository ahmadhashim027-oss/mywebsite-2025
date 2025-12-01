export default function SkillsSection() {
  return (
    <div className="container my-5">
      <div className="sectionTitle d-flex flex-row text-light">
        <h3>02.</h3>
        <h4>My Skills & Activities</h4>
      </div>

      <div className="row justify-content-center mt-4">
        {/* Sewing */}
        <div className="col-md-3 mb-4">
          <div className="card shadow h-100 text-center p-3">
            <h5 className="fw-bold">Sewing</h5>
            <p>
              Professional stitching, garment construction, and clean finishing
              using modern sewing techniques for all fashion styles.
            </p>
            <video
              src="/videos/sewing.mp4"
              controls
              className="img-fluid rounded mt-2 shadow"
              style={{ maxHeight: "200px" }}
            />
          </div>
        </div>

        {/* Cutting */}
        <div className="col-md-3 mb-4">
          <div className="card shadow h-100 text-center p-3">
            <h5 className="fw-bold">Fabric Cutting</h5>
            <p>
              Skilled in cutting different fabrics like Ankara, chiffon, lace,
              cotton, silk and more with accuracy and perfect measurement.
            </p>
            <video
              src="/videos/cuting.mp4"
              controls
              className="img-fluid rounded mt-2 shadow"
              style={{ maxHeight: "200px" }}
            />
          </div>
        </div>

        {/* Ironing */}
        <div className="col-md-3 mb-4">
          <div className="card shadow h-100 text-center p-3">
            <h5 className="fw-bold">Ironing & Pressing</h5>
            <p>
              Smooth steam ironing and detailed pressing to produce clean lines
              and a professional final appearance for all outfits.
            </p>
            <video
              src="/videos/ioning.mp4"
              controls
              className="img-fluid rounded mt-2 shadow"
              style={{ maxHeight: "200px" }}
            />
          </div>
        </div>

        {/* Packaging */}
        <div className="col-md-3 mb-4">
          <div className="card shadow h-100 text-center p-3">
            <h5 className="fw-bold">Packaging</h5>
            <p>
              Neat and attractive packaging to protect clothing and give it a
              premium feel before delivery to customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
