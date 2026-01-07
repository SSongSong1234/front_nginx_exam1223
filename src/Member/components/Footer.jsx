import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerInner">
        <p className="copy">© 2025 WED:IT. All rights reserved.</p>

        <div className="footerLinks">
          <Link to="/termspolicy" className="footerLink">이용약관</Link>
          <Link to="/privacy" className="footerLink">개인정보처리방침</Link>
        </div>
      </div>
    </footer>
  );
}
