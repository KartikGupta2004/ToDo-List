import React from 'react';

function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-HomeBg text-white px-4">
      <div className="flex flex-col justify-center items-center py-5 max-w-4xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center">
          About Me
        </h1>
        <p className="text-center text-base sm:text-lg md:text-xl lg:text-2xl mt-4">
          I am a full stack web developer and I have interest in exploring new domains and building user-centric projects which can be helpful to the users.
        </p>
      </div>
    </div>
  );
}

export default AboutUs;
