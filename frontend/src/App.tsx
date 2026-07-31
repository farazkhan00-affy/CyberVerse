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
      </Routes>
    </AnimatePresence>
  );
}

export default App;