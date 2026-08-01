import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import PasswordGenerator from "./pages/tools/PasswordGenerator";
import PasswordAnalyzer from "./pages/tools/PasswordAnalyzer";
import PasswordEntropy from "./pages/tools/PasswordEntropy";
import PasswordPolicy from "./pages/tools/PasswordPolicy";
import HashGenerator from "./pages/tools/HashGenerator";
import HashCompare from "./pages/tools/HashCompare";
import EncoderDecoder from "./pages/tools/EncoderDecoder";
import JwtDecoder from "./pages/tools/JwtDecoder";
import IpLookup from "./pages/tools/IpLookup";
import DnsLookup from "./pages/tools/DnsLookup";
import WhoisLookup from "./pages/tools/WhoisLookup";
import PortScanner from "./pages/tools/PortScanner";
import QrGenerator from "./pages/tools/QrGenerator";
import SecurityHeaders from "./pages/tools/SecurityHeaders";
import RobotsViewer from "./pages/tools/RobotsViewer";
import VulnPatternChecker from "./pages/tools/VulnPatternChecker";

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function LandingPage() {
  return (
    <PageWrapper>
      <div className="bg-cyberDark min-h-screen">
        <Navbar />
        <Hero />
        <Stats />
        <Features />
        <Footer />
      </div>
    </PageWrapper>
  );
}

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <Dashboard />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PageWrapper>
              <Register />
            </PageWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          }
        />
        <Route
          path="/tools/password-generator"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <PasswordGenerator />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools/password-analyzer"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <PasswordAnalyzer />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools/password-entropy"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <PasswordEntropy />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools/password-policy"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <PasswordPolicy />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools/hash-generator"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <HashGenerator />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools/hash-compare"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <HashCompare />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools/encoder-decoder"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <EncoderDecoder />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools/jwt-decoder"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <JwtDecoder />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools/ip-lookup"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <IpLookup />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools/dns-lookup"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <DnsLookup />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools/whois-lookup"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <WhoisLookup />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools/port-scanner"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <PortScanner />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools/qr-generator"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <QrGenerator />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools/security-headers"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <SecurityHeaders />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools/robots-viewer"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <RobotsViewer />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools/vuln-checker"
          element={
            <ProtectedRoute>
              <PageWrapper>
                <VulnPatternChecker />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;