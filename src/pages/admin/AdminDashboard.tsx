import { CalendarDays, Users, CreditCard, CheckCircle } from "lucide-react";
import { mockEvents, mockRegistrations } from "@/data/mockData";

const stats = [
  {
    icon: CalendarDays,
    label: "Total Events",
    value: mockEvents.length,
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Users,
    label: "Total Registrations",
    value: mockRegistrations.length,
    color: "bg-primary/10 text-primary",
  },
  {
    icon: CreditCard,
    label: "Revenue",
    value: `KSh ${mockRegistrations.reduce((sum, r) => sum + r.totalAmount, 0).toLocaleString()}`,
    color: "bg-accent/10 text-accent",
  },
  {
    icon: CheckCircle,
    label: "Verified Payments",
    value: mockRegistrations.filter((r) => r.paymentVerified).length,
    color: "bg-primary/10 text-primary",
  },
];

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-lg p-5 shadow-sm border border-border">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Registrations */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-5">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Recent Registrations</h2>
          <div className="space-y-3">
            {mockRegistrations.map((reg) => {
              const event = mockEvents.find((e) => e.id === reg.eventId);
              return (
                <div key={reg.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{reg.playerName}</p>
                    <p className="text-xs text-muted-foreground">{event?.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">KSh {reg.totalAmount.toLocaleString()}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        reg.paymentVerified
                          ? "bg-accent/10 text-accent"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {reg.paymentVerified ? "Verified" : "Pending"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-5">
          <h2 className="font-display text-lg font-bold text-foreground mb-4">Upcoming Events</h2>
          <div className="space-y-3">
            {mockEvents
              .filter((e) => e.status === "upcoming")
              .map((event) => (
                <div key={event.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.date} • {event.venue}</p>
                  </div>
                  <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">Active</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
