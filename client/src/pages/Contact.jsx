
import Section from '../components/common/Section';
import Breadcrumbs from '../components/common/Breadcrumbs';
import ContactForm from '../components/forms/ContactForm';
import FAQ from '../components/common/FAQ';
import MotionInView from '../components/common/MotionInView';
import Tilt3D from '../components/common/Tilt3D';
import helpcentre from '../assets/images/helpcentre.png';

const Contact = () => {
  return (
    <div className="flex flex-col gap-0">
      <Section>
        <div className="flex items-center justify-between flex-wrap gap-4 md:gap-6">
          <h1 className="text-2xl md:text-3xl font-bold text-accent-yellow tracking-tight">Contact Us</h1>
          <Breadcrumbs />
        </div>
      </Section>
      <Section>
        {/* Top row: Contact form and image, same size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-stretch">
          <MotionInView>
            <Tilt3D>
              <div className="bg-bg-subtle border border-white/10 rounded-xl p-6 md:p-8 shadow-soft flex flex-col h-full justify-center">
                <ContactForm />
              </div>
            </Tilt3D>
          </MotionInView>
          <MotionInView>
            <Tilt3D>
              <div className="bg-bg-subtle border border-white/10 rounded-xl p-0 md:p-0 shadow-soft flex flex-col h-full justify-center overflow-hidden">
                <img
                  src={helpcentre}
                  alt="Help Centre"
                  className="w-full h-full min-h-[320px] md:min-h-[400px] max-h-[500px] object-cover object-center rounded-xl"
                  loading="lazy"
                />
              </div>
            </Tilt3D>
          </MotionInView>
        </div>
        {/* Map placeholder: full width, landscape, below both */}
        <div className="mt-10">
          <MotionInView>
            <Tilt3D>
              <div className="bg-bg-subtle border border-white/10 rounded-xl p-0 md:p-0 flex flex-col w-full overflow-hidden">
                <h3 className="text-base font-semibold text-accent-yellow mb-1 px-6 pt-6">Find us</h3>
                <div className="relative rounded-lg overflow-hidden border border-white/10 mx-6 group focus-within:ring-2 focus-within:ring-accent-yellow">
                  <a
                    href="https://www.google.com/maps/place/LNCT+Bhopal/@23.176463,77.495064,17z"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open LNCT College in Google Maps"
                    className="block w-full h-full"
                    tabIndex={0}
                  >
                    <iframe
                      title="LNCT College, Raisen Road, Bhopal Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.234073289857!2d77.4928753154326!3d23.17646308488906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c43e2e2e2e2e3%3A0x7e2e2e2e2e2e2e2e!2sLNCT%20Bhopal!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-48 md:h-72"
                    ></iframe>
                    {/* Marker overlay */}
                    <div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none"
                      style={{ pointerEvents: 'none' }}
                    >
                      <div className="bg-accent-yellow text-black font-bold rounded-full w-16 h-16 flex items-center justify-center shadow-lg border-4 border-white/80 text-center text-xs md:text-sm animate-pulse">
                        LNCT College
                      </div>
                      <div className="mt-1 text-xs text-white bg-black/60 rounded px-2 py-0.5">Raisen Road</div>
                    </div>
                  </a>
                </div>
                <div className="text-xs text-gray-400 mt-2 px-6 pb-6">LNCT College, Raisen Road, Bhopal</div>
              </div>
            </Tilt3D>
          </MotionInView>
        </div>
        {/* Social and FAQs side by side below map */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <MotionInView delay={0.05}>
            <Tilt3D>
              <div className="bg-bg-subtle border border-white/10 rounded-xl p-5 md:p-6 flex flex-col gap-2 h-full">
                <h3 className="text-base font-semibold text-accent-yellow mb-1">Social</h3>
                <div className="flex gap-4 text-sm">
                  <a href="#" className="text-gray-300 hover:text-white transition">Twitter</a>
                  <a href="#" className="text-gray-300 hover:text-white transition">LinkedIn</a>
                  <a href="#" className="text-gray-300 hover:text-white transition">GitHub</a>
                </div>
              </div>
            </Tilt3D>
          </MotionInView>
          <MotionInView delay={0.1}>
            <Tilt3D>
              <div className="bg-bg-subtle border border-white/10 rounded-xl p-5 md:p-6 flex flex-col gap-2 h-full">
                <h3 className="text-base font-semibold text-accent-yellow mb-1">FAQs</h3>
                <FAQ
                  items={[
                    { q: 'Is this a real detection system?', a: 'This is a prototype UI; no real analysis is performed.' },
                    { q: 'Can I integrate my device?', a: 'The backend exposes demo routes for devices and events.' },
                    { q: 'Do you support alerts?', a: 'High-risk updates create events and can trigger email hooks.' },
                  ]}
                />
              </div>
            </Tilt3D>
          </MotionInView>
        </div>
      </Section>
    </div>
  );
};

export default Contact;
//dsf