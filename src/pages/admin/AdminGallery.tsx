import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockGallery, type GalleryImage } from "@/data/mockData";
import { toast } from "sonner";

const AdminGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>(mockGallery);
  const [showForm, setShowForm] = useState(false);
  const [caption, setCaption] = useState("");
  const [url, setUrl] = useState("");

  const handleAdd = () => {
    if (!caption || !url) {
      toast.error("Please fill in all fields");
      return;
    }
    const newImg: GalleryImage = {
      id: Date.now().toString(),
      url,
      caption,
      date: new Date().toISOString().split("T")[0],
    };
    setImages([newImg, ...images]);
    setCaption("");
    setUrl("");
    setShowForm(false);
    toast.success("Image added to gallery");
  };

  const handleDelete = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
    toast.success("Image removed");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Gallery Management</h1>
        <Button onClick={() => setShowForm(!showForm)} className="btn-accent">
          <Plus className="h-4 w-4 mr-2" /> Add Image
        </Button>
      </div>

      {showForm && (
        <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label>Image URL *</Label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div className="sm:col-span-2">
              <Label>Caption *</Label>
              <Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Image caption" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleAdd} className="btn-primary">Add Image</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img) => (
          <div key={img.id} className="bg-card rounded-lg overflow-hidden shadow-sm border border-border group relative">
            <img src={img.url} alt={img.caption} className="w-full h-40 object-cover" loading="lazy" width={800} height={600} />
            <div className="p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{img.caption}</p>
                <p className="text-xs text-muted-foreground">{img.date}</p>
              </div>
              <button onClick={() => handleDelete(img.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGallery;
