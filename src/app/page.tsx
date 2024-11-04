
import Hero from "./components/Hero";
import NewProducts from "./components/NewProducts"
import Collection from "./components/Collection";

interface ProductImage {
  id: string;
  src: string;
  _id: string;
}

interface Product {
  _id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  images: ProductImage[];
}

interface HeroProps {
  product: Product | null;
}

export default async function Home() {

  return (
    <>
      <Hero />
      <NewProducts />
      <Collection />
    </>
  );
}



