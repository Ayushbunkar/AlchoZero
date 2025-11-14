const About = () => {
  const team = [
    {
      name: 'Ayush Bunkar',
      role: 'Project Lead & Backend',
      photo: 'https://i.pravatar.cc/240?img=12',
      bio: 'Owns system design, APIs, database models, and integrations.'
    },
    {
      name: 'Yash',
      role: 'Frontend Engineer',
      photo: 'https://i.pravatar.cc/240?img=32',
      bio: 'Builds responsive UI, dashboards, and real-time interactions.'
    },
    {
      name: 'Riya',
      role: 'ML/AI Engineer',
      photo: 'https://i.pravatar.cc/240?img=15',
      bio: 'Trains and optimizes detection models and inference flows.'
    },
    {
      name: 'Arjun',
      role: 'DevOps & Cloud',
      photo: 'https://i.pravatar.cc/240?img=27',
      bio: 'Automates CI/CD, deploys, and monitors production reliability.'
    },
    {
      name: 'Priya',
      role: 'QA & Security',
      photo: 'https://i.pravatar.cc/240?img=48',
      bio: 'Owns testing strategy, security checks, and release quality.'
    },
    {
      name: 'Kunal',
      role: 'Device & Sensors',
      photo: 'https://i.pravatar.cc/240?img=5',
      bio: 'Integrates edge devices, telemetry, and calibration routines.'
    },
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-accent-yellow">About AlchoZero</h1>
        <p className="text-gray-300 text-sm leading-6 max-w-3xl">
          AlchoZero is an end-to-end safety platform to detect impaired or unsafe driving using
          sensor signals and AI. The stack includes a production-ready Node.js/Express backend
          with MongoDB, alerting utilities, and a modern React dashboard.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
          <h3 className="text-sm font-semibold text-accent-yellow mb-2">Our Mission</h3>
          <p className="text-xs text-gray-300 leading-6">
            Reduce road accidents by detecting intoxication and drowsiness early, enabling quick
            interventions and alerting emergency contacts when risk is high.
          </p>
        </div>
        <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
          <h3 className="text-sm font-semibold text-accent-yellow mb-2">What We Build</h3>
          <p className="text-xs text-gray-300 leading-6">
            A MERN backend for events, devices, and detections, plus a real-time dashboard.
            Incoming AI/ML predictions trigger event logs and optional email alerts.
          </p>
        </div>
        <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
          <h3 className="text-sm font-semibold text-accent-yellow mb-2">Core Features</h3>
          <ul className="text-xs text-gray-300 leading-6 list-disc pl-4">
            <li>Detection ingest API with thresholding</li>
            <li>Event logging and device management</li>
            <li>Alerts via email (configurable)</li>
            <li>Responsive React dashboard</li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-accent-yellow">Our Team</h2>
        <p className="text-xs text-gray-400 max-w-3xl">
          A cross‑functional team covering backend, frontend, ML, devices, DevOps, and QA to ensure
          the system is reliable, secure, and ready for production environments.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {team.map((m) => (
            <div key={m.name} className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4 flex flex-col items-center text-center">
              <img
                src={m.photo}
                alt={`${m.name} — ${m.role}`}
                className="w-24 h-24 rounded-full object-cover mb-3 border border-white/10"
                loading="lazy"
              />
              <div className="font-medium text-gray-200 text-sm">{m.name}</div>
              <div className="text-[11px] text-accent-yellow mb-2">{m.role}</div>
              <p className="text-[11px] text-gray-400 leading-5">{m.bio}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
