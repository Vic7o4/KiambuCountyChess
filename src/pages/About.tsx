import { motion } from "framer-motion";
import { Target, Eye, Heart, Award } from "lucide-react";
import gallery2 from "@/assets/gallery-2.jpg";

const values = [
  { icon: Target, title: "Excellence", description: "We strive for the highest standards in chess education and competition." },
  { icon: Eye, title: "Inclusivity", description: "Chess is for everyone — regardless of age, gender, or background." },
  { icon: Heart, title: "Community", description: "Building strong bonds through the shared love of the royal game." },
  { icon: Award, title: "Development", description: "Nurturing talent from grassroots to international competitiveness." },
];

const About = () => {
  return (
    <div>
      <section className="bg-primary py-12 sm:py-16">
        <div className="container-main text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-gold font-bold text-sm uppercase tracking-wider">Who We Are</span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mt-2 mb-3">
              About Us
            </h1>
            <p className="text-primary-foreground/70 max-w-lg mx-auto">
              The sole authority responsible for advancing chess in Kiambu County.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-secondary font-bold text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4 mt-1">Chess Kenya · Kiambu Branch</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Founded in 2015, the Kiambu County Chess Association (KCCA) was established by a group of
                passionate chess players who wanted to create a vibrant chess community in Kiambu County.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Over the years, we have grown from a small club to a county-wide organization with over 500 active
                members, partnerships with schools across the county, and a track record of producing nationally
                ranked players.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We organize regular tournaments, run chess training programs in schools, and provide a platform for
                players of all levels to compete, learn, and grow together.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img src={gallery2} alt="Chess players" className="rounded-xl shadow-xl w-full" loading="lazy" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-muted section-padding">
        <div className="container-main">
          <div className="text-center mb-10">
            <span className="text-secondary font-bold text-sm uppercase tracking-wider">What Drives Us</span>
            <h2 className="font-display text-2xl font-bold text-foreground mt-1">Our Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-lg p-6 text-center shadow-sm border border-border"
              >
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                  <v.icon className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
