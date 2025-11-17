import Section from '../components/common/Section';
import MotionInView from '../components/common/MotionInView';
import StatsStrip from '../components/marketing/StatsStrip';
import GradientGlow from '../components/common/GradientGlow';
import Tilt3D from '../components/common/Tilt3D';
import teamBanner from '../assets/images/team.png';

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
    <div className="">
      <Section>
        <div className="relative space-y-4">
          <GradientGlow />
          <h1 className="text-2xl md:text-3xl font-semibold text-accent-yellow">About AlchoZero</h1>
          <p className="text-gray-300 text-sm leading-6 max-w-3xl">
            AlchoZero is an end-to-end safety platform to detect impaired or unsafe driving using
            sensor signals and AI. The stack includes a production-ready Node.js/Express backend
            with MongoDB, alerting utilities, and a modern React dashboard.
          </p>
          <MotionInView>
            <StatsStrip
              stats={[
                { label: 'Prototype Version', value: 'v1.0' },
                { label: 'Modules', value: 'Events/Devices/Users' },
                { label: 'Stack', value: 'MERN' },
                { label: 'Latency', value: '<100ms*' },
              ]}
            />
          </MotionInView>
          <MotionInView>
            <img
              src={teamBanner}
              alt="Team collaboration and system architecture overview"
              className="w-full h-auto rounded-xl border border-white/10 shadow-soft object-cover"
              loading="lazy"
            />
          </MotionInView>
        </div>
      </Section>

      <Section title="What We Do" subtitle="Our mission, areas of focus, and core capabilities.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MotionInView>
            <Tilt3D>
              <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
                <h3 className="text-sm font-semibold text-accent-yellow mb-2">Our Mission</h3>
                <p className="text-xs text-gray-300 leading-6">
                  Reduce road accidents by detecting intoxication and drowsiness early, enabling quick
                  interventions and alerting emergency contacts when risk is high.
                </p>
              </div>
            </Tilt3D>
          </MotionInView>
          <MotionInView delay={0.05}>
            <Tilt3D>
              <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
                <h3 className="text-sm font-semibold text-accent-yellow mb-2">What We Build</h3>
                <p className="text-xs text-gray-300 leading-6">
                  A MERN backend for events, devices, and detections, plus a real-time dashboard.
                  Incoming AI/ML predictions trigger event logs and optional email alerts.
                </p>
              </div>
            </Tilt3D>
          </MotionInView>
          <MotionInView delay={0.1}>
            <Tilt3D>
              <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4">
                <h3 className="text-sm font-semibold text-accent-yellow mb-2">Core Features</h3>
                <ul className="text-xs text-gray-300 leading-6 list-disc pl-4">
                  <li>Detection ingest API with thresholding</li>
                  <li>Event logging and device management</li>
                  <li>Alerts via email (configurable)</li>
                  <li>Responsive React dashboard</li>
                </ul>
              </div>
            </Tilt3D>
          </MotionInView>
        </div>
      </Section>

      <Section title="Timeline" subtitle="Key milestones in building the prototype.">
        <div className="relative border-l border-white/10 ml-2 pl-6 space-y-5">
          {[
            { t: 'Concept', d: 'Initial idea and system design' },
            { t: 'Backend', d: 'APIs for devices, events, users, vehicles' },
            { t: 'Frontend', d: 'React app with responsive dashboards' },
            { t: 'Alerts', d: 'High-risk event creation and email hooks' },
          ].map((s) => (
            <div key={s.t} className="relative">
              <span className="absolute -left-[11px] top-1 w-2.5 h-2.5 rounded-full bg-accent-yellow border border-black/30" />
              <div className="text-sm text-gray-200">{s.t}</div>
              <div className="text-xs text-gray-400">{s.d}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Our Team" subtitle="Cross‑functional builders with focus on reliability and UX.">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {team.map((m, i) => (
            <MotionInView key={m.name} delay={i * 0.04}>
              <Tilt3D>
                <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-4 flex flex-col items-center text-center">
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
              </Tilt3D>
            </MotionInView>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default About;
