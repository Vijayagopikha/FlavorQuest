import Header from '../components/common/Header'; // Fix path relative to src

const Home = () => {
    return (
        <Header 
            title="Our Recipes" 
            subtitle="What delicious dish or ingredients are swirling in your mind? Let Tastetrek guide you to the perfect recipe!" 
            bgClass="bg-image" 
        />
    );
}

export default Home;
