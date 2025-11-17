import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Section from '../components/common/Section';
import MotionInView from '../components/common/MotionInView';
import GradientGlow from '../components/common/GradientGlow';
import Hero from '../components/marketing/Hero';
import FeatureGrid from '../components/marketing/FeatureGrid';
import StatsStrip from '../components/marketing/StatsStrip';
import TestimonialCarousel from '../components/marketing/TestimonialCarousel';
import { useAuth } from '../contexts/AuthContext';
import { Car, ShieldAlert, Activity } from 'lucide-react';
import homeHero from '../assets/images/homeimage.png';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const goToDashboard = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login', { state: { from: '/dashboard' } });
    }
  };
  return (
    <div className="">
      <Section>
        <div className="relative -mt-6 md:-mt-20">
          <GradientGlow />
        <Hero
          title="Smart Safety with"
          highlight="AlchoZero"
          subtitle="Prevent drunk driving before it happens — detect impairment and disable ignition."
          primaryAction="Go to Dashboard"
          secondaryAction="Learn More"
          onPrimary={goToDashboard}
          onSecondary={() => navigate('/about')}
          imageSrc={homeHero}
          imageAlt="Illustration for AlchoZero home hero"
        />
        <MotionInView>
          <StatsStrip
            stats={[
              { label: 'Simulated Devices', value: '12' },
              { label: 'Events Logged', value: '1,248' },
              { label: 'Average Risk', value: '23%' },
              { label: 'Uptime', value: '99.9%' },
            ]}
          />
        </MotionInView>
        </div>
      </Section>
      <Section title="Why AlchoZero" subtitle="Modern safety features designed to be reliable, responsive, and easy to use.">
        <FeatureGrid
          items={[
            { title: 'Live Camera', icon: Car, desc: 'Preview your webcam stream as if it were an in-vehicle camera feed.' },
            { title: 'Risk Meter', icon: Activity, desc: 'Animated confidence bar changing color with escalating detection risk.' },
            { title: 'Event Log', icon: ShieldAlert, desc: 'Historical data and CSV export for analysis and reporting.' },
          ]}
        />
      </Section>
      <Section title="Trusted by teams" subtitle="Here’s what early users say about our prototype.">
        <TestimonialCarousel
          items={[
            { quote: 'A clear, intuitive dashboard. Loved the responsiveness on mobile.', author: 'Riya', role: 'AI Engineer' },
            { quote: 'Easy to integrate API and straightforward event logs.', author: 'Arjun', role: 'DevOps' },
            { quote: 'The risk visualization is simple and effective.', author: 'Priya', role: 'QA Lead' },
          ]}
        />
        <div className="text-center mt-4">
          <Link to="/contact" className="text-sm text-accent-yellow hover:underline">Have feedback? Contact us →</Link>
        </div>
      </Section>
      <Section>
        <div className="text-center text-xs text-gray-500">Prototype only – no real impairment analysis performed.</div>
      </Section>
    </div>
  );
};

export default Home;
