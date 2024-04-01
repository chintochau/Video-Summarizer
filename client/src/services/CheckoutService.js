const apiUrl = `${import.meta.env.VITE_API_BASE_URL}`;
class CheckoutService {
  // Create PaymentIntent as soon as the page loads
  // items:[{id:credits, amount:200, payment:5}]
  // items:[{id:tier-professional, amount:200}]
  static async processPayment(selectedPlan) {
    try {
      // Create PaymentIntent as soon as the page loads
      const response = await fetch(apiUrl + "/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPlan),
      });

      const body = await response.json()
      return body.url;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default CheckoutService;
