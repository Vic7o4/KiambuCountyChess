import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import EventCard from "@/components/EventCard";
import RegistrationModal from "@/components/RegistrationModal";
import { supabase } from "@/integrations/supabase/client";
import type { ChessEvent } from "@/data/mockData";

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<ChessEvent | null>(null);
  const [events, setEvents] = useState<ChessEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true })
      .then(({ data }) => {
        if (data) {
          const today = new Date().toISOString().split("T")[0];
          setEvents(
            data.map((e: any) => ({
              id: e.id,
              title: e.title,
              date: e.date,
              time: e.time,
              venue: e.venue,
              image: e.image || "",
              description: e.description || "",
              entryFee: Number(e.entry_fee),
              status: (e.date < today ? "past" : "upcoming") as "upcoming" | "past",
            }))
          );
        }
        setLoading(false);
      });
  }, []);

  const upcoming = events.filter((e) => e.status === "upcoming");
  const past = events.filter((e) => e.status === "past");

  return (
    <div>
      <section className="bg-primary py-12 sm:py-16">
        <div className="container-main text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-gold font-bold text-sm uppercase tracking-wider">Tournaments & Competitions</span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mt-2 mb-3">
              Events
            </h1>
            <p className="text-primary-foreground/70 max-w-md mx-auto">
              Register for upcoming tournaments or browse our past events.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary" />
            </div>
          ) : (
            <>
              {upcoming.length > 0 && (
                <div className="mb-16">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-secondary inline-block" />
                    Upcoming Events
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcoming.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      >
                        <EventCard event={event} onRegister={setSelectedEvent} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {past.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-muted-foreground inline-block" />
                    Past Events
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {past.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      >
                        <EventCard event={event} onRegister={setSelectedEvent} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {events.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  <p className="text-lg">No events yet. Check back soon!</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {selectedEvent && selectedEvent.status === "upcoming" && (
        <RegistrationModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
};

export default Events;
