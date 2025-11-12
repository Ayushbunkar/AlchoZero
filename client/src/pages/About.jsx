const About = () => {
  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold text-accent-yellow">About AlchoZero</h1>
      <p className="text-gray-300 text-sm leading-6">
        AlchoZero is a frontend prototype of a safety system that simulates detection of drunk or drowsy driving.
        It combines a browser camera preview, mock sensor data, and dynamic alerts to demonstrate how such a system could look and feel.
      </p>
      <p className="text-gray-400 text-xs">
        This project contains no backend and performs no real impairment detection. All values are randomly generated.
      </p>
    </div>
  );
};

export default About;
