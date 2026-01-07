import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";

// (메뉴용 더미 페이지들 - 없어도 되지만 링크 테스트하려면 있으면 좋음)
const Guide = () => <div style={{ padding: 24 }}>가이드 페이지</div>;
const Pricing = () => <div style={{ padding: 24 }}>요금제 페이지</div>;
const Contact = () => <div style={{ padding: 24 }}>문의 페이지</div>;

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Terms />} />

        <Route path="/guide" element={<Guide />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}
