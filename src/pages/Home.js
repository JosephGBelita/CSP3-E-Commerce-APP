import Banner from '../components/Banner';
import Highlights from '../components/Highlights';
import FeaturedProducts from '../components/FeaturedProducts'; 
import AppCarousel from "../components/Carousel";
import NewArrivals from '../components/NewArrivals';

export default function Home() {
    const data = {
        title: "SHOP ZUITT — Your Tech, Your Power.",
        content: "Explore the latest laptops, gaming rigs, and smartphones built for creators, gamers, and professionals. Shop quality gadgets with exclusive deals designed to power your digital lifestyle.",
        destination: "/products", 
        buttonLabel: "Shop Now"
    };

    return (
        <>
            <Banner data={data} />
            <div className="container">
                <NewArrivals />
                <AppCarousel />
                <Highlights />
                <FeaturedProducts />
            </div>
        </>
    );
}
