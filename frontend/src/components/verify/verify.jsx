import React, { useContext, useEffect, useState } from "react";
import "./verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/storecontext";
import axios from "axios";

// This page is the success_url / cancel_url target for Stripe Checkout.
// Stripe redirects here with ?success=true|false&orderId=... in the URL,
// and this component asks the backend to confirm the payment actually went through.
const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "failed"

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axios.post(`${url}/api/order/verify`, {
          success,
          orderId,
        });

        if (response.data.success) {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("failed");
      }
    };

    if (orderId) {
      verifyPayment();
    } else {
      setStatus("failed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, success]);

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => navigate("/myorders"), 2000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  return (
    <div className="verify-page">
      <div className="verify-box">
        {status === "verifying" && (
          <>
            <div className="verify-spinner"></div>
            <p>Verifying your payment, please wait...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="verify-icon-success">✓</div>
            <h2>Payment Successful!</h2>
            <p>Redirecting you to your orders...</p>
          </>
        )}
        {status === "failed" && (
          <>
            <div className="verify-icon-failed">✕</div>
            <h2>Payment Failed or Cancelled</h2>
            <p>No charge was made. You can try placing the order again.</p>
            <button onClick={() => navigate("/cart")}>Back to Cart</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Verify;