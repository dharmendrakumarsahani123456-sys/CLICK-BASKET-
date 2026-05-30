# Click Basket 🛒

Click Basket is a premium, feature-rich static storefront and shopping cart application built using vanilla HTML, CSS, and JavaScript. It features an interactive **Store Manager Control Panel** (backed by `localStorage`) and **multiple working simulated and sandbox payment integrations** (PayPal SDK, Google Pay, and Luhn-checksum-validated Credit Cards with 3D Secure OTP verification).

---

## ✨ Features

### 📦 Dynamic Store Manager & Inventory Catalog
* **Floating Action Panel (FAB)**: A bottom-right administrator gear button with smooth spin animations and a notification badge that slides open the dashboard.
* **Add Custom Products**: Add custom items by specifying name, specs/description, price, category, promo tag, and choosing an image or preset.
* **Inline Vector SVG illustrations**: Category-based placeholders for items like Headphones, Gaming Keypads, and Backpacks decorated with modern linear gradients (`audio-grad`, `electronics-grad`, etc.).
* **Active Inventory Dashboard**: View all products, delete custom products from the database (which automatically cascades to clear checkout cart dependencies), or reset the entire shop back to factory defaults.

### 💳 Complete Multi-Gateway Checkout System
* **Luhn Checks**: Validates credit cards in real-time. Typos trigger visual shake animations and warning alerts.
* **3D Secure OTP Verification**: Validates transactions using an interactive 4-digit verification code field (passcode: `1234`) with auto-focusing/shifting textboxes and a 30-second expiration timer.
* **PayPal SDK Sandbox Integration**: Renders standard PayPal buttons dynamically using the official SDK. Approving the popup payment captures the order and updates details.
* **Google Pay Simulator**: Triggers mock connection state animations before clearing checkout carts.
* **Digital Perforated Ticket Receipt**: Displays a print-animated digital ticket receipt featuring jagged paper edges and a CSS barcode detailing subtotal, tax rates, shipping, and purchased products.

---

## 🚀 Easy Vercel Deployment

Deploying Click Basket to **Vercel** takes less than a minute:

1. **Push to GitHub**: (Done! The repository is set up at `https://github.com/dharmendrakumarsahani123456-sys/CLICK-BASKET-.git`)
2. **Deploy via Vercel Dashboard**:
   * Go to [vercel.com](https://vercel.com/) and log in with your GitHub account.
   * Click **New Project** or **Add New** > **Project**.
   * Import the `CLICK-BASKET-` repository from the list.
   * Vercel will automatically detect it as a static project. No build settings or install commands are required!
   * Click **Deploy**.
3. **Pre-configured Clean URLs**:
   * The project includes a `vercel.json` file containing:
     ```json
     {
       "cleanUrls": true
     }
     ```
     This automatically handles clean URLs (e.g., routing `/cart` instead of `/cart.html` and redirecting `.html` paths for sleek routing).
