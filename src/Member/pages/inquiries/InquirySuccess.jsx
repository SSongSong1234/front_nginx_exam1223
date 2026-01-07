import { useNavigate } from "react-router-dom";
import "./inquiries.css";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

export default function InquirySuccess() {
  const navigate = useNavigate();
  return (
    <>
    <Navbar/>
    <div className="inqWrap">
      <div className="successBox">
        <h1 className="successTitle">1:1 문의가 등록되었습니다</h1>
        <p className="inqDesc">서비스 이용 중 궁금한 점이나 개선 사항을 남겨주셔서 감사합니다.</p>

        <button className="btnDark" onClick={() => navigate("/inquiries")} type="button">
          내 문의내역
        </button>
      </div>
    </div>
    <Footer/>
    </>
  );
  
}

