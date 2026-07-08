import { prisma } from "@/lib/prisma";
import { hashSync } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const TABLES = [
  `CREATE TABLE IF NOT EXISTS "users" ("id" SERIAL PRIMARY KEY, "name" TEXT NOT NULL, "email" TEXT NOT NULL UNIQUE, "password" TEXT NOT NULL, "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
  `CREATE TABLE IF NOT EXISTS "categories" ("id" SERIAL PRIMARY KEY, "name" TEXT NOT NULL, "slug" TEXT NOT NULL UNIQUE, "description" TEXT, "is_active" BOOLEAN NOT NULL DEFAULT true, "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
  `CREATE TABLE IF NOT EXISTS "cars" ("id" SERIAL PRIMARY KEY, "category_id" INTEGER NOT NULL REFERENCES "categories"("id") ON DELETE CASCADE, "name" TEXT NOT NULL, "slug" TEXT NOT NULL UNIQUE, "description" TEXT, "image_path" TEXT, "seats" INTEGER NOT NULL DEFAULT 4, "fuel_type" TEXT NOT NULL DEFAULT 'Gasoline', "transmission" TEXT NOT NULL DEFAULT 'Automatic', "price" INTEGER NOT NULL DEFAULT 0, "price_duration" TEXT NOT NULL DEFAULT 'day', "notes" TEXT, "is_available" BOOLEAN NOT NULL DEFAULT true, "sort_order" INTEGER NOT NULL DEFAULT 0, "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
  `CREATE INDEX IF NOT EXISTS "cars_cat_avail_idx" ON "cars"("category_id", "is_available")`,
  `CREATE TABLE IF NOT EXISTS "articles" ("id" SERIAL PRIMARY KEY, "title" TEXT NOT NULL, "slug" TEXT NOT NULL UNIQUE, "content" TEXT NOT NULL, "image_path" TEXT, "is_published" BOOLEAN NOT NULL DEFAULT false, "published_at" TIMESTAMPTZ, "meta_description" TEXT, "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
  `CREATE INDEX IF NOT EXISTS "articles_pub_idx" ON "articles"("is_published", "published_at")`,
  `CREATE TABLE IF NOT EXISTS "bookings" ("id" SERIAL PRIMARY KEY, "car_id" INTEGER NOT NULL REFERENCES "cars"("id") ON DELETE CASCADE, "booking_code" TEXT NOT NULL UNIQUE, "customer_name" TEXT NOT NULL, "customer_email" TEXT, "customer_phone" TEXT NOT NULL, "pickup_date" TIMESTAMPTZ NOT NULL, "return_date" TIMESTAMPTZ NOT NULL, "pickup_location" TEXT, "total_price" INTEGER NOT NULL DEFAULT 0, "status" TEXT NOT NULL DEFAULT 'pending', "notes" TEXT, "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
  `CREATE INDEX IF NOT EXISTS "bookings_status_idx" ON "bookings"("status", "pickup_date")`,
];

async function handleSetup(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  if (secret !== (process.env.SEED_SECRET || "ortiz-seed-2024")) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 403 });
  }

  const log: string[] = [];
  try {
    for (const sql of TABLES) await prisma.$executeRawUnsafe(sql);
    log.push("Tables created");

    const hashed = hashSync("password", 10);
    await prisma.$executeRawUnsafe(`INSERT INTO "users" ("name","email","password","created_at","updated_at") VALUES ($1,$2,$3,NOW(),NOW()) ON CONFLICT ("email") DO NOTHING`, "Admin ORTIZ", "admin@ortiz.com", hashed);
    log.push("Admin user ready");

    const cats = [["Luxury","luxury","Luxury car collection"],["Premium","premium","Premium cars for high-end experience"],["City","city","Compact city cars"],["Family","family","Spacious family cars"]];
    for (const [n,s,d] of cats) await prisma.$executeRawUnsafe(`INSERT INTO "categories" ("name","slug","description","created_at","updated_at") VALUES ($1,$2,$3,NOW(),NOW()) ON CONFLICT ("slug") DO NOTHING`,n,s,d);
    log.push("Categories ready");

    const cars: [string,string,string,string,number,string,string,number,string,string|null,number,string][] = [
      ["luxury","Mercedes-Benz S-Class","mercedes-benz-s-class","The pinnacle of luxury sedans. Experience supreme comfort and cutting-edge technology.",4,"Gasoline","Automatic",5500000,"day","Include Driver",1,"https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=600&auto=format&fit=crop"],
      ["luxury","BMW 7 Series","bmw-7-series","Dynamic luxury sedan with powerful performance and elegant interior design.",4,"Gasoline","Automatic",5000000,"day","Include Driver",2,"https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600&auto=format&fit=crop"],
      ["luxury","Lexus LS 500","lexus-ls-500","Japanese luxury at its finest. Whisper-quiet cabin with world-class craftsmanship.",4,"Hybrid","Automatic",4800000,"day","Include Driver",3,"https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=600&auto=format&fit=crop"],
      ["premium","Toyota Alphard","toyota-alphard","Premium MPV with captain seats, perfect for VIP transfers and luxury tours.",7,"Gasoline","Automatic",2500000,"day","Include Driver",1,"https://images.unsplash.com/photo-1570356528233-b442cf2de345?q=80&w=600&auto=format&fit=crop"],
      ["premium","Toyota Vellfire","toyota-vellfire","The ultimate premium MPV with aggressive styling and first-class cabin comfort.",7,"Gasoline","Automatic",2700000,"day","Include Driver",2,"https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=600&auto=format&fit=crop"],
      ["premium","Toyota Land Cruiser","toyota-land-cruiser","Legendary SUV built for both luxury and adventure. Conquer any terrain in style.",7,"Diesel","Automatic",3500000,"day","Include Driver",3,"https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=600&auto=format&fit=crop"],
      ["city","Toyota Agya","toyota-agya","Compact and fuel-efficient city car for easy Bali exploration.",5,"Gasoline","Automatic",250000,"day",null,1,"https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600&auto=format&fit=crop"],
      ["city","Honda Brio","honda-brio","Fun-to-drive city hatchback with great fuel economy and nimble handling.",5,"Gasoline","Automatic",275000,"day",null,2,"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop"],
      ["city","Suzuki Ignis","suzuki-ignis","Stylish mini crossover perfect for navigating narrow Bali streets.",5,"Gasoline","Automatic",300000,"day",null,3,"https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop"],
      ["family","Toyota Avanza","toyota-avanza","Indonesias favorite family MPV. Spacious, reliable, and affordable.",7,"Gasoline","Automatic",350000,"day",null,1,"https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=600&auto=format&fit=crop"],
      ["family","Toyota Innova Reborn","toyota-innova-reborn","Premium family MPV with diesel engine and proven durability.",7,"Diesel","Automatic",500000,"day",null,2,"https://images.unsplash.com/photo-1504215680853-026ed2a45def?q=80&w=600&auto=format&fit=crop"],
      ["family","Mitsubishi Xpander","mitsubishi-xpander","Modern crossover MPV with stylish design and spacious three-row seating.",7,"Gasoline","Automatic",400000,"day",null,3,"https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=600&auto=format&fit=crop"],
    ];
    for (const [cat,name,slug,desc,seats,fuel,trans,price,dur,notes,sort,img] of cars) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO "cars" ("category_id","name","slug","description","seats","fuel_type","transmission","price","price_duration","notes","sort_order","image_path","created_at","updated_at") SELECT c.id,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW(),NOW() FROM "categories" c WHERE c.slug=$1 ON CONFLICT ("slug") DO UPDATE SET image_path=EXCLUDED.image_path, description=EXCLUDED.description`,
        cat,name,slug,desc,seats,fuel,trans,price,dur,notes,sort,img
      );
    }
    log.push("12 cars ready with images");

    const articles: [string,string,string,number,string][] = [
      ["Top 10 Must-Visit Destinations in Bali","top-10-destinations-bali","<p>Bali is a treasure trove of breathtaking destinations best explored with your own rental car. From Uluwatu Temple to Tegallalang rice terraces, each offers a unique experience.</p>",2,"https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop"],
      ["Why Renting a Car in Bali Beats Ride-Hailing","renting-car-vs-ride-hailing","<p>Renting a car gives you complete control over your itinerary, schedule, and comfort in Bali where ride-hailing is scarce in remote tourist spots.</p>",5,"https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop"],
      ["Essential Driving Tips for Bali Tourists","driving-tips-bali","<p>Drive on the left, be mindful of motorbikes, and carry your international driving permit. Stay patient and enjoy the scenic views.</p>",8,"https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=600&auto=format&fit=crop"],
      ["ORTIZ Launches Electric and Hybrid Fleet","electric-hybrid-fleet","<p>ORTIZ adds electric and hybrid vehicles for eco-friendly Bali tourism combining cutting-edge technology with premium comfort.</p>",12,"https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=600&auto=format&fit=crop"],
    ];
    for (const [title,slug,content,days,img] of articles) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO "articles" ("title","slug","content","is_published","published_at","meta_description","image_path","created_at","updated_at") VALUES ($1,$2,$3,true,NOW()-INTERVAL '${days} days',$1,$4,NOW(),NOW()) ON CONFLICT ("slug") DO UPDATE SET image_path=EXCLUDED.image_path`,
        title,slug,content,img
      );
    }
    log.push("4 articles ready with images");

    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, log }, { status: 500 });
  }
}

export async function POST(req: NextRequest) { return handleSetup(req); }
export async function GET(req: NextRequest) { return handleSetup(req); }
// This line intentionally left to prevent append issues
