export const generateInvoiceHTML = (user, items, address, total, orderId) => {
  return `
    <div style="font-family: Arial, sans-serif; padding:20px; border:1px solid #ddd;">
      <h2 style="color:#2d6cdf;">MyShop - Invoice</h2>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <hr/>
      <h3>Customer Details</h3>
      <p>${user.email}</p>
      
      <h3>Shipping Address</h3>
      <p>
        ${address.street}, ${address.city}, ${address.state}, ${address.country} - ${address.postalCode} <br/>
        Phone: ${address.phoneNumber}
      </p>
      
      <h3>Order Summary</h3>
      <table style="width:100%; border-collapse:collapse;">
        <thead>
          <tr style="background:#f2f2f2;">
            <th style="border:1px solid #ddd; padding:8px;">Item</th>
            <th style="border:1px solid #ddd; padding:8px;">Qty</th>
            <th style="border:1px solid #ddd; padding:8px;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (i) => `
            <tr>
              <td style="border:1px solid #ddd; padding:8px;">${i.title}</td>
              <td style="border:1px solid #ddd; padding:8px;">${i.quantity}</td>
              <td style="border:1px solid #ddd; padding:8px;">₹${i.price * i.quantity}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <h3 style="text-align:right; margin-top:10px;">Total: ₹${total}</h3>
      <hr/>
      <p style="text-align:center;">Thank you for shopping with <strong>MyShop</strong>!</p>
    </div>
  `;
};
