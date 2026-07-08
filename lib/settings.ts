export interface SiteSettings {
  brand: {
    name: string;
    tagline: string;
    taglineHighlight: string;
    phone: string;
    email: string;
    whatsapp: string;
    instagram: string;
    tiktok: string;
  };
  hero: {
    title: string;
    titleHighlight: string;
    subtitle: string;
  };
  about: {
    title: string;
    p1: string;
    p2: string;
    p3: string;
  };
  safety: {
    title: string;
    titleHighlight: string;
    description: string;
  };
  contact: {
    title: string;
    subtitle: string;
    address: string;
  };
  colors: {
    primary: string;
    dark: string;
    darker: string;
  };
}

export const DEFAULT_SETTINGS: SiteSettings = {
  brand: {
    name: "ORTIZ",
    tagline: "DON'T DREAM IT!",
    taglineHighlight: "DRIVE IT!",
    phone: "082140560055",
    email: "ortiz@gmail.com",
    whatsapp: "6282140560055",
    instagram: "@ortiz",
    tiktok: "@ortiz",
  },
  hero: {
    title: "BALI",
    titleHighlight: "CAR RENTAL",
    subtitle: "ORTIZ is a Bali car rental that offers the best car rental solutions for your vacation in Bali. We provide a wide selection of quality cars at the most affordable rental rates.",
  },
  about: {
    title: "ABOUT US",
    p1: "Since 2018, ORTIZ has been known for delivering premium transportation services, trusted by high-profile clients, from celebrities to government leaders.",
    p2: "More than just a car rental, ORTIZ guarantees a premium travel experience with top-notch, hassle-free transportation.",
    p3: "With a focus on providing a wide range of vehicles, from comfortable city cars to luxurious premium models, we aim to elevate your travel experience on the island.",
  },
  safety: {
    title: "SAFETY AND COMFORT AS",
    titleHighlight: "OUR TOP PRIORITIES",
    description: "ORTIZ ensures that every vehicle is in prime condition. All our cars undergo regular maintenance checks to guarantee safety and comfort.",
  },
  contact: {
    title: "Only 5 minutes from Ngurah Rai International Airport",
    subtitle: "Located just 5 minutes from Ngurah Rai International Airport, we offer easy access for travelers.",
    address: "Jalan Taman Sari No 100, Kelan, Kuta Selatan, Badung, Bali - 80361",
  },
  colors: {
    primary: "#CAA251",
    dark: "#111827",
    darker: "#0B0B0B",
  },
};
