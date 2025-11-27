import { useState, useEffect ,useRef} from "react";
import axios from "axios";

export default function BookingForm() {
  const [gender, setGender] = useState("");
  const slotRef = useRef(null);

  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [price, setPrice] = useState(0);
  const [showSlots, setShowSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
    service: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
  });

  

useEffect(() => {
  if (!gender) return;

  const filtered = ALL_SERVICES.filter(
    (s) => s.gender === gender || s.gender === "unisex"
  );

  setFilteredServices(filtered);
  setSelectedService(null);
  setPrice(0);
  setFormData({ ...formData, service: "" });
}, [gender]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const confirmPay = window.confirm(`Pay ₹${price}?`);
  if (!confirmPay) return;

  // Payment successful → show slot section
  setShowSlots(true);

  // Scroll to slot section
  setTimeout(() => {
    slotRef.current?.scrollIntoView({ behavior: "smooth" });
  }, 300);
};


const handleFinalConfirm = async () => {
  if (!selectedSlot) {
    alert("Please select a time slot.");
    return;
  }

  try {
    const res = await axios.post("/api/appointments", {
      ...formData,
      finalSlot: selectedSlot,
      price,
      paid: true,
    });

    if (res.status === 201) {
      alert("Appointment Confirmed Successfully!");

      // CLEAR THE FORM
      setFormData({
        name: "",
        phone: "",
        email: "",
        gender: "",
        service: "",
        preferredDate: "",
        notes: "",
      });

      setSelectedSlot("");
      setPrice(0);
      setGender("");
      setFilteredServices([]);
      setShowSlots(false);
    }
  } catch (error) {
    console.log(error);
    alert("Something went wrong!");
  }
};



const ALL_SERVICES = [
  {
    name: "Haircut",
    price: 200,
    gender: "male",
  },
  {
    name: "Beard Trim",
    price: 150,
    gender: "male",
  },
  {
    name: "Facial",
    price: 500,
    gender: "female",
  },
  {
    name: "Hair Spa",
    price: 700,
    gender: "female",
  },
  {
    name: "Head Massage",
    price: 300,
    gender: "female",
  },
];


  return (
    <>
      <style>{`
        .booking-container {
          max-width: 600px;
          margin: 10px auto;
          padding: 25px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          font-family: Arial;
        }

        .booking-title {
          text-align: center;
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .form-row {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
        }

        .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        label {
          font-weight: 600;
          margin-bottom: 6px;
        }

        input,
        select,
        textarea {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 15px;
        }

        .booking-btn {
          width: 100%;
          margin-top: 15px;
          padding: 12px;
          background: #b18c5a;
          color: white;
          font-size: 18px;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .booking-btn:hover {
          background: #9d7847;
        }

        .price-box {
          background: #f4efe8;
          padding: 10px;
          margin-top: -5px;
          margin-bottom: 12px;
          border-left: 4px solid #b18c5a;
          font-weight: 600;
          border-radius: 6px;
        }

        .slot-section {
          margin-top: 30px;
          padding: 20px;
          background: #fafafa;
          border-radius: 10px;
        }

        .slot-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 10px;
        }

        .slot-box {
          padding: 12px;
          background: #fff;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-weight: 600;
          text-align: center;
          cursor: pointer;
        }

        .slot-box:hover {
          background: #b18c5a;
          color: white;
          border-color: #b18c5a;
        }
.active-slot {
  background: #b18c5a !important;
  color: white;
  border-color: #b18c5a;
}

        @media (max-width: 600px) {
          .form-row {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="booking-container">
        <h2 className="booking-title">Book an Appointment</h2>

        <form className="booking-form" onSubmit={handleSubmit}>

          {/* Name + Phone in same row */}
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-row">
          <div className="form-group">
            <label>Email (Optional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
</div>
          {/* Gender + Services in same row */}
          <div className="form-row">
            <div className="form-group">
              <label>Select Gender</label>
              <select
                name="gender"
                value={formData.gender}
                required
                onChange={(e) => {
                  setGender(e.target.value);
                  handleChange(e);
                }}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <label>Select Service</label>
              <select
                name="service"
                value={formData.service}
                required
                disabled={!gender}
                onChange={(e) => {
                  const selected = filteredServices.find(
                    (s) => s.name === e.target.value
                  );
                  setSelectedService(selected);
                  setPrice(selected?.price || 0);
                  handleChange(e);
                }}
              >
                <option value="">Select</option>
                {filteredServices.map((service) => (
                  <option key={service._id} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Box */}
          {price > 0 && (
            <div className="price-box">Service Price: ₹{price}</div>
          )}

          {/* Date */}
          <div className="form-row">
           
          <div className="form-group">
            <label>Select Preferred Date</label>
            <input
              type="date"
              name="preferredDate"
              required
              onChange={handleChange}
            />
          </div>

          {/* Time */}
          <div className="form-group">
            <label>Select Preferred Time</label>
            <input
              type="time"
              name="preferredTime"
              required
              onChange={handleChange}
            />
          </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label>Additional Notes (Optional)</label>
            <textarea
              name="notes"
              rows="3"
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="booking-btn">
            Confirm & Pay
          </button>
        </form>

        {/* Slots After Payment */}
      {showSlots && (
  <div className="slot-section" ref={slotRef}>
    <h3>Select Your Final Time Slot</h3>
    <p>Choose a slot to confirm your appointment.</p>

    <div className="slot-grid">
      {["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"].map(
        (slot) => (
          <div
            className={`slot-box ${selectedSlot === slot ? "active-slot" : ""}`}
            key={slot}
            onClick={() => setSelectedSlot(slot)}
          >
            {slot}
          </div>
        )
      )}
    </div>

    {selectedSlot && (
      <button
        className="booking-btn"
        style={{ marginTop: "20px" }}
        onClick={handleFinalConfirm}
      >
        Confirm Appointment
      </button>
    )}
  </div>
)}
      </div>
    </>
  );
}
