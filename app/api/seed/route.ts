import { prisma } from "@/lib/prisma";
import { hashSync } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== (process.env.SEED_SECRET || "ortiz-seed-2024")) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 403 });
  }

  try {
    // Admin
    await prisma.user.upsert({
      where: { email: "admin@ortiz.com" },
      update: {},
      create: { name: "Admin ORTIZ", email: "admin@ortiz.com", password: hashSync("password", 10) },
    });

    // Categories
    const cats = [
      { name: "Luxury", slug: "luxury", description: "Luxury car collection for premium experience" },
      { name: "Premium", slug: "premium", description: "Premium cars for a high-end driving experience" },
      { name: "City", slug: "city", description: "Compact city cars for easy urban exploration" },
      { name: "Family", slug: "family", description: "Spacious family cars for comfortable group travel" },
    ];
    for (const c of cats) {
      await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
    }

    const luxury = (await prisma.category.findUnique({ where: { slug: "luxury" } }))!;
    const premium = (await prisma.category.findUnique({ where: { slug: "premium" } }))!;
    const city = (await prisma.category.findUnique({ where: { slug: "city" } }))!;
    const family = (await prisma.category.findUnique({ where: { slug: "family" } }))!;

    const cars = [
      { categoryId: luxury.id, name: "Mercedes-Benz S-Class", slug: "mercedes-benz-s-class", description: "The pinnacle of luxury sedans.", seats: 4, fuelType: "Gasoline", transmission: "Automatic", price: 5500000, priceDuration: "day", notes: "Include Driver", sortOrder: 1 },
      { categoryId: luxury.id, name: "BMW 7 Series", slug: "bmw-7-series", description: "Dynamic luxury sedan with powerful performance.", seats: 4, fuelType: "Gasoline", transmission: "Automatic", price: 5000000, priceDuration: "day", notes: "Include Driver", sortOrder: 2 },
      { categoryId: luxury.id, name: "Lexus LS 500", slug: "lexus-ls-500", description: "Japanese luxury at its finest.", seats: 4, fuelType: "Hybrid", transmission: "Automatic", price: 4800000, priceDuration: "day", notes: "Include Driver", sortOrder: 3 },
      { categoryId: premium.id, name: "Toyota Alphard", slug: "toyota-alphard", description: "Premium MPV with captain seats.", seats: 7, fuelType: "Gasoline", transmission: "Automatic", price: 2500000, priceDuration: "day", notes: "Include Driver", sortOrder: 1 },
      { categoryId: premium.id, name: "Toyota Vellfire", slug: "toyota-vellfire", description: "Ultimate premium MPV with aggressive styling.", seats: 7, fuelType: "Gasoline", transmission: "Automatic", price: 2700000, priceDuration: "day", notes: "Include Driver", sortOrder: 2 },
      { categoryId: premium.id, name: "Toyota Land Cruiser", slug: "toyota-land-cruiser", description: "Legendary SUV for luxury and adventure.", seats: 7, fuelType: "Diesel", transmission: "Automatic", price: 3500000, priceDuration: "day", notes: "Include Driver", sortOrder: 3 },
      { categoryId: city.id, name: "Toyota Agya", slug: "toyota-agya", description: "Compact city car for easy Bali exploration.", seats: 5, fuelType: "Gasoline", transmission: "Automatic", price: 250000, priceDuration: "day", notes: null, sortOrder: 1 },
      { categoryId: city.id, name: "Honda Brio", slug: "honda-brio", description: "Fun-to-drive city hatchback.", seats: 5, fuelType: "Gasoline", transmission: "Automatic", price: 275000, priceDuration: "day", notes: null, sortOrder: 2 },
      { categoryId: city.id, name: "Suzuki Ignis", slug: "suzuki-ignis", description: "Stylish mini crossover for narrow streets.", seats: 5, fuelType: "Gasoline", transmission: "Automatic", price: 300000, priceDuration: "day", notes: null, sortOrder: 3 },
      { categoryId: family.id, name: "Toyota Avanza", slug: "toyota-avanza", description: "Indonesia's favorite family MPV.", seats: 7, fuelType: "Gasoline", transmission: "Automatic", price: 350000, priceDuration: "day", notes: null, sortOrder: 1 },
      { categoryId: family.id, name: "Toyota Innova Reborn", slug: "toyota-innova-reborn", description: "Premium family MPV with diesel engine.", seats: 7, fuelType: "Diesel", transmission: "Automatic", price: 500000, priceDuration: "day", notes: null, sortOrder: 2 },
      { categoryId: family.id, name: "Mitsubishi Xpander", slug: "mitsubishi-xpander", description: "Modern crossover MPV with spacious seating.", seats: 7, fuelType: "Gasoline", transmission: "Automatic", price: 400000, priceDuration: "day", notes: null, sortOrder: 3 },
    ];
    for (const car of cars) {
      await prisma.car.upsert({ where: { slug: car.slug }, update: {}, create: car });
    }

    const articles = [
      { title: "Top 10 Must-Visit Destinations in Bali", slug: "top-10-destinations-bali", content: "<p>Bali is a treasure trove of breathtaking destinations best explored with your own rental car.</p>", isPublished: true, publishedAt: new Date(Date.now() - 2 * 86400000), metaDescription: "Top 10 Bali destinations with ORTIZ rental car." },
      { title: "Why Renting a Car in Bali Beats Ride-Hailing", slug: "renting-car-vs-ride-hailing", content: "<p>Renting a car gives you complete control over your itinerary, schedule, and comfort.</p>", isPublished: true, publishedAt: new Date(Date.now() - 5 * 86400000), metaDescription: "Why car rental is smarter in Bali." },
      { title: "Essential Driving Tips for Bali Tourists", slug: "driving-tips-bali", content: "<p>Drive on the left, be mindful of motorbikes, and carry your international driving permit.</p>", isPublished: true, publishedAt: new Date(Date.now() - 8 * 86400000), metaDescription: "Complete driving guide for Bali." },
      { title: "ORTIZ Launches Electric & Hybrid Fleet", slug: "electric-hybrid-fleet", content: "<p>ORTIZ adds electric and hybrid vehicles for eco-friendly Bali tourism.</p>", isPublished: true, publishedAt: new Date(Date.now() - 12 * 86400000), metaDescription: "New eco-friendly vehicles at ORTIZ." },
    ];
    for (const a of articles) {
      await prisma.article.upsert({ where: { slug: a.slug }, update: {}, create: a });
    }

    return NextResponse.json({ success: true, message: "Seeded: 1 admin, 4 categories, 12 cars, 4 articles" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
