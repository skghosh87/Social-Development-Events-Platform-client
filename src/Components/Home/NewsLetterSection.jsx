import React from "react";
import Container from "../Container";

const NewsLetterSection = () => {
  return (
    <div>
      <section className="py-16 bg-blue-600">
        <Container className="text-center text-white max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Stay Updated on Social Events
          </h2>
          <p className="text-lg font-light mb-6">
            Subscribe to our newsletter and never miss an opportunity to
            volunteer and contribute to your community.
          </p>
          <form className="flex flex-col md:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full md:w-2/3 p-3 rounded-lg text-gray-800 
             border-2 border-white              
             focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
              required
            />
            <button
              type="submit"
              className="w-full md:w-1/3 bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition duration-300 shadow-md"
            >
              Subscribe Now
            </button>
          </form>
        </Container>
      </section>
    </div>
  );
};

export default NewsLetterSection;
