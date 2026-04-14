import eventPlaceholder from "@/assets/event-placeholder.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";

export interface ChessEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  image: string;
  description: string;
  entryFee: number;
  status: "upcoming" | "past";
}

export interface Registration {
  id: string;
  eventId: string;
  type: "individual" | "group";
  playerName: string;
  age: number;
  clubSchool: string;
  email: string;
  paymentMethod: "mpesa" | "cash" | "paypal" | "bank_transfer";
  paymentCode?: string;
  paymentVerified: boolean;
  groupPlayers?: { name: string; age: number }[];
  numberOfPlayers?: number;
  totalAmount: number;
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  date: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
}

export const mockEvents: ChessEvent[] = [
  {
    id: "1",
    title: "Kiambu Open Chess Championship 2026",
    date: "2026-05-15",
    time: "09:00 AM",
    venue: "Kiambu County Hall, Kiambu Town",
    image: eventPlaceholder,
    description: "The biggest chess tournament in Kiambu County. Open to all rated and unrated players.",
    entryFee: 1000,
    status: "upcoming",
  },
  {
    id: "2",
    title: "Inter-School Chess Tournament",
    date: "2026-06-20",
    time: "08:00 AM",
    venue: "Alliance High School, Kikuyu",
    image: eventPlaceholder,
    description: "Annual inter-school chess competition for primary and secondary schools in Kiambu County.",
    entryFee: 500,
    status: "upcoming",
  },
  {
    id: "3",
    title: "Rapid Chess Blitz Night",
    date: "2026-04-10",
    time: "06:00 PM",
    venue: "Thika Sports Club",
    image: eventPlaceholder,
    description: "An exciting evening of rapid and blitz chess games. Come test your speed!",
    entryFee: 300,
    status: "upcoming",
  },
  {
    id: "4",
    title: "Kiambu County Junior Championship 2025",
    date: "2025-11-10",
    time: "09:00 AM",
    venue: "Ruiru Community Hall",
    image: eventPlaceholder,
    description: "Junior championship for players under 18. A great platform for young talents.",
    entryFee: 500,
    status: "past",
  },
  {
    id: "5",
    title: "Christmas Charity Chess Tournament",
    date: "2025-12-20",
    time: "10:00 AM",
    venue: "Kiambu Golf Club",
    image: eventPlaceholder,
    description: "A charity tournament to support chess programs in underprivileged schools.",
    entryFee: 1000,
    status: "past",
  },
];

export const mockGallery: GalleryImage[] = [
  { id: "1", url: gallery1, caption: "Chess pieces ready for battle", date: "2025-10-15" },
  { id: "2", url: gallery2, caption: "Young champions in training", date: "2025-09-20" },
  { id: "3", url: eventPlaceholder, caption: "Kiambu Open 2025 in progress", date: "2025-08-10" },
  { id: "4", url: gallery1, caption: "Tournament finals", date: "2025-07-22" },
  { id: "5", url: gallery2, caption: "School chess program launch", date: "2025-06-15" },
  { id: "6", url: eventPlaceholder, caption: "Community chess day", date: "2025-05-30" },
];

export const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Kiambu County Produces Two National Champions",
    excerpt: "Two young players from Kiambu County have won gold at the Kenya National Chess Championship.",
    content: "In a remarkable achievement, two young chess prodigies from Kiambu County clinched gold medals...",
    date: "2026-02-15",
    image: gallery2,
  },
  {
    id: "2",
    title: "Chess Program Launched in 50 Schools",
    excerpt: "The association has successfully launched chess programs in 50 primary schools across the county.",
    content: "As part of our mission to make chess accessible to every child in Kiambu County...",
    date: "2026-01-20",
    image: eventPlaceholder,
  },
  {
    id: "3",
    title: "Partnership with Kenya Chess Federation",
    excerpt: "KCCA signs MOU with Kenya Chess Federation for talent development.",
    content: "The Kiambu County Chess Association has signed a memorandum of understanding...",
    date: "2025-12-05",
    image: gallery1,
  },
];

export const mockRegistrations: Registration[] = [
  {
    id: "r1",
    eventId: "1",
    type: "individual",
    playerName: "John Kamau",
    age: 25,
    clubSchool: "Kiambu Chess Club",
    email: "john@example.com",
    paymentMethod: "mpesa",
    paymentCode: "SJK2L4M5N6",
    paymentVerified: true,
    totalAmount: 1000,
    createdAt: "2026-03-01",
  },
  {
    id: "r2",
    eventId: "1",
    type: "group",
    playerName: "Alliance High School",
    age: 0,
    clubSchool: "Alliance High School",
    email: "chess@alliance.ac.ke",
    paymentMethod: "bank_transfer",
    paymentCode: "BT-2026-001",
    paymentVerified: false,
    numberOfPlayers: 4,
    groupPlayers: [
      { name: "Peter Njoroge", age: 16 },
      { name: "Grace Wanjiku", age: 17 },
      { name: "David Mwangi", age: 15 },
      { name: "Faith Njeri", age: 16 },
    ],
    totalAmount: 4000,
    createdAt: "2026-03-05",
  },
];
