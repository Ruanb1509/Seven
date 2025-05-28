import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlanCard from "../components/Plans/PlanCard";
import Loading from "../components/Loading/Loading";
import { motion } from "framer-motion";
import { Crown, Sparkles, Shield } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { Helmet } from "react-helmet";

const Plans: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isVip, setIsVip] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");
  const email = localStorage.getItem("email");
  const { theme } = useTheme();



  useEffect(() => {
    const checkAuthAndVipStatus = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const authResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/auth/dashboard`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (authResponse.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("Token");
          setIsAuthenticated(false);
        }

        const vipResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/auth/is-vip/${email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await vipResponse.json();
        setIsVip(data.isVip);
      } catch (error) {
        console.error("Error checking authentication or VIP status:", error);
        localStorage.removeItem("Token");
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndVipStatus();
  }, [token, email]);

  const handleAccessClick = async (plan: "monthly" | "annual") => {
    const token = localStorage.getItem("Token");
    const email = localStorage.getItem("email");
  
    if (!token) {
      navigate('/register')

      return;
    }
  
    if (!email) {
      alert('/login');
      return;
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();


      const paymentResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/pay/vip-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, planType: plan }),
      });
      
  
      const paymentData = await paymentResponse.json();
  
      if (paymentData.url) {
        window.location.href = paymentData.url;
      } else {
        alert(paymentData.error || "Erro ao redirecionar para o Stripe.");
      }
    } catch (error) {
      console.error("Erro ao iniciar o checkout:", error);
      alert("Erro ao processar pagamento. Veja o console para detalhes.");
    }
  };

  const handleFreeContentClick = (): Promise<void> => {
    if (isAuthenticated) {
      navigate("/");
    } else {
      navigate("/login");
    }
    return Promise.resolve();
  };

  const handleRedirect = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");
    const planType = urlParams.get("planType");
    const isCanceled = window.location.pathname.includes("/cancel");

    if (!email || !planType) {
      console.error("Email or planType is missing in the URL");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/update-vip-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            planType,
            isVip: !isCanceled,
          }),
        }
      );

      if (!response.ok) throw new Error("Error updating VIP status");

      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    handleRedirect();
  }, []);

  if (loading) return <Loading />;

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >

<Helmet>
  <title>Sevenxleaks - Plans</title>
  <link rel="canonical" href={`https://sevenxleaks.com/plans`} />
</Helmet>
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1
              className={`text-4xl font-bold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Choose Your Perfect Plan
            </h1>
            <p
              className={`text-gray-400 text-lg max-w-2xl mx-auto ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Get access to exclusive content and features with our premium
              plans. Choose the plan that best fits your needs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-8 mt-8 flex-wrap"
          >
            <div className="flex items-center gap-2 text-sm">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span>Premium Content</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span>Early Access</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-5 h-5 text-green-400" />
              <span>Priority Support</span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <PlanCard
            title="VIP ALL ACCESS"
            price="$10.00"
            description="Monthly Premium Access"
            isPopular={false}
            features={[
              "Exclusive VIP content access",
              "Early access to new content",
              "VIP Discord community badge",
              "Priority support 24/7",
              "Ad-free experience",
              "Exclusive webinars & Q&A",
              "Content recommendation priority",
              "Monthly newsletter",
            ]}
            buttonText="Get VIP Access"
            onButtonClick={() => handleAccessClick("monthly")}
          />

          <PlanCard
            title="ANNUAL PREMIUM"
            price="$5.00/mo"
            description="Billed annually ($60.00/year)"
            features={[
              "All VIP features included",
              "50% monthly price savings",
              "Exclusive annual member badge",
              "Premium Discord channels",
              "Priority feature requests",
              "Exclusive annual events",
              "Personal support manager",
              "Advanced content analytics",
            ]}
            buttonText="Get Annual Plan"
            onButtonClick={() => handleAccessClick("annual")}
            isPopular={true}
          />

          <PlanCard
            title="FREE ACCESS"
            price="$0.00"
            description="Basic Features"
            features={[
              "Free content with ads",
              "Basic Discord access",
              "Standard support",
              "Community features",
              "Limited content access",
              "Ad-supported experience",
              "Standard response time",
              "Basic analytics",
            ]}
            buttonText="Access Free Content"
            onButtonClick={handleFreeContentClick}
            isPopular={false}
            unPopular={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Plans;
