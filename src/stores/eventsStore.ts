import { create } from "zustand";
import { mockEvents, type ChessEvent } from "@/data/mockData";

interface EventsStore {
  events: ChessEvent[];
  addEvent: (event: ChessEvent) => void;
  updateEvent: (id: string, event: Partial<ChessEvent>) => void;
  deleteEvent: (id: string) => void;
}

export const useEventsStore = create<EventsStore>((set) => ({
  events: mockEvents,
  addEvent: (event) => set((state) => ({ events: [event, ...state.events] })),
  updateEvent: (id, updated) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? { ...e, ...updated } : e)),
    })),
  deleteEvent: (id) =>
    set((state) => ({ events: state.events.filter((e) => e.id !== id) })),
}));
