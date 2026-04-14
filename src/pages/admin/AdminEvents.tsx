import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { Plus, Edit, Trash2, ImagePlus, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

const AdminEvents = () => {
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [status, setStatus] = useState<string>("upcoming");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      e.target.value = "";
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("event-images").upload(path, file);

    if (error) {
      toast.error("Upload failed: " + error.message);
    } else {
      const { data: urlData } = supabase.storage.from("event-images").getPublicUrl(path);
      setImageUrl(urlData.publicUrl);
      toast.success("Image uploaded!");
    }

    setUploading(false);
    // Allow selecting the same file again if needed.
    e.target.value = "";
  };

  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    if (data) setEvents(data as DbEvent[]);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const resetForm = () => {
    setTitle(""); setDate(""); setTime(""); setVenue("");
    setDescription(""); setEntryFee(""); setStatus("upcoming");
    setImageUrl(""); setEditingId(null); setShowForm(false);
  };

  const openEdit = (ev: DbEvent) => {
    setEditingId(ev.id);
    setTitle(ev.title); setDate(ev.date); setTime(ev.time);
    setVenue(ev.venue); setDescription(ev.description || "");
    setEntryFee(ev.entry_fee.toString()); setStatus(ev.status);
    setImageUrl(ev.image || "");
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!title || !date || !time || !venue || !entryFee) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);
    const payload = {
      title, date, time, venue, description,
      entry_fee: parseFloat(entryFee),
      status,
      image: imageUrl,
    };

    if (editingId) {
      const { error } = await supabase.from("events").update(payload).eq("id", editingId);
      if (error) toast.error("Failed to update event");
      else toast.success("Event updated");
    } else {
      const { error } = await supabase.from("events").insert(payload);
      if (error) toast.error("Failed to create event");
      else toast.success("Event created — it's now visible on the public site!");
    }
    setSaving(false);
    resetForm();
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) toast.error("Failed to delete event");
    else { toast.success("Event deleted"); fetchEvents(); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Manage Events</h1>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-secondary text-secondary-foreground hover:opacity-90 font-bold">
          <Plus className="h-4 w-4 mr-2" /> Add Event
        </Button>
      </div>

      {showForm && (
        <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-6">
          <h2 className="font-display text-lg font-bold mb-4">{editingId ? "Edit Event" : "New Event"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label>Title *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" />
            </div>
            <div>
              <Label>Date *</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label>Time *</Label>
              <Input value={time} onChange={(e) => setTime(e.target.value)} placeholder="09:00 AM" />
            </div>
            <div>
              <Label>Venue *</Label>
              <Input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Event venue" />
            </div>
            <div>
              <Label>Entry Fee (KSh) *</Label>
              <Input type="number" value={entryFee} onChange={(e) => setEntryFee(e.target.value)} placeholder="1000" />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label className="flex items-center gap-2">
                <ImagePlus className="h-4 w-4" /> Event Poster / Image
              </Label>
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL or upload a file"
                  className="flex-1"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  <span className="ml-2 hidden sm:inline">{uploading ? "Uploading..." : "Upload Image"}</span>
                </Button>
              </div>
              {imageUrl && (
                <div className="mt-2">
                  <img
                    src={imageUrl}
                    alt="Event preview"
                    className="h-32 w-auto rounded-lg border border-border object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
            </div>
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Event description" rows={3} />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingId ? "Update" : "Create"}
            </Button>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary" />
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Event</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground hidden sm:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground hidden md:table-cell">Venue</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Fee</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      {ev.image && <img src={ev.image} alt="" className="h-8 w-8 rounded object-cover" />}
                      {ev.title}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{ev.date}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{ev.venue}</td>
                  <td className="px-4 py-3 text-foreground">KSh {Number(ev.entry_fee).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      ev.status === "upcoming" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"
                    }`}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => openEdit(ev)} className="p-1.5 text-muted-foreground hover:text-foreground">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(ev.id)} className="p-1.5 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No events yet. Click "Add Event" to create your first event.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
