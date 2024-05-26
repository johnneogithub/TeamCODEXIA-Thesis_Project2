import React from 'react';
import '../pages/ArticlesStyle.css';

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
    <>
    <Nav/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"/>
    
    <div className='Heading'>
            <h2>Journals and Articles</h2>
        <div className='Underline'>
            <h3>Looking for more informations? Here are the best articles that will suit your interest!</h3>
        </div>
    </div>


    <img className='articles-image' src={Violet_Bkg} alt='Article Background'/>
    
    <section className='article-cards'>

    <div class="card-list">
        <a href="https://www.healthline.com/health/womens-health/female-reproductive-organs#organs" target="_blank" rel="noopener noreferrer" class="card-item">
            <img src={WomenRH} alt="Card Visualizer"/>
            <span class="Reproductive">Reproductive</span>
            <h3>Learn more about Women's Reproductive Health</h3>
            <div class="arrow">
                <i class="fas fa-arrow-right card-icon"></i>
            </div>

        </a>
        <a href="https://www.healthline.com/health/mens-health/male-genitalia" target="_blank" rel="noopener noreferrer" class="card-item">
            <img src={MenRH} alt="Card Visualizer"/>
            <span class="Reproductive">Reproductive</span>
            <h3>Learn more about Men's Reproductive Health</h3>
            <div class="arrow">
                <i class="fas fa-arrow-right card-icon"></i>
            </div>
        </a>

        <a href="https://doh.gov.ph/uhc/health-programs/family-planning-program/" target="_blank" rel="noopener noreferrer" class="card-item">
            <img src={FP1} alt="Card Visualizer"/>
            <span class="FP">Family Planning</span>
            <h3>What is family planning in the Philippines?</h3>
            <div class="arrow">
                <i class="fas fa-arrow-right card-icon"></i>
            </div>
        </a>

        <a href="https://hellodoctor.com.ph/sexual-wellness/contraception/importance-family-planning/" target="_blank" rel="noopener noreferrer" class="card-item">
            <img src={FP2} alt="Card Visualizer"/>
            <span class="FP">Family Planning</span>
            <h3>Growing family size? Have family planning!</h3>
            <div class="arrow">
                <i class="fas fa-arrow-right card-icon"></i>
            </div>
        </a>

        <a href="https://www.netdoctor.co.uk/healthy-living/sex-life/a2314/sexual-intercourse/" target="_blank" rel="noopener noreferrer" class="card-item">
            <img src={SX1} alt="Card Visualizer"/>
            <span class="Sex">Sex</span>
            <h3>What is an intercourse and how does it work?</h3>
            <div class="arrow">
                <i class="fas fa-arrow-right card-icon"></i>
            </div>
        </a>

        <a href="https://health.clevelandclinic.org/safe-sex" target="_blank" rel="noopener noreferrer" class="card-item">
            <img src={SX2} alt="Card Visualizer"/>
            <span class="Sex">Sex</span>
            <h3>Let's practice safe sex, for the better!</h3>
            <div class="arrow">
                <i class="fas fa-arrow-right card-icon"></i>
            </div>
        </a>
      </div>
     </section>
      <Footer/> 
    </>
    
  )
}

export default Articles;