import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ── Admin User ──
  await prisma.user.upsert({
    where: { email: "admin@ortiz.com" },
    update: {},
    create: {
      name: "Admin ORTIZ",
      email: "admin@ortiz.com",
      password: hashSync("password", 10),
    },
  });

  // ── Categories ──
  const categories = [
    { name: "Luxury", slug: "luxury", description: "Luxury car collection for premium experience" },
    { name: "Premium", slug: "premium", description: "Premium cars for a high-end driving experience" },
    { name: "City", slug: "city", description: "Compact city cars for easy urban exploration" },
    { name: "Family", slug: "family", description: "Spacious family cars for comfortable group travel" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const luxury = await prisma.category.findUnique({ where: { slug: "luxury" } });
  const premium = await prisma.category.findUnique({ where: { slug: "premium" } });
  const city = await prisma.category.findUnique({ where: { slug: "city" } });
  const family = await prisma.category.findUnique({ where: { slug: "family" } });

  // ── Cars ──
  const cars = [
    { categoryId: luxury!.id, name: "Mercedes-Benz S-Class", slug: "mercedes-benz-s-class", description: "The pinnacle of luxury sedans. Experience supreme comfort and cutting-edge technology.", seats: 4, fuelType: "Gasoline", transmission: "Automatic", price: 5500000, priceDuration: "day", notes: "Include Driver", sortOrder: 1 },
    { categoryId: luxury!.id, name: "BMW 7 Series", slug: "bmw-7-series", description: "Dynamic luxury sedan with powerful performance and elegant interior design.", seats: 4, fuelType: "Gasoline", transmission: "Automatic", price: 5000000, priceDuration: "day", notes: "Include Driver", sortOrder: 2 },
    { categoryId: luxury!.id, name: "Lexus LS 500", slug: "lexus-ls-500", description: "Japanese luxury at its finest. Whisper-quiet cabin with world-class craftsmanship.", seats: 4, fuelType: "Hybrid", transmission: "Automatic", price: 4800000, priceDuration: "day", notes: "Include Driver", sortOrder: 3 },
    { categoryId: premium!.id, name: "Toyota Alphard", slug: "toyota-alphard", description: "Premium MPV with captain seats, perfect for VIP transfers and luxury tours.", seats: 7, fuelType: "Gasoline", transmission: "Automatic", price: 2500000, priceDuration: "day", notes: "Include Driver", sortOrder: 1 },
    { categoryId: premium!.id, name: "Toyota Vellfire", slug: "toyota-vellfire", description: "The ultimate premium MPV with aggressive styling and first-class cabin comfort.", seats: 7, fuelType: "Gasoline", transmission: "Automatic", price: 2700000, priceDuration: "day", notes: "Include Driver", sortOrder: 2 },
    { categoryId: premium!.id, name: "Toyota Land Cruiser", slug: "toyota-land-cruiser", description: "Legendary SUV built for both luxury and adventure. Conquer any terrain in style.", seats: 7, fuelType: "Diesel", transmission: "Automatic", price: 3500000, priceDuration: "day", notes: "Include Driver", sortOrder: 3 },
    { categoryId: city!.id, name: "Toyota Agya", slug: "toyota-agya", description: "Compact and fuel-efficient city car for easy Bali exploration.", seats: 5, fuelType: "Gasoline", transmission: "Automatic", price: 250000, priceDuration: "day", notes: null, sortOrder: 1 },
    { categoryId: city!.id, name: "Honda Brio", slug: "honda-brio", description: "Fun-to-drive city hatchback with great fuel economy and nimble handling.", seats: 5, fuelType: "Gasoline", transmission: "Automatic", price: 275000, priceDuration: "day", notes: null, sortOrder: 2 },
    { categoryId: city!.id, name: "Suzuki Ignis", slug: "suzuki-ignis", description: "Stylish mini crossover perfect for navigating narrow Bali streets.", seats: 5, fuelType: "Gasoline", transmission: "Automatic", price: 300000, priceDuration: "day", notes: null, sortOrder: 3 },
    { categoryId: family!.id, name: "Toyota Avanza", slug: "toyota-avanza", description: "Indonesia's favorite family MPV. Spacious, reliable, and affordable.", seats: 7, fuelType: "Gasoline", transmission: "Automatic", price: 350000, priceDuration: "day", notes: null, sortOrder: 1 },
    { categoryId: family!.id, name: "Toyota Innova Reborn", slug: "toyota-innova-reborn", description: "Premium family MPV with diesel engine, comfortable cabin, and proven durability.", seats: 7, fuelType: "Diesel", transmission: "Automatic", price: 500000, priceDuration: "day", notes: null, sortOrder: 2 },
    { categoryId: family!.id, name: "Mitsubishi Xpander", slug: "mitsubishi-xpander", description: "Modern crossover MPV with stylish design and spacious three-row seating.", seats: 7, fuelType: "Gasoline", transmission: "Automatic", price: 400000, priceDuration: "day", notes: null, sortOrder: 3 },
  ];

  for (const car of cars) {
    await prisma.car.upsert({
      where: { slug: car.slug },
      update: {},
      create: car,
    });
  }

  // ── Articles ──
  const articles = [
    { title: "Top 10 Must-Visit Destinations in Bali with a Rental Car", slug: "top-10-must-visit-destinations-bali", content: "<p>Bali, the Island of the Gods, is a treasure trove of breathtaking destinations. Having your own rental car gives you the freedom to explore at your own pace. From the iconic Uluwatu Temple perched on a cliff to the tranquil rice terraces of Tegallalang in Ubud, each destination offers a unique experience.</p><p>Start your day early at Tanah Lot to witness the sunrise over the sea temple, then drive north to the stunning Handara Gate. End your evening at Jimbaran Bay with fresh seafood on the beach. With ORTIZ car rental, every Bali adventure becomes effortless and unforgettable.</p>", isPublished: true, publishedAt: new Date(Date.now() - 2 * 86400000), metaDescription: "Discover the top 10 must-visit destinations in Bali that are best explored with a rental car from ORTIZ." },
    { title: "Why Renting a Car in Bali is Better Than Using Ride-Hailing Apps", slug: "renting-car-bali-vs-ride-hailing", content: "<p>While ride-hailing apps are convenient in big cities, Bali presents a different scenario. Many popular tourist spots are located in remote areas where online rides are scarce and expensive. Renting a car gives you complete control over your itinerary, schedule, and comfort.</p><p>With ORTIZ, you get a well-maintained vehicle, optional driver service, and the freedom to explore hidden gems without worrying about surge pricing or availability.</p>", isPublished: true, publishedAt: new Date(Date.now() - 5 * 86400000), metaDescription: "Learn why renting a car from ORTIZ is a smarter choice for your Bali holiday." },
    { title: "Essential Tips for Driving in Bali: A Complete Guide for Tourists", slug: "essential-tips-driving-bali-tourists", content: "<p>Driving in Bali can be an adventure in itself. The roads range from wide highways to narrow village paths, and traffic customs may differ from what you are accustomed to.</p><p>Always drive on the left side, be mindful of motorbikes, and carry your international driving permit. Most importantly, stay patient and enjoy the scenic views. ORTIZ provides GPS-equipped vehicles and local driving tips to help you navigate Bali with confidence.</p>", isPublished: true, publishedAt: new Date(Date.now() - 8 * 86400000), metaDescription: "Read our complete guide on driving in Bali, including road rules, safety tips." },
    { title: "ORTIZ Launches New Fleet of Electric and Hybrid Vehicles for Eco-Tourism", slug: "ortiz-launches-electric-hybrid-fleet", content: "<p>In line with our commitment to sustainable tourism, ORTIZ is proud to announce the addition of electric and hybrid vehicles to our fleet. These eco-friendly cars offer a quieter, greener way to explore the beautiful island of Bali while reducing your carbon footprint.</p><p>From the efficient Toyota Prius to the fully electric Hyundai Ioniq 5, our new additions combine cutting-edge technology with premium comfort. Book your green ride today.</p>", isPublished: true, publishedAt: new Date(Date.now() - 12 * 86400000), metaDescription: "ORTIZ introduces electric and hybrid vehicles to promote eco-friendly tourism in Bali." },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }

  console.log("✅ Seed completed: 1 admin, 4 categories, 12 cars, 4 articles");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
