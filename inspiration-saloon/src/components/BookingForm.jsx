import { useState, useEffect } from "react";
import axios from "axios";

export default function BookingForm() {
  const [gender, setGender] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [price, setPrice] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  const ALL_SERVICES = [
    { name: "Haircut", price: 200, gender: "male" },
    { name: "Beard Trim", price: 150, gender: "male" },
    { name: "Facial", price: 500, gender: "female" },
    { name: "Hair Spa", price: 700, gender: "female" },
    { name: "Head Massage", price: 300, gender: "female" },
  ];

  useEffect(() => {
    if (!gender) return;

    const filtered = ALL_SERVICES.filter(
      (s) => s.gender === gender || s.gender === "unisex"
    );

    setFilteredServices(filtered);
    setSelectedService(null);
    setPrice(0);
  }, [gender]);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/appointments", {
        ...formData,
        price,
        paid: false,
        finalSlot: formData.preferredTime,
      });

      if (res.status === 201) {
        setSuccessMessage("Appointment Booked Successfully!");

        setTimeout(() => {
          setSuccessMessage("");
          setFormData({
            name: "",
            phone: "",
            email: "",
            gender: "",
            service: "",
            preferredDate: "",
            preferredTime: "",
            notes: "",
          });
          setGender("");
          setFilteredServices([]);
          setPrice(0);
        }, 5000);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }
  };



  return (
    <div className="max-w-xl mx-auto my-6 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-center text-2xl font-semibold mb-4">
        Book an Appointment
      </h2>

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-600 text-green-700 p-3 mb-4 text-center rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 booking-mobile-fix">
        {/* Name + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="border rounded-lg p-2 text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Phone Number</label>
            <input
              type="text"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="border rounded-lg p-2 text-sm"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-sm font-medium">Email (Optional)</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full text-sm"
          />
        </div>

        {/* Gender + Service */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Select Gender</label>
            <select
              name="gender"
              required
              value={formData.gender}
              onChange={(e) => {
                setGender(e.target.value);
                handleChange(e);
              }}
              className="border rounded-lg p-2 text-sm"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Select Service</label>
            <select
              name="service"
              required
              disabled={!gender}
              value={formData.service}
              onChange={(e) => {
                const selected = filteredServices.find(
                  (s) => s.name === e.target.value
                );
                setSelectedService(selected);
                setPrice(selected?.price || 0);
                handleChange(e);
              }}
              className="border rounded-lg p-2 text-sm disabled:bg-gray-200"
            >
              <option value="">Select</option>
              {filteredServices.map((s, i) => (
                <option key={i} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date + Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Preferred Date</label>
            <input
              type="date"
              name="preferredDate"
              required
              value={formData.preferredDate}
              onChange={handleChange}
              className="border p-2 rounded-lg text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Preferred Time</label>
            <input
              type="time"
              name="preferredTime"
              required
              value={formData.preferredTime}
              onChange={handleChange}
              className="border p-2 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Additional Notes (Optional)
          </label>
          <textarea
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full text-sm"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full mt-2 bg-amber-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-amber-700 transition"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
}
