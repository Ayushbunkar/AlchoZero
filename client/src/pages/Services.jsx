import Section from '../components/common/Section';
import FeatureGrid from '../components/marketing/FeatureGrid';
import StatsStrip from '../components/marketing/StatsStrip';
import MotionInView from '../components/common/MotionInView';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { Car, Activity, ShieldAlert } from 'lucide-react';
import GradientGlow from '../components/common/GradientGlow';

const PricingCard = ({ title, price, features = [], cta }) => (
  <div className="bg-bg-subtle rounded-xl border border-white/10 shadow-soft p-5">
    <div className="text-sm font-semibold text-accent-yellow mb-2">{title}</div>
    <div className="text-3xl font-bold text-white mb-3">{price}</div>
    <ul className="text-xs text-gray-300 space-y-1 mb-4 list-disc pl-4">
      {features.map((f) => (<li key={f}>{f}</li>))}
    </ul>
    <button className="px-4 py-2 rounded-lg bg-accent-yellow text-black text-sm w-full">{cta}</button>
  </div>
);

const Services = () => {
  return (
    <div>
      <Section>
        <div className="relative flex items-center justify-between flex-wrap gap-2">
          <GradientGlow />
          <h1 className="text-2xl font-semibold text-accent-yellow">Services & Features</h1>
          <Breadcrumbs />
        </div>
      </Section>
      <Section>
        <MotionInView>
          <img
            src="/images/services-header.jpg"
            alt="Service capabilities and dashboard integrations"
            className="w-full h-auto rounded-xl border border-white/10 shadow-soft object-cover"
            loading="lazy"
          />
        </MotionInView>
      </Section>
      <Section title="Core Features" subtitle="Capabilities included in the prototype for demonstration.">
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
            price="$29/mo"
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
