import { Link } from "react-router-dom";
import logoFull from "../../assets/logo.png";

export default function Footer() {
  return (
    <footer className="alc-footer">

      {/* BRAND */}
      <div className="alc-container alc-footer__brand">
        <img
          src={logoFull}
          alt="Andromeda Logic Corp"
          className="alc-footer__logo"
        />
      </div>

      {/* LINKS */}
      <div className="alc-container alc-footer__grid">

        <div className="alc-footer__column">
          <h3>Explore</h3>

          <div className="alc-footer__links">
            <Link to="/">Home</Link>
            <Link to="/technology">Technology</Link>
            <Link to="/products">Products & Platforms</Link>
            <Link to="/solutions">Solutions</Link>
            <Link to="/research">Research & Innovation</Link>
          </div>
        </div>

        <div className="alc-footer__column">
          <h3>Company</h3>

          <div className="alc-footer__links">
            <Link to="/about">About Us</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/newsroom">Newsroom</Link>
            <Link to="/investors">Investors & Partners</Link>
          </div>
        </div>

        <div className="alc-footer__column">
          <h3>Resources</h3>

          <div className="alc-footer__links">
            <Link to="/library">Technical Library</Link>
            <Link to="/missions">
              Case Studies & Mission Stories
            </Link>
            <Link to="/trust">
              Trust, Compliance & Export Control
            </Link>
          </div>
        </div>

        <div className="alc-footer__column">
          <h3>Get in Touch</h3>

          <div className="alc-footer__links">
            <Link to="/contact">
              Mission Consultation
            </Link>
          </div>
        </div>

        <div className="alc-footer__column">
          <h3>Legal</h3>

          <div className="alc-footer__links">
            <Link to="/privacy">
              Privacy Policy
            </Link>

            <Link to="/terms">
              Terms of Use
            </Link>
          </div>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="alc-container alc-footer__bottom">
        <span>
          &copy; {new Date().getFullYear()} Andromeda Logic Corp
          Private Limited. All rights reserved.
        </span>
      </div>

    </footer>
  );
}