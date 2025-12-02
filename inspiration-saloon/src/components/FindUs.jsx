export default function FindUs() {
  return (
    <>
      <style>{`
         
        .findus-section {
          width: 100%;
          padding: 60px 20px;
          background: #f8f8f8;
        }

        .findus-container {
          max-width: 1100px;
          margin: auto;
          text-align: center;
        }

        .findus-title {
          font-size: 34px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .findus-subtitle {
          color: #555;
          font-size: 16px;
          margin-bottom: 30px;
        }

        .findus-flex {
          display: flex;
          justify-content: space-between;
          gap: 30px;
          flex-wrap: wrap;
          align-items: flex-start;
        }

        .findus-info {
          flex: 1;
          min-width: 280px;
          text-align: left;
        }

        .findus-info h3 {
          font-size: 22px;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .findus-info p {
          font-size: 16px;
          margin: 6px 0;
          color: #333;
        }

        .findus-buttons {
          margin-top: 20px;
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .findus-btn {
          color: white;
          padding: 12px 22px;
          background: #111;
          border-radius: 6px;
          font-size: 15px;
          cursor: pointer;
          border: none;
          transition: 0.3s;
        }

        .findus-btn:hover {
          background: #333;
        }

        .findus-map {
          flex: 1;
          min-width: 280px;
          height: 350px;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        /* SMALL DEVICES */
        @media (max-width: 768px) {
          .findus-flex {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .findus-info {
            text-align: center;
          }

          .findus-buttons {
            justify-content: center;
          }

          .findus-map {
            width: 100%;
            height: 300px;
          }
        }

        /* VERY SMALL DEVICES */
        @media (max-width: 480px) {
          .findus-title {
            font-size: 28px;
          }
          .findus-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

      <section className="findus-section">
        <div className="findus-container">

          <h2 className="findus-title">Find Us</h2>
          <p className="findus-subtitle">
            Visit our salon for the best grooming and beauty experience.
          </p>

          <div className="findus-flex">

            {/* LEFT SIDE – INFO */}
            <div className="findus-info">
              <h3>Salon Details</h3>

              <p><strong>Salon Name:</strong> Inspiration Salon</p>
              <p><strong>Address:</strong>  221B Baker Street, Delhi 110001</p>
              
              <p><strong>Open:</strong><p>Mon - Fri    10:00 AM – 8:00 PM</p>
                                       <p> Saturday     10:00 AM – 9:00 PM</p>
                                       <p>Sunday 11:00 AM – 6:00 PM</p></p>
              <p><strong>Contact:</strong> +91 90000 00000</p>

              <div className="findus-buttons">
                <a
                  href="https://www.google.com/maps/place/221B+Baker+Street/@28.6334897,77.21374,728m/data=!3m2!1e3!4b1!4m6!3m5!1s0x390cfdb80ba9b7b7:0x5abb9b239213e3cd!8m2!3d28.6334851!4d77.2186109!16s%2Fg%2F11n69h4y2r?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="findus-btn bg-brand">Get Directions</button>
                </a>

                <a href="tel:+919876543210">
                  <button className="findus-btn bg-brand">Call Now</button>
                </a>
              </div>
            </div>

            {/* RIGHT SIDE – MAP */}
            <div className="findus-map">
              <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3169.0151844267402!2d77.2186109!3d28.633485099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfdb80ba9b7b7%3A0x5abb9b239213e3cd!2s221B%20Baker%20Street!5e1!3m2!1sen!2sin!4v1764668929662!5m2!1sen!2sin"
  width="100%"
  height="350"
  style={{ border: 0 }}
  allowFullScreen=""
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>

            </div>

          </div>
        </div>
      </section>
    </>
  );
}
