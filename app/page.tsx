import { prisma } from "@/lib/prisma";
import { getCarImage, getArticleImage, IMAGES } from "@/lib/images";
import { DEFAULT_SETTINGS, SiteSettings } from "@/lib/settings";
import Navbar from "@/components/site/Navbar";
import ScrollToTop from "@/components/site/ScrollToTop";

import Carousel from "@/components/site/Carousel";
import ReviewCarousel from "@/components/site/ReviewCarousel";

export const dynamic = "force-dynamic";

async function getSettings(): Promise<SiteSettings> {
  try {
    const rows: any[] = await prisma.$queryRawUnsafe(
      `SELECT value FROM site_settings WHERE key = 'homepage' LIMIT 1`
    );
    if (rows.length > 0 && rows[0].value) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(rows[0].value) };
    }
  } catch {}
  return DEFAULT_SETTINGS;
} // Revalidate every 10 seconds (much faster than force-dynamic)

function formatPrice(n: number) {
  return n.toLocaleString("id-ID");
}

function CarCard({ car }: { car: any }) {
  const imgSrc = getCarImage(car);
  return (
    <div className="bg-white rounded-2xl border-2 border-dashed border-gold/40 p-4 sm:p-5 hover:border-gold hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="bg-gray-100 rounded-xl overflow-hidden mb-4 h-44 sm:h-48 flex items-center justify-center">
        {imgSrc ? (
          <img src={imgSrc} alt={car.name} loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <i className="ri-car-line text-5xl text-gray-300" />
        )}
      </div>
      <h3 className="font-bold text-xl text-dark mb-2">{car.name}</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-5 min-h-[60px]">{car.description}</p>
      <div className="flex justify-between items-center border-t border-b border-gray-100 py-4 mb-4">
        <div className="flex flex-col items-center flex-1">
          <i className="ri-user-3-line text-gold text-2xl mb-1" />
          <span className="text-xs text-gray-500 font-medium">{car.seats} seat</span>
        </div>
        <div className="w-px h-10 bg-gray-200" />
        <div className="flex flex-col items-center flex-1">
          <i className="ri-gas-station-line text-gold text-2xl mb-1" />
          <span className="text-xs text-gray-500 font-medium">{car.fuelType}</span>
        </div>
        <div className="w-px h-10 bg-gray-200" />
        <div className="flex flex-col items-center flex-1">
          <i className="ri-settings-3-line text-gold text-2xl mb-1" />
          <span className="text-xs text-gray-500 font-medium">{car.transmission}</span>
        </div>
      </div>
      {car.notes && <p className="text-xs text-gray-400 text-center mb-2 italic">{car.notes}</p>}
      <div className="mb-5">
        <span className="text-gold text-xl font-bold italic">Rp. {formatPrice(car.price)}</span>
        <span className="text-sm text-gray-400"> / {car.priceDuration}</span>
      </div>
      <a href={`https://wa.me/6282140560055?text=${encodeURIComponent("Hello ORTIZ, I would like to check availability for " + car.name)}`} target="_blank" className="mt-auto w-full bg-gold text-white font-semibold py-3 rounded-xl hover:bg-yellow-600 transition-colors flex justify-center items-center text-sm tracking-wide">
        Booking <i className="ri-mail-send-line ml-2" />
      </a>
    </div>
  );
}

function CarSection({ title, desc, cars }: { title: string; desc: string; cars: any[] }) {
  return (
    <div>
      <div className="flex justify-between items-end mb-6 sm:mb-8 border-b pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-dark">{title}</h2>
          <p className="text-gray-500 mt-1 sm:mt-2 text-sm">{desc}</p>
        </div>
        <span className="text-sm text-gold font-semibold hidden sm:block">{cars.length} units</span>
      </div>
      {cars.length > 0 ? (
        <Carousel itemCount={cars.length}>
          {cars.map((car) => (
            <div key={car.id} className="min-w-[280px] sm:min-w-[320px] max-w-[340px] snap-start flex-shrink-0">
              <CarCard car={car} />
            </div>
          ))}
        </Carousel>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
          <i className="ri-car-line text-4xl text-gray-300 block mb-2" />
          <p className="text-gray-400 text-sm">Coming soon — new cars will be added shortly</p>
        </div>
      )}
    </div>
  );
}

