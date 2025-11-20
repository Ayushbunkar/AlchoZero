import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Section from '../components/common/Section';
import MotionInView from '../components/common/MotionInView';
import GradientGlow from '../components/common/GradientGlow';
import Hero from '../components/marketing/Hero';
import StatsStrip from '../components/marketing/StatsStrip';
import TestimonialCarousel from '../components/marketing/TestimonialCarousel';
import { useAuth } from '../contexts/AuthContext';
import { Car, ShieldAlert, Activity } from 'lucide-react';
import homeHero from '../assets/images/homeimage.png';
import logo from '../assets/images/logo.jpg';
import Services from './Services';

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
  const goToServices = () => navigate('/services');
  return (
    <div className="mt-15">
      <Section>
        <div className="relative -mt-6 md:-mt-20">
          <GradientGlow />
          {/* Logo placed near hero text; use blend to visually remove dark background */}
          {/* <div className="absolute left-0 top-6 md:left-5 md:top-30 z-20 pointer-events-none">
            <img
              src={logo}
              alt="AlchoZero logo"
              className="h-12 md:h-16 object-contain mix-blend-screen filter brightness-125"
            />
          </div> */}
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
      {/* Feature grid removed as requested to make the Home page more focused */}
      {/* Embedded Services content (inline on Home) */}
      <Services />

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
