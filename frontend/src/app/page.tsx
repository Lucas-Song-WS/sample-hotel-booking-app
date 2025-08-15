"use client";

import Image from "next/image";
import router from "next/router";

export default function Home() {
  return (
    <div className="bg-offwhite text-gray-900 font-sans">
      <section className="relative h-[80vh] w-full">
        <Image
          src="https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1920&auto=format&fit=crop"
          alt="Luxury hotel view"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white max-w-2xl px-4">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
              Welcome to MyHotel
            </h1>
            <p className="mb-6 text-lg md:text-xl font-light">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              tincidunt, nisl eget mattis facilisis, nunc est elementum massa, a
              ultricies nibh mauris id lectus.
            </p>
            <button
              className="px-8 py-3 bg-gold text-black font-medium hover:bg-black hover:text-gold transition border border-gold"
              onClick={() => router.push("/booking")}
            >
              BOOK NOW
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-serif font-bold text-center mb-12">
          Experience Luxury at Its Finest
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Spacious Rooms",
              img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=600&auto=format&fit=crop",
              desc: "Relax in our elegantly designed rooms with stunning views.",
            },
            {
              title: "Fine Dining",
              img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
              desc: "Savor world-class cuisine prepared by our expert chefs.",
            },
            {
              title: "Spa & Wellness",
              img: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=600&auto=format&fit=crop",
              desc: "Indulge in rejuvenating treatments at our luxury spa.",
            },
            {
              title: "Scenic Views",
              img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop",
              desc: "Enjoy breathtaking landscapes from every corner of the hotel.",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-none shadow hover:shadow-lg transition overflow-hidden border border-gold/30"
            >
              <Image
                src={card.img}
                alt={card.title}
                width={600}
                height={400}
                className="object-cover w-full h-48"
              />
              <div className="p-4">
                <h3 className="text-lg font-serif font-semibold mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-700 text-sm">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
