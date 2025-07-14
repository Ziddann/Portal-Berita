import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';
import './Styles/Footer.css';
import './Styles/responsive.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Side - Company Info */}
        <div className="footer-left">
          <h3>BrieflyNews</h3>
          <p>Your trusted source for the latest news and trends. Stay informed with us!</p>
        </div>

        {/* Center - Quick Links */}
        <div className="footer-center">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>

        {/* Right Side - Social Media & Contact */}
        <div className="footer-right">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#" className="social-icon"><FaFacebook /></a>
            <a href="#" className="social-icon"><FaInstagram /></a>
            <a href="#" className="social-icon"><FaTwitter /></a>
            <a href="#" className="social-icon"><FaLinkedin /></a>
          </div>

          <h4>Contact</h4>
          <div className="contact-info">
            <p><FaEnvelope /> <a href="mailto:support@brieflynews.com">support@brieflynews.com</a></p>
            <p><FaPhone /> +1 234 567 890</p>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; 2025 BrieflyNews. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
