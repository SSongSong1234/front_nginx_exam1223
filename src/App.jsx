import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import Navbar from "./Member/components/Navbar";
import Footer from "./Member/components/Footer";
import Guide from "./Member/pages/Guide";
import Main from "./Member/pages/Main";
import Login from "./Member/pages/Login";
import MyPage from "./Member/pages/MyPage";
import Terms from "./Member/pages/Terms";
import Terms2 from "./Member/pages/Terms2";
import Terms3 from "./Member/pages/Terms3";
import FindId from "./Member/pages/FindId";
import FindId2 from "./Member/pages/FindId2";
import FindPw from "./Member/pages/FindPw";
import FindPw2 from "./Member/pages/FindPw2";
import FindPw3 from "./Member/pages/FindPw3";
import Verify from "./Member/pages/Verify";

import InquiryBoard from "./Member/pages/inquiries/InquiryBoard";
import InquiryNew from "./Member/pages/inquiries/InquiryNew";
import InquirySuccess from "./Member/pages/inquiries/InquirySuccess";

import EditNickname from "./Member/pages/account/EditNickname";
import ChangePassword from "./Member/pages/account/ChangePassword";
import Withdraw from "./Member/pages/account/Withdraw";
import PasswordChangeSuccess from "./Member/pages/account/PasswordChangeSuccess";

import RequireAuth from "./Member/pages/auth/RequireAuth";
import OAuthCallback from "./Member/pages/auth/OAuthCallback";

import RequireAdmin from "./Admin/RequireAdmin";
import AdminLayout from "./Admin/AdminLayout";
import Dashboard from "./Admin/pages/Dashboard";
import Members from "./Admin/pages/Members";
import Payments from "./Admin/pages/Payments";
import ApiKeys from "./Admin/pages/ApiKeys";
import Logs from "./Admin/pages/Logs";
import Inquiries from "./Admin/pages/Inquiries";
import InquiryAnswer from "./Admin/pages/InquiryAnswer";
import InquiryDetail from "./Admin/pages/InquiryDetail"; // 상세보기 페이지 대략 만들어놓음
import Settings from "./Admin/pages/Settings";

import PrivacyPolicy from "./Member/pages/policy/PrivacyPolicy";
import TermsPolicy from "./Member/pages/policy/TermsPolicy";
import LegalCenter from "./Member/pages/legal/LegalCenter";
import LegalDetail from "./Member/pages/legal/LegalDetail";

// 결제
import PricingPage from "./Member/pages/PricingPage";
import CheckoutPage from "./Member/pages/CheckoutPage";
import CheckoutSuccessPage from "./Member/pages/CheckoutSuccessPage";

// ✅ Workspace (메인 기능 페이지)
import WorkspaceLayout from "./Member/pages/workspace/WorkspaceLayout";
import WorkspaceCorrection from "./Member/pages/workspace/WorkspaceCorrection";
import WorkspaceAlbum from "./Member/pages/workspace/WorkspaceAlbum";
import WorkspaceLibraryCorrection from "./Member/pages/workspace/WorkspaceLibraryCorrection";


function MainLayout() {
  return (
    <div className="appShell">
      <Navbar />
      <main className="appMain">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Workspace: Navbar/Footer 없는 작업 전용 레이아웃 */}
        <Route element={<RequireAuth />}>
          <Route path="/workspace" element={<WorkspaceLayout />}>
            <Route index element={<Navigate to="correction" replace />} />
            <Route path="correction" element={<WorkspaceCorrection />} />
            <Route path="album" element={<WorkspaceAlbum />} />
            <Route path="library" element={<WorkspaceLibraryCorrection />} />
          </Route>
        </Route>

        {/* ✅ 일반 사용자 레이아웃 (Navbar/Footer 항상) */}
        <Route element={<MainLayout />}>
          {/* 공개 페이지 */}
          
          <Route path="/login" element={<Login />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/terms2" element={<Terms2 />} />
          <Route path="/terms3" element={<Terms3 />} />

          <Route path="/findid" element={<FindId />} />
          <Route path="/findid2" element={<FindId2 />} />
          <Route path="/findpw" element={<FindPw />} />
          <Route path="/findpw2" element={<FindPw2 />} />
          <Route path="/findpw3" element={<FindPw3 />} />
          <Route path="/verify" element={<Verify />} />

          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/termspolicy" element={<TermsPolicy />} />
          <Route path="/legal" element={<LegalCenter />} />
          <Route path="/legal/:docId" element={<LegalDetail />} />

          <Route path="/pricing" element={<PricingPage />} />

          <Route path="/auth/callback/:provider" element={<OAuthCallback />} />

          {/* ✅ 로그인 필요한 페이지 (MainLayout 안에서 RequireAuth로 보호) */}
          <Route element={<RequireAuth />}>

            <Route path="/" element={<Main />} />
            <Route path="/mypage" element={<MyPage />} />

            <Route path="/inquiries" element={<InquiryBoard />} />
            <Route path="/inquiries/new" element={<InquiryNew />} />
            <Route path="/inquiries/success" element={<InquirySuccess />} />

            <Route path="/account/nickname" element={<EditNickname />} />
            <Route path="/account/password" element={<ChangePassword />} />
            <Route path="/account/withdraw" element={<Withdraw />} />
            <Route path="/account/password/success" element={<PasswordChangeSuccess />} />

            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/success" element={<CheckoutSuccessPage />} />

          </Route>
        </Route>

        {/* ✅ 관리자 페이지 (Navbar/Footer 없음) */}
        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="members" element={<Members />} />
            <Route path="payments" element={<Payments />} />
            <Route path="api-keys" element={<ApiKeys />} />
            <Route path="logs" element={<Logs />} />
            <Route path="inquiries" element={<Inquiries />} />
            <Route path="inquiries/:id" element={<InquiryDetail />} />
            <Route path="inquiries/:id/answer" element={<InquiryAnswer />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
