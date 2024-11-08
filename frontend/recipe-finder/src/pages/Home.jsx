import Header from '../components/common/Header'; // Fix path relative to src
import { useTranslation } from 'react-i18next';


const Home = () => {
    const { t } = useTranslation();

    return (
        <Header 
            title={t('title')} 
            subtitle={t('subtitle')} 
            bgClass="bg-image" 
        />
    );
}

export default Home;


