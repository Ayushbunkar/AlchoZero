import React from 'react';
import Section from '../components/common/Section';
import FeatureGrid from '../components/marketing/FeatureGrid';
import StatsStrip from '../components/marketing/StatsStrip';
import MotionInView from '../components/common/MotionInView';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { 
  Car, 
  Activity, 
  ShieldAlert, 
  ScanFace,    // For Face Auth
  EyeOff,      // For Drowsiness
  Smartphone,  // For Distraction
  Mic,         // For Audio Analysis
  Gauge,       // For Rash Driving
  TrendingUp   // For Behavior Analysis
} from 'lucide-react';
import feat1 from '../assets/images/features/feature1.svg';
import feat2 from '../assets/images/features/feature2.svg';
import feat3 from '../assets/images/features/feature3.svg';
import feat4 from '../assets/images/features/feature4.svg';
import feat5 from '../assets/images/features/feature5.svg';
import feat6 from '../assets/images/features/feature6.svg';

const PricingCard = ({ title, price, features = [], cta }) => (
  <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-5 hover:border-accent-yellow/30 transition-colors duration-300">
    <div className="text-sm font-semibold text-accent-yellow mb-2">{title}</div>
    <div className="text-3xl font-bold text-white mb-3">{price}</div>
    <ul className="text-xs text-gray-300 space-y-1 mb-4 list-disc pl-4">
      {features.map((f) => (<li key={f}>{f}</li>))}
    </ul>
    <button className="px-4 py-2 rounded-lg bg-accent-yellow text-black text-sm w-full font-medium hover:bg-accent-yellow/90 transition-colors">{cta}</button>
  </div>
);

const Services = () => {

  const aiFeatures = [
    {
      title: "Driver Face Authentication",
      desc: "Biometric verification to ensure only authorized personnel operate the vehicle.",
      icon: ScanFace,
      image: feat1,
    },
    {
      title: "Drowsiness Detection",
      desc: "Real-time PERCLOS analysis to detect fatigue and trigger wake-up alarms.",
      icon: EyeOff,
      image: feat2,
    },
    {
      title: "Distraction Detection",
      desc: "Identifies phone usage, smoking, or looking away from the road via cabin cam.",
      icon: Smartphone,
      image: feat3,
    },
    {
      title: "Audio Alcohol Analysis",
      desc: "Voice-based spectral analysis to detect slurring and potential impairment.",
      icon: Mic,
      image: feat4,
    },
    {
      title: "Rash Driving Detection",
      desc: "Accelerometer data fusion to identify harsh braking, drifting, and over-speeding.",
      icon: Gauge,
      image: feat5,
    },
    {
      title: "Driver Behaviour Analysis",
      desc: "Long-term scoring of driving patterns to improve fleet safety and reduce insurance.",
      icon: TrendingUp,
      image: feat6,
    },
  ];

  return (
    <div>
      <Section>
        <div className="relative flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-semibold text-accent-yellow">Services & Features</h1>
          <Breadcrumbs />
        </div>
      </Section>

      <Section>
        <MotionInView>
          <div className="relative group">
            <img
              src="/images/services-header.jpg"
              alt="Service capabilities and dashboard integrations"
              className="w-full h-auto max-h-[500px] rounded-xl border border-white/10 shadow-soft object-cover"
              loading="lazy"
            />
            {/* Optional Gradient Overlay on image */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
          </div>
        </MotionInView>
      </Section>

      {/* --- NEW SECTION: AI Safety Modules --- */}
      <Section title="AI Safety Modules" subtitle="Next-generation sensor fusion and computer vision capabilities.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aiFeatures.map((feature, index) => (
            <MotionInView key={index} delay={index * 0.1}>
              <div className="rounded-2xl border border-white/8 bg-bg-subtle overflow-hidden shadow-md transition-transform hover:scale-[1.01]">
                {feature.image && (
                  <div className="w-full h-48 md:h-56 lg:h-64 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover rounded-t-2xl"
                    />
                  </div>
                )}
                <div className="p-6 md:p-8">
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            </MotionInView>
          ))}
        </div>
      </Section>
      {/* -------------------------------------- */}

      <Section title="Dashboard Utilities" subtitle="Capabilities included in the prototype interface.">
        <FeatureGrid
          items={[
            { title: 'Live Camera', icon: Car, desc: 'Simulated camera feed preview with responsive UI.' },
            { title: 'Risk Meter', icon: Activity, desc: 'Animated risk visualization for detection confidence.' },
            { title: 'Event Logging', icon: ShieldAlert, desc: 'Server-side events with filters and CSV export.' },
          ]}
        />
      </Section>

      <Section title="Operational Stats">
        <MotionInView>
          <StatsStrip
            stats={[
              { label: 'Endpoints', value: '10+' },
              { label: 'Requests/day', value: '50k*' },
              { label: 'Latency', value: '<100ms*' },
              { label: 'Availability', value: '99.9%*' },
            ]}
          />
        </MotionInView>
      </Section>

      <Section>
        <MotionInView>
          <img
            src="/images/services-illustration.jpg"
            alt="Illustration of device connectivity and event flow"
            className="w-full h-auto rounded-xl border border-white/10 shadow-soft object-cover"
            loading="lazy"
          />
        </MotionInView>
      </Section>

      <Section title="Plans" subtitle="Illustrative pricing for demo purposes only.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PricingCard
            title="Starter"
            price="Free"
            features={[ 'Dashboard', 'Devices & Events', 'Basic Alerts' ]}
            cta="Get Started"
          />
          <PricingCard
            title="Pro"
            price="₹500/mo"
            features={[ 'Everything in Starter', 'Email Alerts', 'Advanced Filters' ]}
            cta="Upgrade"
          />
          <PricingCard
            title="Enterprise"
            price="Contact Us"
            features={[ 'SLA', 'Custom Integrations', 'Priority Support' ]}
            cta="Contact Sales"
          />
        </div>
      </Section>
    </div>
  );
};

export default Services;