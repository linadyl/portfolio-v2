"use client";

import Header from '@/components/Header';
import CustomCursor from "@/components/cursor";
import CustomHighlight from "@/components/CustomHighlight";
import { CursorProvider } from '@/components/CursorContext';
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import WigglingAsciiBackground from "@/components/WigglingAsciiBackground";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createPortal } from "react-dom";

function FixedAscii() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, opacity: 0.3, pointerEvents: 'none', zIndex: 0 }}>
      <WigglingAsciiBackground />
    </div>,
    document.body
  );
}

function HeroCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const prevImage = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <motion.section 
      className="px-6 sm:px-10 md:px-16 lg:px-24 xl:px-44 mb-16 transform-gpu"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={prevImage}
          className="shrink-0 bg-foreground text-background p-2 rounded-full hover:opacity-90 transition"
          aria-label="Previous image"
          style={{ cursor: 'none' }}
        >
          <ChevronLeft size={24} />
        </button>

        <div className="relative w-full h-[400px] sm:h-[500px] md:h-[700px] rounded-lg overflow-hidden border-2 border-foreground"
             style={{ boxShadow: '4px 4px 0 var(--foreground)' }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={images[current]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="absolute inset-0"
            >
              <Image
                src={images[current]}
                alt="Brewmatch app mockup"
                fill
                style={{ objectFit: 'cover' }}
                priority={current === 0}
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-2 rounded-full transition-all ${idx === current ? "bg-foreground" : "bg-foreground/40"}`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={nextImage}
          className="shrink-0 bg-foreground text-background p-2 rounded-full hover:opacity-90 transition"
          aria-label="Next image"
          style={{ cursor: 'none' }}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </motion.section>
  );
}

export default function BrewmatchCaseStudy() {
  const images = ["/brewmatch/main1.webp", "/brewmatch/main2.webp", "/brewmatch/main3.webp","/brewmatch/main4.webp","/brewmatch/main5.webp"];

  const projectDetails = {
    title: "brewmatch",
    tagline: "a personality-based cafe locator app",
    duration: "Oct 2024 - Feb 2025",
    role: "Full Stack Developer/UI Designer",
    team: "(1) Product Designer, (1) UX Researcher, (1) Developer",
    tools: ["HTML", "CSS", "Vanilla JavaScript", "PHP", "SQL"],
    github: "https://drive.google.com/file/d/1rjX11ATmVMlHZ1bu5-6AbVdAta-r5dQX/view",
  };

  const Tag = ({ name, color = "#562B15", textColor = "#ffffff" }: { name: string; color?: string; textColor?: string }) => (
    <span 
      className="px-3 py-1 rounded-full text-xs font-mono inline-block"
      style={{ 
        backgroundColor: color,
        color: textColor,
        border: "1px solid #271918",
      }}
    >
      {name}
    </span>
  );

  const ContentCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div 
      className={`rounded-lg border-2 border-foreground/10 ${className}`}
      style={{ 
        backgroundColor: 'rgba(255, 253, 249, 0.92)',
        boxShadow: '0 8px 32px rgba(39, 25, 24, 0.08)',
      }}
    >
      {children}
    </div>
  );

  return (
    <CursorProvider>
      <FixedAscii />
      <main className="relative z-10 overflow-x-hidden min-h-screen font-mono">
        <CustomCursor />
        <Header />
        
        <section className="pt-28 sm:pt-32 md:pt-36 pb-8 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-44">
          <ContentCard className="p-8 sm:p-10 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="transform-gpu"
            >
              <Link href="/" className="inline-flex items-center text-accent hover:opacity-80 mb-8" style={{ cursor: 'none' }}>
                <span className="mr-2">←</span>
                <span>back to projects</span>
              </Link>

              <div className="mb-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-mono mb-2">
                  <CustomHighlight color="#562B15" opacity={0.3}>{projectDetails.title}</CustomHighlight>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-accent">
                  {projectDetails.tagline}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {projectDetails.tools.map((tool, index) => {
                  const tagColors = {
                    "HTML": { color: "#EC5D28", textColor: "#ffffff" },
                    "CSS": { color: "#1572B6", textColor: "#ffffff" },
                    "Vanilla JavaScript": { color: "#F7DF1E", textColor: "#000000" },
                    "PHP": { color: "#777BB3", textColor: "#ffffff" },
                    "SQL": { color: "#3397DC", textColor: "#ffffff" }
                  };
                  const colors = tagColors[tool as keyof typeof tagColors] || { color: "#562B15", textColor: "#ffffff" };
                  return <Tag key={index} name={tool} {...colors} />;
                })}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-accent opacity-70">Duration</p>
                  <p className="text-foreground font-bold">{projectDetails.duration}</p>
                </div>
                <div>
                  <p className="text-accent opacity-70">Role</p>
                  <p className="text-foreground font-bold">{projectDetails.role}</p>
                </div>
                <div>
                  <p className="text-accent opacity-70">Team</p>
                  <p className="text-foreground font-bold">{projectDetails.team}</p>
                </div>
              </div>
            </motion.div>
          </ContentCard>
        </section>

        <HeroCarousel images={images} />

        <div className="px-6 sm:px-10 md:px-16 lg:px-24 xl:px-44 max-w-6xl mx-auto mb-20">
          <ContentCard className="p-8 sm:p-10 md:p-12 lg:p-16">
            
            <motion.section 
              className="mb-16 transform-gpu"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl mb-6">
                <CustomHighlight color="#3f764c" opacity={0.4}>overview</CustomHighlight>
              </h2>
              <div className="space-y-4 text-base sm:text-lg leading-relaxed">
                <p>
                  brewmatch is a fully functional mock mobile app that helps coffee lovers discover their perfect 
                  local cafe through a unique personality-based matching system. built entirely with vanilla 
                  technologies (no frameworks!), this project showcases fundamental web development skills and 
                  creative problem-solving.
                </p>
                <p>
                  Our goal was to create a user-friendly platform that helps coffee lovers find cafés that match their unique preferences while supporting local businesses. Through personality-based recommendations and seamless event booking, BrewMatch fosters a stronger community coffee culture.
                </p>
              </div>
            </motion.section>

            <motion.section
              className="mb-16 transform-gpu"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl mb-6">
                <CustomHighlight color="#3f764c" opacity={0.4}>user research & early insights</CustomHighlight>
              </h2>

              <div className="space-y-4 text-base sm:text-lg leading-relaxed mb-8">
                <p>
                  We conducted interviews at multiple Toronto cafés, speaking with students, professionals, and remote workers aged 21-58. The key takeaways shaped our approach:
                </p>
                <p>
                  <br/>🔹 Users seek cafés that align with their personality and work/social preferences. 
                  <br/>🔹 Many want real-time updates on seating availability and café events. 
                  <br/>🔹 Independent café owners need better tools to reach their target audience.
                </p>
                <p>
                  Based on these insights, we designed a personality quiz to match users with cafés that suit their style and introduced filters for ambiance, amenities, and work-friendly environments.
                </p>
              </div>
            </motion.section>

            <motion.section 
              className="mb-16 transform-gpu"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl mb-6">
                <CustomHighlight color="#3f764c" opacity={0.4}>the problem</CustomHighlight>
              </h2>
              <div className="space-y-4 text-base sm:text-lg leading-relaxed mb-8">
                <p>
                  finding the perfect cafe isn&apos;t just about proximity or ratings. coffee culture is deeply 
                  personal - some seek quiet corners for deep work, others want vibrant spaces for socializing, 
                  and many fall somewhere in between.
                </p>
                <p>
                  existing cafe locators focus on practical metrics (distance, price, ratings) but miss the 
                  experiential aspects that make a cafe feel like &quot;your place.&quot;
                </p>
                <p>
                  Our research showed that: 
                  <br/>
                  <br/>🏠 38% of Canadians prefer independent cafés over chain brands.
                  <br/>🧑🏼‍💻 65% of remote workers use cafés as a workspace.
                  <br/>💵 40% of Canadians are willing to pay more for specialty coffee.
                </p>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl mb-6">
                <CustomHighlight color="#3f764c" opacity={0.4}>the solution</CustomHighlight>
              </h2>
              <div className="space-y-4 text-base sm:text-lg leading-relaxed">
                <p>
                  brewmatch bridges this gap by understanding users as individuals first, coffee drinkers second. 
                  the personality quiz creates a unique profile that considers:
                </p>
                <ul className="list-none space-y-2 ml-4">
                  <li>☕ coffee preferences (strength, sweetness, milk alternatives)</li>
                  <li>🎵 ambiance preferences (quiet, lively, music type)</li>
                  <li>💻 work style (remote friendly, wifi quality, outlet availability)</li>
                  <li>👥 social preferences (solo spots, group seating, community events)</li>
                </ul>
              </div>
            </motion.section>

            <motion.section 
              className="mb-16 transform-gpu"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl mb-6">
                <CustomHighlight color="#3f764c" opacity={0.4}>technical implementation</CustomHighlight>
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl sm:text-2xl mb-3 text-accent">frontend architecture</h3>
                  <p className="text-base sm:text-lg leading-relaxed mb-4">
                    built with vanilla JavaScript to deeply understand DOM manipulation, event handling, and 
                    state management without framework abstractions. implemented a custom routing system for 
                    seamless single-page application navigation.
                  </p>
                  <div className="bg-foreground/5 rounded-lg p-4 border border-foreground/20">
                    <code className="text-sm text-accent">
                      &#47;&#47; Custom personality algorithm snippet<br/>
                      function calculateCafeMatch(userProfile, cafeData) &#123;<br/>
                      &nbsp;&nbsp;const weights = &#123;<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;coffee: 0.3,<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;ambiance: 0.25,<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;social: 0.25,<br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;workspace: 0.2<br/>
                      &nbsp;&nbsp;&#125;;<br/>
                      &nbsp;&nbsp;// ... matching logic<br/>
                      &#125;
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl mb-3 text-accent">backend development</h3>
                  <p className="text-base sm:text-lg leading-relaxed">
                    PHP powers the server-side logic, handling quiz submissions, user sessions, and cafe 
                    recommendations. MySQL database stores user profiles, cafe information, and quiz results 
                    with optimized queries for fast matching.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl mb-3 text-accent">responsive design</h3>
                  <p className="text-base sm:text-lg leading-relaxed">
                    mobile-first CSS ensures the app looks native on phones while scaling beautifully to 
                    tablets and desktops. custom animations and transitions create a delightful user experience.
                  </p>
                </div>
              </div>
            </motion.section>

            <motion.section 
              className="mb-16 transform-gpu"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl mb-6">
                <CustomHighlight color="#3f764c" opacity={0.4}>challenges & learnings</CustomHighlight>
              </h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-accent pl-4">
                  <h3 className="text-lg font-bold mb-2">state management without frameworks</h3>
                  <p className="text-base opacity-90">
                    implementing complex state management in vanilla JS taught me the value of frameworks 
                    while deepening my understanding of JavaScript fundamentals.
                  </p>
                </div>
                
                <div className="border-l-4 border-accent pl-4">
                  <h3 className="text-lg font-bold mb-2">matching algorithm optimization</h3>
                  <p className="text-base opacity-90">
                    balancing accuracy with performance required multiple iterations and clever caching 
                    strategies to keep the app responsive.
                  </p>
                </div>
                
                <div className="border-l-4 border-accent pl-4">
                  <h3 className="text-lg font-bold mb-2">responsive mobile-first design</h3>
                  <p className="text-base opacity-90">
                    creating a native app feel with just HTML/CSS pushed my styling skills and taught me 
                    the importance of performance budgets.
                  </p>
                </div>
              </div>
            </motion.section>

            <motion.section 
              className="mb-16 transform-gpu"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl mb-6">
                <CustomHighlight color="#3f764c" opacity={0.4}>results & impact</CustomHighlight>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <p className="text-3xl sm:text-4xl font-bold text-accent mb-2">100%</p>
                  <p className="text-sm">vanilla technologies</p>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <p className="text-3xl sm:text-4xl font-bold text-accent mb-2">10+</p>
                  <p className="text-sm">personality factors analyzed</p>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <p className="text-3xl sm:text-4xl font-bold text-accent mb-2">&lt;2s</p>
                  <p className="text-sm">match generation time</p>
                </div>
              </div>
              
              <p className="text-base sm:text-lg leading-relaxed">
                this project reinforced my belief in understanding fundamentals before reaching for frameworks. 
                building brewmatch from scratch gave me deep insights into web architecture, user experience 
                design, and the importance of performance optimization.
              </p>
            </motion.section>

            <motion.section 
              className="mb-0 transform-gpu"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl mb-6">
                <CustomHighlight color="#3f764c" opacity={0.4}>next steps</CustomHighlight>
              </h2>
              
              <div className="space-y-4 text-base sm:text-lg leading-relaxed">
                <p>future enhancements planned:</p>
                <ul className="list-none space-y-2 ml-4">
                  <li>🗺️ integrate real-time location services and maps</li>
                  <li>👥 add social features for sharing favorite spots</li>
                  <li>🤖 implement machine learning for improved matching</li>
                  <li>📱 develop native mobile apps for iOS and Android</li>
                </ul>
              </div>
            </motion.section>

          </ContentCard>
        </div>

        <div className="px-6 sm:px-10 md:px-16 lg:px-24 xl:px-44 mb-20">
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="transform-gpu"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl mb-6 text-center">
              <CustomHighlight color="#3f764c" opacity={0.4}>key features</CustomHighlight>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "personality quiz",
                  description: "engaging 10-question quiz that builds user's coffee personality profile",
                  image: "/brewmatch/feature1.png"
                },
                {
                  title: "filtering system",
                  description: "search by distance, ambiance, menu, price range, and amenities",
                  image: "/brewmatch/feature2.png"
                },
                {
                  title: "user & cafe profiles",
                  description: "detailed pages with photos, menus, and local event details",
                  image: "/brewmatch/feature3.png"
                },
                {
                  title: "event booking",
                  description: "browse and choose seats for local events",
                  image: "/brewmatch/feature4.png"
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="border-2 border-foreground rounded-lg p-4 bg-background"
                  style={{ 
                    boxShadow: '3px 3px 0 var(--foreground)',
                    backgroundColor: 'rgba(255, 253, 249, 0.95)'
                  }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="relative h-[300px] sm:h-[380px] md:h-[460px] mb-4 bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm opacity-80">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        <motion.section 
          className="px-6 sm:px-10 md:px-16 lg:px-24 xl:px-44 pb-20 transform-gpu"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <ContentCard className="p-8 sm:p-10 md:p-12">
            <div className="text-center">
              <p className="text-lg mb-6 opacity-80">
                watch our demo video below!
                <br/>
                (made by me using adobe after effects)
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href={projectDetails.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-accent text-white rounded-md font-mono hover:scale-105 transition-transform"
                  style={{ 
                    border: '2px solid var(--foreground)',
                    boxShadow: '3px 3px 0 var(--foreground)',
                    cursor: 'none'
                  }}
                >
                  demo video
                </a>
              </div>
            </div>
          </ContentCard>
        </motion.section>

      </main>
    </CursorProvider>
  );
}
