import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import "../styles/PaymentPage.css"; // Import CSS for PaymentPage (create this file)

function PaymentPage() {
  const history = useHistory();
  const { type } = useParams(); // Get the subscription type from the URL params

  // Function to get subscription days from OfferList
  const getSubscriptionDays = (subscriptionType) => {
    switch (subscriptionType) {
      case "1-month":
        return 31;
      case "half-year":
        return 182;
      case "annual":
        return 365;
      case "lifetime":
        return 5500;
      default:
        return 0;
    }
  };

  const [creditCard, setCreditCard] = useState('');
  const [validTill, setValidTill] = useState('');
  const [ccv, setCcv] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [email, setEmail] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const handlePayment = async (event) => {
    event.preventDefault();

    // Validate credit card number, expiryDate (formerly validTill), ccv, etc.

    try {
      // Check if the email has already made a payment
      const paymentCheckResponse = await fetch('http://localhost:5000/api/check-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!paymentCheckResponse.ok) {
        alert("Failed to check payment status. Please try again.");
        return;
      }

      const paymentCheckData = await paymentCheckResponse.json();

      if (paymentCheckData.message === 'Payment already made') {
        alert("Payment already done for this email.");
        setPaymentStatus('Payment already done');
        return;
      }

      // Proceed with payment if the email has not made a payment yet
      const paymentResponse = await fetch('http://localhost:5000/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          creditCard,
          validTill,
          ccv,
          subscriptionDays: getSubscriptionDays(type), // Use subscriptionDays instead of subscriptionType
        }),
      });

      if (paymentResponse.ok) {
        setIsPaid(true);
        setTimeout(() => {
          setIsPaid(false);
          history.push('/browse'); // Redirect to browse page after 10 seconds
        }, 10000); // 10000 milliseconds = 10 seconds
      } else {
        alert("Payment failed. Please try again.");
      }
    } catch (err) {
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="payment-page-container">
      <div className="payment-page">
        <h1>Payment Page</h1>
        <form onSubmit={handlePayment}>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />

          <label htmlFor="credit-card">Credit Card Number:</label>
          <input 
            type="text" 
            id="credit-card" 
            name="credit-card" 
            value={creditCard}
            onChange={(e) => setCreditCard(e.target.value)}
            maxLength="10" 
            required 
          />

          <label htmlFor="valid-till">Valid Till (dd/mm/yyyy):</label>
          <input 
            type="text" 
            id="valid-till" 
            name="valid-till" 
            value={validTill}
            onChange={(e) => setValidTill(e.target.value)}
            required 
          />

          <label htmlFor="ccv">CCV:</label>
          <input 
            type="text" 
            id="ccv" 
            name="ccv" 
            value={ccv}
            onChange={(e) => setCcv(e.target.value)}
            maxLength="4" 
            required 
          />

          <label htmlFor="amount">Pay ${
            type === "1-month" ? "49.99" :
            type === "half-year" ? "249.99" :
            type === "annual" ? "499.53" :
            type === "lifetime" ? "3500.99" : "0.00"
          }</label>
          
          {paymentStatus === 'Payment already done' ? (
            <span className="paid-label">Payment already done</span>
          ) : (
            <button type="submit">{isPaid ? 'Paid' : 'Pay Now'}</button>
          )}
        </form>
      </div>
    </div>
  );
}

export default PaymentPage;