export default async function HomePage() {
  const s = await getSettings();
  let categories: any[] = [], articles: any[] = [], reviews: any[] = [];
  try {
    // Dynamically fetch ALL active categories with their cars
    categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        cars: {
          where: { isAvailable: true },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { id: "asc" },
    });

    articles = await prisma.article.findMany({
      where: { isPublished: true, publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: "desc" },
      take: 4,
    });

    try {
      reviews = await prisma.$queryRawUnsafe(`SELECT * FROM reviews WHERE is_approved = true ORDER BY created_at DESC LIMIT 10`) as any[];
    } catch {}
  } catch (e) { console.log("DB not ready yet"); }

  const sections = categories.map(cat => ({
    title: `${cat.name} Car Price List`,
    desc: cat.description || `Browse our ${cat.name} car collection`,
    cars: cat.cars,
  }));

  return (
    <>
      {/* Inject dynamic colors from database settings */}
      <style>{`:root { --color-primary: ${s.colors.primary}; --color-dark: ${s.colors.dark}; --color-darker: ${s.colors.darker}; }`}</style>
      <ScrollToTop />
      <Navbar />

      {/* Hero */}
      <section className="hero-bg h-[70vh] min-h-[400px] flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 md:mb-6 tracking-wider">{s.hero.title} <span className="text-gold">{s.hero.titleHighlight}</span></h1>
        <p className="text-gray-200 max-w-2xl text-sm md:text-base mb-6 md:mb-8 leading-relaxed px-2">{s.hero.subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="#cars" className="bg-gold text-dark font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-colors flex items-center justify-center"><i className="ri-calendar-check-line mr-2" /> Book Now</a>
          <a href="#contact" className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-dark transition-colors flex items-center justify-center"><i className="ri-map-pin-fill mr-2" /> Our Location</a>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 relative -mt-12 sm:-mt-16 z-10 hidden md:block">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[{ icon: "ri-team-line", t: "Group Event", d: "Make your group event unforgettable with our group event services." }, { icon: "ri-flight-takeoff-line", t: "Airport Transfer", d: "Escape the hassles of airport travel with our airport transfer service." }, { icon: "ri-camera-lens-line", t: "Photo Session", d: "Capture your cherished moments with our professional photo session service." }].map((f) => (
            <div key={f.t} className="bg-dark/90 backdrop-blur text-white p-6 rounded shadow-lg border-b-2 border-gold"><i className={`${f.icon} text-4xl text-gold mb-4`} /><h3 className="text-lg font-bold mb-2">{f.t}</h3><p className="text-sm text-gray-400">{f.d}</p></div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-dark mb-6">{s.about.title}</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">{s.about.p1}</p>
            <p className="text-gray-600 mb-4 leading-relaxed">{s.about.p2}</p>
            <p className="text-gray-600 mb-6 leading-relaxed">{s.about.p3}</p>
          </div>
          <div><img src={IMAGES.aboutUs} alt="About ORTIZ" loading="lazy" className="w-full rounded-lg shadow-xl" /></div>
        </div>
      </section>

      {/* Cars */}
      <section id="cars" className="py-16 bg-light">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          {sections.map((s) => <CarSection key={s.title} {...s} />)}
        </div>
      </section>

      {/* Safety Banner */}
      <section className="bg-dark text-white flex flex-col md:flex-row items-center">
        <div className="p-8 sm:p-12 md:p-20 md:w-1/2"><h2 className="text-3xl sm:text-4xl font-bold mb-4">{s.safety.title}<br /><span style={{ color: s.colors.primary }}>{s.safety.titleHighlight}</span></h2><p className="text-gray-300 leading-relaxed text-sm">{s.safety.description}</p></div>
        <div className="md:w-1/2 w-full h-64 md:h-[400px]"><img src={IMAGES.safety} alt="Safety" loading="lazy" className="w-full h-full object-cover" /></div>
      </section>

      {/* Value Props */}
      <section className="py-20 bg-dark text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16"><p className="text-gold uppercase tracking-wider text-sm font-bold">Bali Car Rental &rarr; ORTIZ</p><h2 className="text-3xl md:text-4xl font-bold mt-2">We ensure your comfortable journey</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative"><img src={IMAGES.valueProps} alt="Luxury Car" loading="lazy" className="rounded-lg shadow-2xl w-full" /></div>
            <div className="grid grid-cols-2 gap-8">
              {[{ i: "ri-medal-fill", t: "Unparalleled Excellence" }, { i: "ri-compasses-2-fill", t: "Explore the Magic of Bali" }, { i: "ri-money-dollar-circle-fill", t: "Competitive Pricing" }, { i: "ri-group-fill", t: "Friendly Team & Drivers" }, { i: "ri-map-pin-user-fill", t: "Authentic Local Experience" }, { i: "ri-car-fill", t: "Variety of Vehicle Options" }].map((v) => (
                <div key={v.t} className="flex flex-col space-y-2"><i className={`${v.i} text-gold text-2xl bg-gold/10 w-12 h-12 flex items-center justify-center rounded-full`} /><h4 className="font-bold">{v.t}</h4></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-gold font-bold uppercase tracking-wider text-sm">Testimonials</p>
            <h2 className="text-3xl font-bold text-dark mt-2">WHAT OUR CUSTOMERS SAY</h2>
            {reviews.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <i key={i} className={`ri-star-fill text-xl ${i <= Math.round(reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length) ? "text-gold" : "text-gray-300"}`} />
                  ))}
                </div>
                <span className="text-gray-500 text-sm">({reviews.length} reviews)</span>
              </div>
            )}
          </div>
        </div>
        <div className="max-w-[100vw]">
          <ReviewCarousel reviews={reviews} />
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12"><p className="text-gold font-bold uppercase tracking-wider text-sm">Our Blog</p><h2 className="text-3xl font-bold text-dark mt-2">Latest Articles</h2></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {articles.length >= 2 ? (<>
              {articles.slice(0, 2).map((a) => (
                <a key={a.id} href={`/articles/${a.slug}`} className="lg:col-span-1 border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group cursor-pointer">
                  <div className="overflow-hidden h-48">
                    <img src={getArticleImage(a)} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><i className="ri-calendar-line" />{a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : ""}</p>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-gold transition-colors">{a.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2">{a.content.replace(/<[^>]*>/g, "").slice(0, 120)}</p>
                    <span className="text-gold text-sm font-semibold mt-3 inline-flex items-center gap-1">Read more <i className="ri-arrow-right-line" /></span>
                  </div>
                </a>
              ))}
              <div className="lg:col-span-2 flex flex-col space-y-6">
                {articles.slice(2, 4).map((a) => (
                  <a key={a.id} href={`/articles/${a.slug}`} className="border rounded-2xl p-5 shadow-sm flex flex-col justify-center h-full hover:shadow-lg transition-all group cursor-pointer">
                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1"><i className="ri-calendar-line" />{a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : ""}</p>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-gold transition-colors">{a.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2">{a.content.replace(/<[^>]*>/g, "").slice(0, 100)}</p>
                    <span className="text-gold text-sm font-semibold mt-3 inline-flex items-center gap-1">Read more <i className="ri-arrow-right-line" /></span>
                  </a>
                ))}
              </div>
            </>) : articles.length > 0 ? (
              articles.map((a) => (
                <a key={a.id} href={`/articles/${a.slug}`} className="lg:col-span-2 border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group cursor-pointer">
                  <div className="overflow-hidden h-48"><img src={getArticleImage(a)} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                  <div className="p-5"><h3 className="font-bold text-lg mb-2 group-hover:text-gold transition-colors">{a.title}</h3><p className="text-gray-500 text-sm">{a.content.replace(/<[^>]*>/g, "").slice(0, 120)}</p></div>
                </a>
              ))
            ) : (<div className="lg:col-span-4 text-center text-gray-400 py-8">No articles published yet.</div>)}
          </div>
          {articles.length > 0 && (
            <div className="text-center mt-12 pt-8 border-t border-gray-100">
              <p className="text-gray-400 text-sm mb-4">Want to read more travel tips and guides?</p>
              <a href="/articles" className="inline-flex items-center bg-gold text-dark font-bold px-10 py-4 rounded-xl hover:bg-yellow-500 transition-colors text-lg shadow-md hover:shadow-lg">
                More Articles <i className="ri-arrow-right-line ml-2 text-xl" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-dark mb-4">{s.contact.title}</h2>
            <p className="text-gray-500 mb-8">{s.contact.subtitle}</p>
            <div className="space-y-6">
              {[
                { i: "ri-map-pin-line text-gold", t: "Location", d: s.contact.address },
                { i: "ri-whatsapp-line text-green-500", t: "Whatsapp", d: s.brand.phone },
                { i: "ri-instagram-line text-pink-500", t: "Instagram", d: s.brand.instagram },
                { i: "ri-tiktok-fill text-black", t: "Tiktok", d: s.brand.tiktok },
              ].map((c) => (
                <div key={c.t} className="flex items-center space-x-4"><i className={`${c.i} text-2xl`} /><div><h4 className="font-bold text-dark">{c.t}</h4><p className="text-gray-500 text-sm">{c.d}</p></div></div>
              ))}
            </div>
          </div>
          <div className="h-96 lg:h-auto rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942.8647246033784!2d115.1724!3d-8.76!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwNDUnMzYuMCJTIDExNcKwMTAnMjAuNiJF!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-darker text-gray-300 pt-16 pb-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-between items-center border-b border-gray-700 pb-8 mb-8 gap-4">
            {[{ i: "ri-whatsapp-line", d: "082140560055" }, { i: "ri-mail-line", d: "ortiz@gmail.com" }, { i: "ri-map-pin-line", d: "Jalan Taman Sari 100, Kelan" }, { i: "ri-time-line", d: "Sun - Mon: 07:00 - 00:00" }].map((f) => (
              <div key={f.d} className="flex items-center space-x-3 w-full md:w-auto"><div className="bg-dark p-3 rounded-full"><i className={`${f.i} text-gold text-xl`} /></div><span className="text-sm">{f.d}</span></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div><a href="#" className="flex items-center space-x-2 text-xl font-bold text-white mb-4"><i className="ri-steering-2-line text-gold" /><span>DON&apos;T DREAM IT! <span className="text-gold">DRIVE IT!</span></span></a><p className="text-sm text-gray-400 leading-relaxed mb-6">ORTIZ is a Bali Car Rental Service Near the Airport that offers the best car rental solutions.</p></div>
            <div><h4 className="text-white font-bold mb-4">Quick Link</h4><ul className="space-y-2 text-sm text-gray-400"><li><a href="#about" className="hover:text-gold transition">&rarr; About Us</a></li><li><a href="#cars" className="hover:text-gold transition">&rarr; Cars</a></li><li><a href="#blog" className="hover:text-gold transition">&rarr; Blog</a></li></ul></div>
            <div><h4 className="text-white font-bold mb-4">Support</h4><ul className="space-y-2 text-sm text-gray-400"><li><a href="#" className="hover:text-gold transition">&rarr; FAQ</a></li><li><a href="#" className="hover:text-gold transition">&rarr; Terms &amp; Conditions</a></li><li><a href="#contact" className="hover:text-gold transition">&rarr; Contact Us</a></li></ul></div>
            <div><h4 className="text-white font-bold mb-4">Stay Updated</h4><p className="text-sm text-gray-400 mb-4">Don&apos;t miss the latest news from ORTIZ</p></div>
          </div>
        </div>
      </footer>
    </>
  );
}
