import React from 'react';
import './ArticlesStyle.css';

//Global
import Nav from '../Components/Global/Navbar_Main';
import Footer from '../Components/Global/Footer';

// Images/PNGs
import Violet_Bkg from '../Components/Assets/articlespage_bkg2.jpg';
import WomenRH from '../Components/Assets/Reproductive_Women_img.jpg';
import MenRH from '../Components/Assets/Reproductive_Man_img.jpg';
import FP1 from '../Components/Assets/FamilyPlanning_img.jpg';
import FP2 from '../Components/Assets/FamilyPlanning_img2.jpg';
import SX1 from '../Components/Assets/Sex_img1.jpg';
import SX2 from '../Components/Assets/Safesex_img.jpg';

const Articles = () => {
  return (
    <div className="articles-page">
      <Nav />
      <header className="articles-header" style={{backgroundImage: `url(${Violet_Bkg})`}}>
        <div className="header-content">
          <h1>Journals and Articles</h1>
          <p>Explore our curated collection of informative articles to expand your knowledge on reproductive health and family planning.</p>
        </div>
      </header>
      
      <main className="articles-content">
        <div className="card-grid">
          <ArticleCard 
            image={WomenRH}
            category="Reproductive"
            title="Women's Reproductive Health"
            link="https://www.healthline.com/health/womens-health/female-reproductive-organs#organs"
          />
          <ArticleCard 
            image={MenRH}
            category="Reproductive"
            title="Men's Reproductive Health"
            link="https://www.healthline.com/health/mens-health/male-genitalia"
          />
          <ArticleCard 
            image={FP1}
            category="Family Planning"
            title="Family Planning in the Philippines"
            link="https://doh.gov.ph/uhc/health-programs/family-planning-program/"
          />
          <ArticleCard 
            image={FP2}
            category="Family Planning"
            title="Importance of Family Planning"
            link="https://hellodoctor.com.ph/sexual-wellness/contraception/importance-family-planning/"
          />
          <ArticleCard 
            image={SX1}
            category="Sex"
            title="Understanding Sexual Intercourse"
            link="https://www.netdoctor.co.uk/healthy-living/sex-life/a2314/sexual-intercourse/"
          />
          <ArticleCard 
            image={SX2}
            category="Sex"
            title="Practicing Safe Sex"
            link="https://health.clevelandclinic.org/safe-sex"
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

const ArticleCard = ({ image, category, title, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer" className="card-item">
    <div className="card-image" style={{backgroundImage: `url(${image})`}}></div>
    <div className="card-content">
      <span className={`category ${category.toLowerCase()}`}>{category}</span>
      <h3>{title}</h3>
      <div className="arrow">
        <i className="fas fa-arrow-right card-icon"></i>
      </div>
    </div>
  </a>
);

export default Articles;