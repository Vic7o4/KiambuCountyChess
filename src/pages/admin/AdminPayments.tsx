import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockRegistrations, mockEvents, type Registration } from "@/data/mockData";
import { toast } from "sonner";

const AdminPayments = () => {
  const [registrations, setRegistrations] = useState<Registration[]>(mockRegistrations);

  const toggleVerify = (id: string) => {
    setRegistrations(registrations.map((r) =>
      r.id === id ? { ...r, paymentVerified: !r.paymentVerified } : r
    ));
    const reg = registrations.find((r) => r.id === id);
    if (reg) {
      toast.success(reg.paymentVerified ? "Payment unmarked" : "Payment verified!");
    }
  };

  const totalRevenue = registrations.reduce((sum, r) => sum + r.totalAmount, 0);
  const verifiedRevenue = registrations.filter((r) => r.paymentVerified).reduce((sum, r) => sum + r.totalAmount, 0);
  const pendingRevenue = totalRevenue - verifiedRevenue;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Payment Management</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold text-foreground">KSh {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
          <p className="text-sm text-muted-foreground">Verified</p>
          <p className="text-2xl font-bold text-accent">KSh {verifiedRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-destructive">KSh {pendingRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Player</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Event</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Players</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Method</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Code</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Amount</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => {
              const event = mockEvents.find((e) => e.id === reg.eventId);
              const numPlayers = reg.type === "group" ? (reg.numberOfPlayers || 1) : 1;
              const feePerPlayer = event?.entryFee || 0;
              return (
                <tr key={reg.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground">{reg.playerName}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{event?.title}</td>
                  <td className="px-4 py-3 text-foreground">
                    {numPlayers} × KSh {feePerPlayer.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground uppercase text-xs">{reg.paymentMethod.replace("_", " ")}</td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{reg.paymentCode || "—"}</td>
                  <td className="px-4 py-3 font-bold text-foreground">KSh {reg.totalAmount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      reg.paymentVerified ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
                    }`}>
                      {reg.paymentVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleVerify(reg.id)}
                      className="text-xs"
                    >
                      {reg.paymentVerified ? (
                        <><XCircle className="h-3 w-3 mr-1" /> Unverify</>
                      ) : (
                        <><CheckCircle className="h-3 w-3 mr-1" /> Verify</>
                      )}
                    </Button>
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

export default AdminPayments;
