import React from "react";
import {
  FaCalendarCheck,
  FaHandsHelping,
  FaHeart,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Container from "../Container";

const CoreFeature = () => {
  const features = [
    {
      icon: FaCalendarCheck,
      title: "Create & Host",
      description:
        "Any registered user can easily initiate and manage community events.",
      color: "text-blue-500",
    },
    {
      icon: FaMapMarkerAlt,
      title: "Local Impact",
      description:
        "Discover and join events tailored to your local area and interests.",
      color: "text-green-500",
    },
    {
      icon: FaHandsHelping,
      title: "Track Progress",
      description:
        "Monitor events you've joined and see the real social change you've created.",
      color: "text-yellow-500",
    },
    {
      icon: FaHeart,
      title: "Community Driven",
      description:
        "A platform built on the passion and collaboration of local volunteers.",
      color: "text-red-500",
    },
  ];
  return (
    <div>
      <section className="py-10">
        <Container>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10 border-b-2 border-blue-500 inline-block mx-auto pb-1 ">
            Our Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.02] text-center border-t-4 border-blue-400 cursor-pointer"
              >
                <feature.icon
                  className={`text-5xl ${feature.color} mx-auto mb-4`}
                />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default CoreFeature;
