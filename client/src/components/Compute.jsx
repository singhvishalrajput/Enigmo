import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import EncryptDecrypt from "./EncryptDecrypt";

const Compute = () => {
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [keyword, setKeyword] = useState("10");  // Store generated keyword

  const encryptDecryptRef = useRef(null);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/generate-keyword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Keyword Generated!");
        setKeyword(data.keyword);  // Store the keyword
        setFormSubmitted(true);    // Show EncryptDecrypt
      } else {
        setFormSubmitted(true);
        toast.error("Failed to generate keyword");
      }
    } catch (error) {
      setFormSubmitted(true);
      toast.error("Server error. Please try again.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formSubmitted && encryptDecryptRef.current) {
      encryptDecryptRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [formSubmitted]);

  return (
    <div className="text-center p-6 py-20 lg:px-32 w-full overflow-hidden md:mb-40" id="Compute">
      <h1 className="text-2xl sm:text-4xl font-bold mb-2">Details to Begin</h1>
      <p className="text-gray-500 mb-12 max-w-80 mx-auto">
        Enter your details to generate a unique keyword for encryption and decryption.
      </p>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto text-gray-600 pt-8">
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2 text-left">
            Your Name
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded py-3 px-4 mt-2"
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-full md:w-1/2 text-left md:pl-4 sm:my-2 md:my-0">
            Your Email
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="w-full border border-gray-300 rounded py-3 px-4 mt-2"
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button className="bg-green-900 text-white py-2 px-12 mt-14 rounded cursor-pointer">
          {loading ? "Generating..." : "Generate Keyword"}
        </button>
      </form>

      {/* Show EncryptDecrypt only after form submission */}
      {formSubmitted && (
        <div ref={encryptDecryptRef}>
          <EncryptDecrypt keyword={keyword} />
        </div>
      )}
    </div>
  );
};

export default Compute;
