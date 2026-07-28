import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, Trophy, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-chess.jpg";
import gallery2 from "@/assets/gallery-2.jpg";

interface DbEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  image: string;
  description: string;
  entry_fee: number;
  status: string;
}

const heroSlides = [
  {
    title: "Kiambu County",
    subtitle: "Chess Association",
    tagline: "We coordinate and manage chess events in Kiambu County",
  },
  {
    title: "Developing",
    subtitle: "Champions",
    tagline: "Building minds and promoting the royal game across the county",
  },
  {
    title: "Join the",
    subtitle: "Community",
    tagline: "Over 500 active members and growing every day",
  },
];

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState<DbEvent[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    supabase
      .from("events")
      .select("*")
      .gte("date", today)
      .order("date", { ascending: true })
      .limit(3)
      .then(({ data }) => {
        if (data) setUpcomingEvents(data as DbEvent[]);
      });
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <div>
      {/* Hero with slide transitions */}
      <section className="relative h-[80vh] min-h-[480px] flex items-center overflow-hidden">
        <img
          src={heroImage}
          alt="Chess pieces on a board"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1024}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />

        <div className="relative container-main px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <span className="inline-block bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                Chess Kenya · Kiambu Branch
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-2">
                {slide.title}
                <span className="block text-gold">{slide.subtitle}</span>
              </h1>
              <p className="text-primary-foreground/80 text-lg sm:text-xl mb-8 max-w-lg">
                {slide.tagline}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/events">
                  <Button className="btn-gold text-base px-8 py-3">
                    View Events <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button className="bg-card/20 text-primary-foreground border-2 border-primary-foreground/50 hover:bg-card/30 text-base px-8 py-3 font-semibold backdrop-blur-sm">
                    Join Us
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide indicators */}
          <div className="flex gap-2 mt-8">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "w-8 bg-gold" : "w-4 bg-primary-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-secondary">
        <div className="container-main px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: Users, label: "Members", value: "500+" },
              { icon: Trophy, label: "Events This Yr", value: "25+" },
              { icon: Calendar, label: "Branches", value: "12" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <stat.icon className="h-6 w-6 text-secondary-foreground/80" />
                <span className="font-display text-2xl sm:text-3xl font-bold text-secondary-foreground">{stat.value}</span>
                <span className="text-secondary-foreground/70 text-xs sm:text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About section */}
      <section className="section-padding">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-secondary font-bold text-sm uppercase tracking-wider">About</span>
              <h2 className="font-display text-3xl font-bold text-foreground mb-4 mt-1">
                Welcome to KCCA
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Kiambu County Chess Association (KCCA) is dedicated to promoting chess
                as a tool for intellectual development. We organize tournaments, run school
                programs, and nurture talent from grassroots to professional level.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our mission is to ensure every child and adult in Kiambu County has access
                to quality chess training and competitive opportunities.
              </p>
              <Link to="/about">
                <Button className="btn-primary">
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src={gallery2}
                alt="Young chess players"
                className="rounded-xl shadow-xl w-full"
                loading="lazy"
                width={800}
                height={600}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Events preview */}
      {upcomingEvents.length > 0 && (
        <section className="bg-muted section-padding">
          <div className="container-main">
            <div className="text-center mb-10">
              <span className="text-secondary font-bold text-sm uppercase tracking-wider">Upcoming</span>
              <h2 className="font-display text-3xl font-bold text-foreground mt-1">Events</h2>
              <p className="text-muted-foreground mt-2">Check out what's coming up</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((ev) => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  {ev.image && (
                    <img src={ev.image} alt={ev.title} className="w-full h-44 object-cover" loading="lazy" />
                  )}
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold text-foreground mb-2 line-clamp-2">{ev.title}</h3>
                    <div className="space-y-1.5 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-secondary shrink-0" />
                        <span>{new Date(ev.date).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}, {ev.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-secondary shrink-0" />
                        <span>{ev.venue}</span>
                      </div>
                    </div>
                    <Link to="/events" className="text-secondary text-sm font-bold hover:underline">
                      Register →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/events">
                <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-bold">
                  View All Events
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary section-padding">
        <div className="container-main text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">
            Ready to Make Your Move?
          </h2>
          <p className="text-primary-foreground/70 max-w-md mx-auto mb-8">
            Join hundreds of chess enthusiasts in Kiambu County. Whether you're a beginner or a grandmaster, there's a place for you.
          </p>
          <Link to="/contact">
            <Button className="btn-gold text-base px-10 py-3">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
