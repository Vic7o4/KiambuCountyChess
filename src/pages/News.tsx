import { motion } from "framer-motion";
import { mockNews } from "@/data/mockData";

const News = () => {
  return (
    <div>
      <section className="bg-primary py-12 sm:py-16">
        <div className="container-main text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-gold font-bold text-sm uppercase tracking-wider">Latest Updates</span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mt-2 mb-3">
              News
            </h1>
            <p className="text-primary-foreground/70">Stay informed about the chess community.</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockNews.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-border"
              >
                <img src={item.image} alt={item.title} className="w-full h-48 object-cover" loading="lazy" width={800} height={600} />
                <div className="p-5">
                  <p className="text-xs text-secondary font-bold mb-2 uppercase tracking-wider">
                    {new Date(item.date).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                  <h2 className="font-display text-lg font-bold text-foreground mb-2 line-clamp-2">{item.title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-3">{item.excerpt}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default News;
