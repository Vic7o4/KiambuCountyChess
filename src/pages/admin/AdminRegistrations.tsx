import { mockRegistrations, mockEvents } from "@/data/mockData";

const AdminRegistrations = () => {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Registrations</h1>

      <div className="bg-card rounded-lg shadow-sm border border-border overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Player / Group</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Event</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Type</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Club/School</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Amount</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Payment</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockRegistrations.map((reg) => {
              const event = mockEvents.find((e) => e.id === reg.eventId);
              return (
                <tr key={reg.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{reg.playerName}</p>
                    {reg.type === "group" && reg.groupPlayers && (
                      <p className="text-xs text-muted-foreground">{reg.groupPlayers.length} players</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{event?.title || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      reg.type === "individual" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                    }`}>
                      {reg.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{reg.clubSchool}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">KSh {reg.totalAmount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground uppercase text-xs">{reg.paymentMethod.replace("_", " ")}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      reg.paymentVerified ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
                    }`}>
                      {reg.paymentVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRegistrations;
