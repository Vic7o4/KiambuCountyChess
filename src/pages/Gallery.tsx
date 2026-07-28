import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { mockGallery } from "@/data/mockData";

const Gallery = () => {
  return (
    <div>
      <section className="bg-primary py-12 sm:py-16">
        <div className="container-main text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-gold font-bold text-sm uppercase tracking-wider">Memories</span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mt-2 mb-3">
              Gallery
            </h1>
            <p className="text-primary-foreground/70">Moments captured from our events and programs.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <p className="text-sm text-muted-foreground">
              For the latest full photo collection, follow our official Instagram page.
            </p>
            <a
              href="https://www.instagram.com/kiambucountychessassociation/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                View Full Instagram Gallery
              </Button>
            </a>
          </div>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {mockGallery.map((img, index) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="break-inside-avoid"
              >
                <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width={800}
                    height={600}
                  />
                  <div className="p-3">
                    <p className="text-sm font-medium text-foreground">{img.caption}</p>
                    <p className="text-xs text-muted-foreground">{new Date(img.date).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
