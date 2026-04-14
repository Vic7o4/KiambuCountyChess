import { useState } from "react";
import { X, Plus, Trash2, CheckCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ChessEvent } from "@/data/mockData";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface RegistrationModalProps {
  event: ChessEvent;
  onClose: () => void;
}

type PlayerType = "individual" | "group";
type PaymentMethod = "mpesa" | "cash" | "paypal" | "bank_transfer";

interface GroupPlayer {
  name: string;
  age: string;
}

const RegistrationModal = ({ event, onClose }: RegistrationModalProps) => {
  const [step, setStep] = useState(1);
  const [playerType, setPlayerType] = useState<PlayerType>("individual");
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [clubSchool, setClubSchool] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [paymentCode, setPaymentCode] = useState("");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [mpesaPromptSent, setMpesaPromptSent] = useState(false);

  const [numberOfPlayers, setNumberOfPlayers] = useState("");
  const [groupPlayers, setGroupPlayers] = useState<GroupPlayer[]>([{ name: "", age: "" }]);
  const [groupClubSchool, setGroupClubSchool] = useState("");
  const [groupEmail, setGroupEmail] = useState("");

  const totalAmount = playerType === "individual"
    ? event.entryFee
    : event.entryFee * (parseInt(numberOfPlayers) || 0);

  const addGroupPlayer = () => {
    setGroupPlayers([...groupPlayers, { name: "", age: "" }]);
  };

  const removeGroupPlayer = (index: number) => {
    if (groupPlayers.length > 1) {
      setGroupPlayers(groupPlayers.filter((_, i) => i !== index));
    }
  };

  const updateGroupPlayer = (index: number, field: keyof GroupPlayer, value: string) => {
    const updated = [...groupPlayers];
    updated[index][field] = value;
    setGroupPlayers(updated);
  };

  const [mpesaLoading, setMpesaLoading] = useState(false);

  const handleMpesaPrompt = async () => {
    if (!mpesaPhone || mpesaPhone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setMpesaLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('mpesa-stk-push', {
        body: {
          phone: mpesaPhone,
          amount: totalAmount,
          accountReference: `KCCA-${event.title.substring(0, 10)}`,
        },
      });

      if (error) throw error;

      if (data?.success) {
        setMpesaPromptSent(true);
        toast.success(data.message || `STK Push sent to ${mpesaPhone}. Enter your M-PESA PIN on your phone.`);
      } else {
        toast.error(data?.error || "Failed to send M-PESA prompt. Try the manual option.");
      }
    } catch (err: any) {
      console.error("M-Pesa STK error:", err);
      toast.error("Failed to send M-PESA prompt. Please try the manual payment option.");
    } finally {
      setMpesaLoading(false);
    }
  };

  const handleSubmit = () => {
    if (playerType === "individual") {
      if (!name || !age || !clubSchool || !email) {
        toast.error("Please fill in all required fields");
        return;
      }
      if (paymentMethod === "mpesa" && !paymentCode) {
        toast.error("Please enter your MPESA transaction code");
        return;
      }
      if (paymentMethod === "paypal" && !paymentCode) {
        toast.error("Please enter your PayPal transaction ID");
        return;
      }
      if (paymentMethod === "bank_transfer" && !paymentCode) {
        toast.error("Please enter your bank transfer reference");
        return;
      }
    } else {
      if (step === 1) return;
      if (!groupClubSchool || !groupEmail || !numberOfPlayers) {
        toast.error("Please fill in all required fields");
        return;
      }
      const emptyPlayers = groupPlayers.some(p => !p.name || !p.age);
      if (emptyPlayers) {
        toast.error("Please fill in all player details");
        return;
      }
      if (paymentMethod === "mpesa" && !paymentCode) {
        toast.error("Please enter your MPESA transaction code");
        return;
      }
    }

    setSubmitted(true);
    toast.success("Registration submitted successfully! A confirmation email will be sent shortly.");
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
        <div className="bg-card rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
          <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Registration Successful!</h2>
          <p className="text-muted-foreground mb-2">
            Thank you for registering for <span className="font-semibold">{event.title}</span>.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            A confirmation email will be sent to your email address. Your payment will be verified by our team.
          </p>
          <p className="text-foreground font-semibold mb-6">
            Total: KSh {totalAmount.toLocaleString()}
          </p>
          <Button onClick={onClose} className="btn-primary w-full">Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4">
      <div className="bg-card rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-primary text-primary-foreground px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold">Event Registration</h2>
            <p className="text-primary-foreground/70 text-sm">{event.title}</p>
          </div>
          <button onClick={onClose} className="text-primary-foreground/70 hover:text-primary-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <Label className="font-semibold text-foreground mb-3 block">Registration Type</Label>
            <RadioGroup
              value={playerType}
              onValueChange={(v) => {
                setPlayerType(v as PlayerType);
                setStep(1);
              }}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="individual" id="individual" />
                <Label htmlFor="individual" className="cursor-pointer">Individual Player</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="group" id="group" />
                <Label htmlFor="group" className="cursor-pointer">Group Players</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Individual Form */}
          {playerType === "individual" && (
            <>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" />
                  </div>
                  <div>
                    <Label htmlFor="club">Club / School *</Label>
                    <Input id="club" value={clubSchool} onChange={(e) => setClubSchool(e.target.value)} placeholder="Club or School" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
                </div>
              </div>

              <PaymentSection
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                paymentCode={paymentCode}
                setPaymentCode={setPaymentCode}
                amount={event.entryFee}
                mpesaPhone={mpesaPhone}
                setMpesaPhone={setMpesaPhone}
                mpesaPromptSent={mpesaPromptSent}
                onSendMpesaPrompt={handleMpesaPrompt}
                mpesaLoading={mpesaLoading}
              />

              <div className="bg-muted rounded-lg p-3 text-sm">
                <span className="text-muted-foreground">Total Amount: </span>
                <span className="font-bold text-foreground">KSh {event.entryFee.toLocaleString()}</span>
              </div>

              <Button onClick={handleSubmit} className="btn-accent w-full">
                Submit Registration
              </Button>
            </>
          )}

          {/* Group Form Step 1 */}
          {playerType === "group" && step === 1 && (
            <>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="gClub">Club / School Name *</Label>
                  <Input id="gClub" value={groupClubSchool} onChange={(e) => setGroupClubSchool(e.target.value)} placeholder="Enter club or school name" />
                </div>
                <div>
                  <Label htmlFor="gEmail">Contact Email *</Label>
                  <Input id="gEmail" type="email" value={groupEmail} onChange={(e) => setGroupEmail(e.target.value)} placeholder="contact@school.ac.ke" />
                </div>
                <div>
                  <Label htmlFor="numPlayers">Number of Players *</Label>
                  <Input
                    id="numPlayers"
                    type="number"
                    min="2"
                    value={numberOfPlayers}
                    onChange={(e) => {
                      setNumberOfPlayers(e.target.value);
                      const num = parseInt(e.target.value) || 0;
                      if (num > groupPlayers.length) {
                        const extra = Array.from({ length: num - groupPlayers.length }, () => ({ name: "", age: "" }));
                        setGroupPlayers([...groupPlayers, ...extra]);
                      } else if (num > 0 && num < groupPlayers.length) {
                        setGroupPlayers(groupPlayers.slice(0, num));
                      }
                    }}
                    placeholder="Number of players"
                  />
                </div>
              </div>
              <Button
                onClick={() => {
                  if (!groupClubSchool || !groupEmail || !numberOfPlayers) {
                    toast.error("Please fill in all fields");
                    return;
                  }
                  setStep(2);
                }}
                className="btn-accent w-full"
              >
                Next →
              </Button>
            </>
          )}

          {/* Group Form Step 2 */}
          {playerType === "group" && step === 2 && (
            <>
              <div>
                <Label className="font-semibold mb-3 block">Player Details ({groupPlayers.length} players)</Label>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {groupPlayers.map((player, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Label className="text-xs">Player {index + 1} Name</Label>
                        <Input
                          value={player.name}
                          onChange={(e) => updateGroupPlayer(index, "name", e.target.value)}
                          placeholder="Full name"
                        />
                      </div>
                      <div className="w-20">
                        <Label className="text-xs">Age</Label>
                        <Input
                          type="number"
                          value={player.age}
                          onChange={(e) => updateGroupPlayer(index, "age", e.target.value)}
                          placeholder="Age"
                        />
                      </div>
                      {groupPlayers.length > 1 && (
                        <button onClick={() => removeGroupPlayer(index)} className="text-destructive mb-1">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-2" onClick={addGroupPlayer}>
                  <Plus className="h-4 w-4 mr-1" /> Add Player
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">← Back</Button>
                <Button onClick={() => setStep(3)} className="btn-accent flex-1">Next →</Button>
              </div>
            </>
          )}

          {/* Group Form Step 3 */}
          {playerType === "group" && step === 3 && (
            <>
              <PaymentSection
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                paymentCode={paymentCode}
                setPaymentCode={setPaymentCode}
                amount={totalAmount}
                mpesaPhone={mpesaPhone}
                setMpesaPhone={setMpesaPhone}
                mpesaPromptSent={mpesaPromptSent}
                onSendMpesaPrompt={handleMpesaPrompt}
                mpesaLoading={mpesaLoading}
              />

              <div className="bg-muted rounded-lg p-3 text-sm space-y-1">
                <div><span className="text-muted-foreground">Players: </span><span className="font-semibold text-foreground">{numberOfPlayers}</span></div>
                <div><span className="text-muted-foreground">Fee per player: </span><span className="font-semibold text-foreground">KSh {event.entryFee.toLocaleString()}</span></div>
                <div><span className="text-muted-foreground">Total Amount: </span><span className="font-bold text-foreground text-lg">KSh {totalAmount.toLocaleString()}</span></div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">← Back</Button>
                <Button onClick={handleSubmit} className="btn-accent flex-1">Submit Registration</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function PaymentSection({
  paymentMethod,
  setPaymentMethod,
  paymentCode,
  setPaymentCode,
  amount,
  mpesaPhone,
  setMpesaPhone,
  mpesaPromptSent,
  onSendMpesaPrompt,
  mpesaLoading = false,
}: {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (m: PaymentMethod) => void;
  paymentCode: string;
  setPaymentCode: (c: string) => void;
  amount: number;
  mpesaPhone: string;
  setMpesaPhone: (p: string) => void;
  mpesaPromptSent: boolean;
  onSendMpesaPrompt: () => void;
  mpesaLoading?: boolean;
}) {
  return (
    <div className="space-y-3">
      <Label className="font-semibold">Payment Method</Label>
      <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="mpesa">MPESA</SelectItem>
          <SelectItem value="cash">Cash</SelectItem>
          <SelectItem value="paypal">PayPal</SelectItem>
          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
        </SelectContent>
      </Select>

      {paymentMethod === "mpesa" && (
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-accent">
            <Smartphone className="h-5 w-5" />
            <p className="text-sm font-semibold">M-PESA Payment</p>
          </div>

          {/* STK Push Section */}
          <div className="bg-card border border-border rounded-lg p-3 space-y-2">
            <p className="text-xs font-medium text-foreground">Option 1: Receive payment prompt on your phone</p>
            <div className="flex gap-2">
              <Input
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                placeholder="e.g., 0712345678 or 0112345678"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={onSendMpesaPrompt}
                disabled={mpesaPromptSent || mpesaLoading}
                className="btn-accent text-xs px-3 py-1 h-auto"
                size="sm"
              >
                {mpesaLoading ? "Sending..." : mpesaPromptSent ? "Prompt Sent ✓" : "Send Prompt"}
              </Button>
            </div>
            {mpesaPromptSent && (
              <p className="text-xs text-accent font-medium animate-pulse">
                ⏳ Check your phone for the M-PESA PIN prompt...
              </p>
            )}
          </div>

          {/* Manual Instructions */}
          <div className="border-t border-accent/20 pt-3">
            <p className="text-xs font-medium text-foreground mb-1">Option 2: Pay manually</p>
            <ol className="text-xs text-muted-foreground space-y-0.5 list-decimal ml-4">
              <li>Go to M-PESA → "Lipa na M-PESA" → "Pay Bill"</li>
              <li>Business Number: <span className="font-bold text-foreground">4167473</span></li>
              <li>Account Number: <span className="font-bold text-foreground">KCCA</span></li>
              <li>Amount: <span className="font-bold text-foreground">KSh {amount.toLocaleString()}</span></li>
            </ol>
          </div>

          <div className="pt-1">
            <Label htmlFor="mpesaCode" className="text-sm">M-PESA Transaction Code *</Label>
            <Input
              id="mpesaCode"
              value={paymentCode}
              onChange={(e) => setPaymentCode(e.target.value.toUpperCase())}
              placeholder="e.g., SJK2L4M5N6"
              className="mt-1"
            />
          </div>
        </div>
      )}

      {paymentMethod === "paypal" && (
        <div>
          <Label htmlFor="paypalTx">PayPal Transaction ID *</Label>
          <Input
            id="paypalTx"
            value={paymentCode}
            onChange={(e) => setPaymentCode(e.target.value)}
            placeholder="Enter your PayPal transaction ID"
          />
        </div>
      )}

      {paymentMethod === "bank_transfer" && (
        <div className="space-y-2">
          <div className="bg-muted rounded-lg p-3 text-sm">
            <p className="font-medium text-foreground mb-1">Bank Details:</p>
            <p className="text-muted-foreground">Bank: Equity Bank</p>
            <p className="text-muted-foreground">Account: 0123456789</p>
            <p className="text-muted-foreground">Name: Kiambu County Chess Association</p>
          </div>
          <div>
            <Label htmlFor="bankRef">Bank Transfer Reference *</Label>
            <Input
              id="bankRef"
              value={paymentCode}
              onChange={(e) => setPaymentCode(e.target.value)}
              placeholder="Enter your bank transfer reference"
            />
          </div>
        </div>
      )}

      {paymentMethod === "cash" && (
        <div className="bg-muted rounded-lg p-3">
          <p className="text-sm text-muted-foreground">
            Cash payments will be verified physically at the event venue. Please arrive early to complete your payment.
          </p>
        </div>
      )}
    </div>
  );
}

export default RegistrationModal;
