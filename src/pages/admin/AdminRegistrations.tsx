import { mockRegistrations, mockEvents } from "@/data/mockData";
import { getAgeGroup } from "@/lib/utils";

type RegistrationRow = {
  id: string;
  playerName: string;
  age?: number;
  eventTitle?: string;
  type: string;
  clubSchool?: string;
  totalAmount: number;
  paymentMethod: string;
  paymentVerified: boolean;
  sourceId?: string; // parent registration id for group entries
};

const AdminRegistrations = () => {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Registrations</h1>

      <div className="space-y-6">
        {/* Build rows grouped by age category */}
        {(() => {
          const groupsOrder = ["Under 8", "Under 10", "Under 12", "Under 14", "Under 16", "Under 18", "Other"];
          const grouped: Record<string, RegistrationRow[]> = {};

          for (const reg of mockRegistrations) {
            const event = mockEvents.find((e) => e.id === reg.eventId);
            if (reg.type === "individual") {
              const ageGroup = getAgeGroup(reg.age as number);
              grouped[ageGroup] = grouped[ageGroup] || [];
              grouped[ageGroup].push({
                id: `${reg.id}`,
                playerName: reg.playerName,
                age: reg.age,
                eventTitle: event?.title,
                type: reg.type,
                clubSchool: reg.clubSchool,
                totalAmount: reg.totalAmount,
                paymentMethod: reg.paymentMethod,
                paymentVerified: !!reg.paymentVerified,
                sourceId: reg.id,
              });
            } else if (reg.type === "group" && reg.groupPlayers) {
              for (const gp of reg.groupPlayers) {
                const ageNum = gp.age;
                const ageGroup = getAgeGroup(ageNum as number);
                grouped[ageGroup] = grouped[ageGroup] || [];
                grouped[ageGroup].push({
                  id: `${reg.id}-${gp.name}`,
                  playerName: gp.name,
                  age: gp.age,
                  eventTitle: event?.title,
                  type: reg.type,
                  clubSchool: reg.clubSchool,
                  totalAmount: reg.totalAmount / (reg.numberOfPlayers || 1),
                  paymentMethod: reg.paymentMethod,
                  paymentVerified: !!reg.paymentVerified,
                  sourceId: reg.id,
                });
              }
            }
          }

          return groupsOrder.map((group) => {
            const rows = grouped[group] || [];
            if (rows.length === 0) return null;
            return (
              <div key={group}>
                <h2 className="font-display text-lg font-semibold text-foreground mb-2">{group} ({rows.length})</h2>
                <div className="bg-card rounded-lg shadow-sm border border-border overflow-x-auto">
                  <table className="w-full text-sm min-w-[600px]">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Player</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Age</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Event</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Club/School</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Amount</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Payment</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r.id} className="border-t border-border">
                          <td className="px-4 py-3">
                            <p className="font-medium text-foreground">{r.playerName}</p>
                            {r.type === "group" && (
                              <p className="text-xs text-muted-foreground">Group registration (source: {r.sourceId})</p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{r.age ?? "—"}</td>
                          <td className="px-4 py-3 text-muted-foreground">{r.eventTitle || "—"}</td>
                          <td className="px-4 py-3 text-muted-foreground">{r.clubSchool}</td>
                          <td className="px-4 py-3 font-semibold text-foreground">KSh {r.totalAmount.toLocaleString()}</td>
                          <td className="px-4 py-3 text-muted-foreground uppercase text-xs">{r.paymentMethod.replace("_", " ")}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              r.paymentVerified ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
                            }`}>
                              {r.paymentVerified ? "Verified" : "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
};

export default AdminRegistrations;
