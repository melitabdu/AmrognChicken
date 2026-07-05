import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="" />
            <p>
Welcome to Amrogn Chicken, where your cravings for mouthwatering shawarma experiences come to life! Our journey began with a simple yet passionate idea: to share the rich flavors and cultural delight of authentic shawarma with our community.

 
Established in 2018, Amrogn Chicken has since become a beloved destination for food enthusiasts seeking a delectable and immersive culinary adventure.

Tender
Flavorfull.</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>Mekanisa:
</li>
                <li>+251 903 464646</li>
                <li>Merkato:
</li>
                <li>+251 934 744242</li>CMC:


<li>+251 986 558355</li>
                <li>+251 989 494040</li>
            <li>Bethel:


</li>
                <li>+251 978 367070</li>
            
            
            </ul>
        </div>
        <div className="footer-content-center">
            <h2>Opening Hours


</h2>
            <ul>
                <li>Monday-Sunday: 10:00-22:00
</li>
                
            </ul>
        </div>
        
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2026 © Meli's.org - All Right Reserved.</p>
    </div>
  )
}

export default Footer
