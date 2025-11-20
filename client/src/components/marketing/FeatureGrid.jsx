// import React from 'react';
// import MotionInView from '../common/MotionInView';
// import Tilt3D from '../common/Tilt3D';

// const FeatureCard = ({ icon: Icon, title, desc, delay = 0 }) => (
//   <MotionInView delay={delay}>
//     <Tilt3D>
//       <div className="p-4 rounded-xl bg-bg-subtle border border-white/10 shadow-soft transition-transform h-full flex flex-col min-h-[100px]">
//         <div className="flex items-center gap-2 mb-1">
//           {Icon && <Icon size={18} className="text-accent-yellow" />}
//           <h3 className="text-accent-yellow font-medium text-sm">{title}</h3>
//         </div>
//         <p className="text-xs text-gray-400 leading-relaxed grow">{desc}</p>
//       </div>
//     </Tilt3D>
//   </MotionInView>
// );

// const FeatureGrid = ({ items = [] }) => {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
//       {items.map((f, idx) => (
//         <FeatureCard key={f.title} {...f} delay={idx * 0.05} />
//       ))}
//     </div>
//   );
// };

// export default FeatureGrid;

import React from "react";
import { 
  UserCheck, 
  Eye, 
  Volume2, 
  Activity, 
  Gauge, 
  Users, 
  EyeOff, 
  ShieldCheck, 
  MoveRight, 
  Route, 
  AlertTriangle,
  Bell,
  Lock,
  Cloud 
} from "lucide-react";

import MotionInView from "../common/MotionInView";
import Tilt3D from "../common/Tilt3D";
import feat1 from "../../assets/images/features/feature1.svg";
import feat2 from "../../assets/images/features/feature2.svg";
import feat3 from "../../assets/images/features/feature3.svg";
import feat4 from "../../assets/images/features/feature4.svg";
import feat5 from "../../assets/images/features/feature5.svg";
import feat6 from "../../assets/images/features/feature6.svg";


// ------------------------------
// Feature Card
// ------------------------------
const FeatureCard = ({ icon: Icon, image, title, desc, delay = 0 }) => (
  <MotionInView delay={delay}>
    <Tilt3D>
      <div className="p-5 rounded-xl bg-bg-subtle border border-white/10 hover:border-accent-yellow/40 transition-all shadow-lg hover:shadow-accent-yellow/10 h-full flex flex-col min-h-[140px] group">
        
        {/* Top Row */}
        <div className="flex items-center gap-3 mb-2">
          {image ? (
            <img src={image} alt={`${title} icon`} className="w-10 h-10 rounded-md object-cover" />
          ) : (
            Icon && (
              <Icon size={20} className="text-accent-yellow group-hover:scale-110 transition-transform" />
            )
          )}
          <h3 className="text-accent-yellow font-semibold text-sm tracking-wide">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-400 leading-relaxed grow">
          {desc}
        </p>
      </div>
    </Tilt3D>
  </MotionInView>
);


// ------------------------------
// Feature Grid
// ------------------------------
const FeatureGrid = ({ items = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-stretch mt-6">
      {items.map((f, idx) => (
        <FeatureCard key={f.title} {...f} delay={idx * 0.06} />
      ))}
    </div>
  );
};


// ------------------------------
// ALL FEATURES DATA
// ------------------------------
export const FEATURES = [
  {
    title: "Driver Face Authentication",
    desc: "Verify driver identity using AI-powered face recognition to prevent unauthorized driving.",
    icon: UserCheck,
    image: feat1,
  },
  {
    title: "Drowsiness Detection",
    desc: "Detect eye closure, blinking patterns, and head position to identify fatigue early.",
    icon: EyeOff,
    image: feat2,
  },
  {
    title: "Distraction Detection",
    desc: "Alerts when the driver looks away from the road or uses a phone.",
    icon: Eye,
    image: feat3,
  },
  {
    title: "Audio / Voice Alcohol Analysis",
    desc: "Analyze voice frequency patterns to detect alcohol consumption with high precision.",
    icon: Volume2,
    image: feat4,
  },
  {
    title: "Rash Driving Detection",
    desc: "Detects harsh braking, sudden acceleration, swerving, and unsafe steering.",
    icon: Activity,
    image: feat5,
  },
  {
    title: "Driver Behaviour Analysis",
    desc: "Long-term AI-based driving behavior scoring and safety insights.",
    icon: Users,
    image: feat6,
  },
  {
    title: "Real-Time Eye Tracking",
    desc: "Advanced gaze and eye tracking to monitor attention levels.",
    icon: Eye,
  },
  {
    title: "Alcohol Sensor Integration",
    desc: "Combines breath sensors + camera checks for maximum accuracy.",
    icon: ShieldCheck,
  },
  {
    title: "Speed Monitoring",
    desc: "Tracks real-time vehicle speed and auto alerts if overspeeding occurs.",
    icon: Gauge,
  },
  {
    title: "Lane Departure Warning",
    desc: "Alerts when the car unintentionally drifts from its lane.",
    icon: Route,
  },
  {
    title: "Accident Prediction System",
    desc: "AI predicts risky situations and potential collisions based on driving patterns.",
    icon: AlertTriangle,
  },
  {
    title: "Emergency SOS Trigger",
    desc: "Automatically notifies emergency contacts during dangerous or accident conditions.",
    icon: Bell,
  },
  {
    title: "Engine Cut-Off System",
    desc: "If intoxication is confirmed, the engine is locked for safety.",
    icon: Lock,
  },
  {
    title: "Cloud Dashboard & Reports",
    desc: "Fleet owners receive real-time analytics, logs, and performance reports.",
    icon: Cloud,
  },
];


// ------------------------------
// FINAL MAIN SECTION EXPORT
// ------------------------------
const FeatureSection = () => {
  return (
    <section className="py-10">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-white">Smart AI Safety Features</h2>
        <p className="text-gray-400 text-sm mt-1">
          Advanced AI-driven safety intelligence for every drive.
        </p>
      </div>

      <FeatureGrid items={FEATURES} />
    </section>
  );
};

export default FeatureSection;
