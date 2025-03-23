import React from "react";
import rightImage from "../assets/rightImage.jpg";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import arrow_icon from "../assets/arrow_icon.svg";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <div>
    <Navbar />
    <section
      className="flex flex-col md:flex-row items-center px-6 md:px-20 lg:px-32 py-30 md:py-16 min-h-screen"
      id="Home"
    >
      <div className="w-full text-center md:w-3/5 md:text-left">
        <motion.h1
          className="text-4xl lg:text-6xl font-bold text-gray-900 leading-[1.1]"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2 }}
        >
          Secure Your Data, <br /> Unlock Possibilities.
        </motion.h1>
        <h2 className="text-3xl lg:text-6xl font-bold text-indigo-600 my-2">
          <Typewriter
            words={[
              "Encrypt and Decrypt.",
              "Privacy and Safety.",
              "Reliable and Easy.",
              "Protect and Control.",
            ]}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={120}
            deleteSpeed={120}
            delaySpeed={3000}
          />
        </h2>
        <motion.p
          className="text-gray-600 mt-6 text-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
        >
          Enigmo empowers you with seamless encryption and decryption of text
          and PDFs.
          <br />
          Protect your information with cutting-edge security, ensuring privacy
          at every step.
        </motion.p>

        <a href="#Compute">
        <motion.button
          className="group flex items-center gap-3 px-8 py-4 border-md bg-green-900 mt-4 text-white mt-20 px-10 ml-25 md:mt-5 md:ml-0
             hover:bg-white hover:text-green-900 hover:border rounded-lg cursor-pointer "
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2 }}
        >
          Let's Get Started
          {/* Arrow Icon */}
          <div
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 
                  group-hover:bg-green-900 group-hover:text-white"
          >
            <img src={arrow_icon} alt="→" className="w-5 h-5" />
          </div>
        </motion.button>
        </a>
      </div>

      <motion.div
        className="w-full md:w-2/5 flex justify-center mt-8 md:mt-0"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 2 }}
      >
        <img src={rightImage} alt="Encryption" className="max-w-full h-auto" />
      </motion.div>
    </section>
    </div>
  );
};

export default Header;
