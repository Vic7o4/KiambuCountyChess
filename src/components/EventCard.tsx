import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChessEvent } from "@/data/mockData";

interface EventCardProps {
  event: ChessEvent;
  onRegister: (event: ChessEvent) => void;
}

const EventCard = ({ event, onRegister }: EventCardProps) => {
  const isPast = event.status === "past";
  const formattedDate = new Date(event.date).toLocaleDateString("en-KE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-border">
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
          loading="lazy"
          width={800}
          height={600}
        />
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            isPast
              ? "bg-muted text-muted-foreground"
              : "bg-accent text-accent-foreground"
          }`}
        >
          {isPast ? "Completed" : "Upcoming"}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg font-bold text-foreground mb-3 line-clamp-2">
          {event.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-accent shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-accent shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-accent shrink-0" />
            <span>{event.venue}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">
            KSh {event.entryFee.toLocaleString()} / player
          </span>
          <Button
            onClick={() => onRegister(event)}
            disabled={isPast}
            className={isPast ? "bg-muted text-muted-foreground cursor-not-allowed" : "btn-accent"}
            size="sm"
          >
            {isPast ? "Event Ended" : "Register Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
