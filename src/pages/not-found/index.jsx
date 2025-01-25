import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white-100">
      <div className="text-center">
        <div className="mb-6">
          <div className="relative inline-block">
            <div className="animate-ping absolute inline-flex h-24 w-24 rounded-full bg-gray-500 opacity-75"></div>
            <div className="relative inline-flex rounded-full h-24 w-24 items-center justify-center bg-[#020817]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">404 Not Found</h1>

        <p className="text-gray-700 mb-8">
          Oops! The page you are looking for could not be found.
        </p>

        <Link
          to="/auth/login"
          className="bg-[#020817] hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
