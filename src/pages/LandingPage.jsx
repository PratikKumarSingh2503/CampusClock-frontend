import React from "react";
import Lottie from "lottie-react";
import homebg from "../assets/homebg.json";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="h-screen flex flex-col p-6 md:px-20 overflow-hidden">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center z-100">
        <h1 className="text-[20px] md:text-[64px] font-extrabold font-heading1 text-color3">
          CampusClock
        </h1>
        <div className="space-x-4 md:space-x-[34px] text-[12px] md:text-[20px] italic font-bold">
          <Link
            to="/login"
            className="px-6 md:px-10 py-1 md:py-2 border shadow-md hover:bg-color2 rounded-full"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 md:px-10 py-1 md:py-2 text-white rounded-full shadow-md bg-color2 hover:bg-hovercolor2"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Main Section */}
      <div className="flex flex-col lg:flex-row-reverse items-center justify-center flex-grow">
        <div className="lg:w-3/5 flex justify-center top-0">
          <Lottie
            animationData={homebg}
            loop={true}
            className="max-w-[80%] md:max-w-[100%]"
          />
        </div>

        {/* Left Content (Text) */}
        <div className="lg:w-2/5 mt-6 lg:mt-0">
          <h2 className="text-[26px] md:text-[32px] font-extrabold mb-4 font-heading2">
            Make Attendance in <span className="text-color3">2 minutes</span>
          </h2>
          <p className="text-[16px] md:text-[20px] font-regular leading-normal mb-6 font-headingp1">
            CampusClock is your one-stop solution for <br />
            professional attendance marking. Create and <br />
            edit forms with ease, no prior knowledge required.
          </p>
          <button className="text-[12px] md:text-[20px] font-bold">
            <Link
              to="/register"
              className="px-6 md:px-10 py-1 md:py-2 text-white rounded-full shadow-md bg-color2 hover:bg-hovercolor2"
            >
              Get Started
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
// import { Link } from "react-router-dom";

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col justify-center items-center">
//       <h1 className="text-4xl font-bold text-blue-900 mb-4">📍 Attendance Tracker System</h1>
//       <p className="text-gray-700 mb-6">Track attendance using Geofencing in real-time</p>
//       <div className="space-x-4">
//         <Link to="/login">
//           <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Login</button>
//         </Link>
//         <Link to="/register">
//           <button className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Register</button>
//         </Link>
//       </div>
//     </div>
//   );
// }
