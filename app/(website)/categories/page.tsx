import Link from "next/link";
import { getCategories } from "@/app/actions/categories";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories | Kutchi Handmade Collection",
  description: "Explore our curated collections of authentic Kutchi handmade masterpieces, sorted by categories.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12 space-y-4">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary">Shop by Category</h1>
        <p className="text-muted-foreground font-sans text-lg">
          Explore our curated collections of authentic Kutchi handmade masterpieces, each piece crafted with traditional expertise.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-24 bg-muted/30 rounded-3xl border border-border max-w-3xl mx-auto">
          <h3 className="text-2xl font-heading text-primary font-bold mb-2">No Categories Yet</h3>
          <p className="text-muted-foreground">We are currently updating our collections. Please check back soon!</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-10 md:gap-16">
          {categories.map((category) => (
            <Link href={`/products?category=${category.slug}`} key={category.id} className="group flex flex-col items-center gap-5">
              <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-[5px] border-[#7C2D12] p-1.5 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 bg-white">
                <div className="w-full h-full rounded-full overflow-hidden bg-muted">
                  {category.image_url ? (
                    <img 
                      src={category.image_url} 
                      alt={category.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full bg-[#f3efe8] flex items-center justify-center text-[#7C2D12] font-heading text-3xl p-4 text-center">
                      {category.name[0]}
                    </div>
                  )}
                </div>
              </div>
              <span className="font-semibold text-2xl text-[#7C2D12] group-hover:opacity-80 transition-opacity mt-2">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
