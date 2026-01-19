# NSS Donation Portal - IIT Roorkee

A secure MERN-stack platform for streamlining NGO campaigns, ensuring zero data loss during registrations and donations.

## Features

* **Landing Page:** Main page of Portal
* **User Registration & Login:** Common portal for donors and admins.
* **Role-Based Access:**
* **Donors:** Register freely.
* **Admins:** Require a specific **Secret Key** to register.


* **User Dashboard:**
* View profile details (Name, Email, Phone).
* Donate custom amounts via Razorpay (Sandbox).
* View personal donation history (Success/Failed status).


* **Admin Dashboard:**
* View total registrations and funds raised.
* List all users with search filtering.
* Export user data as CSV.
* View detailed donation logs.


* **Payment Handling:** Secure verification of payments; tracks failed and pending transactions.

## Tech Stack

* **Frontend:** React 18, Vite, Axios
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Atlas)
* **Payments:** Razorpay (Test Mode)

## Local Installation

To run this project, you need to open **two separate terminals**.

### 1. Backend Setup (Terminal 1)

Navigate to the server folder and install dependencies:

```bash
cd server
npm install

```

Create a file named `.env` inside the `server` folder with the following:

```env
MONGO_URI=mongodb+srv://<your_connection_string>
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

```

**Start the Backend Server:**

```bash
npx nodemon index.js

```

*(Keep this terminal open)*

### 2. Frontend Setup (Terminal 2)

Open a **new terminal**, navigate to the client folder, and install dependencies:

```bash
cd client
npm install

```

Create a file named `.env` inside the `client` folder:

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

```

**Start the Frontend Application:**

```bash
npm run dev

```

*(Ctrl + Click the link shown, usually http://localhost:5173)*

## Default Access Credentials

**1. Administrator**
To register as an Admin, select "Administrator" in the signup form.

* **Secret Key Required:** `NGO_ADMIN`
* **Demo Login:**
* Email: `admin1@iitr.ac.in`
* Password: `admin1`



**2. User / Donor**

* Select "Donor / Student" in the signup form.
* No key required.

## Project Structure

```text
server/
  models/
    User.js
    Donation.js
  routes/
    auth.js
    admin.js
    payment.js
  index.js

client/
  src/
    assets/
    pages/
      Home.jsx
      Login.jsx
      Register.jsx
      UserDashboard.jsx
      AdminDashboard.jsx     
    api.js
    App.jsx
    main.jsx
    Navbar.jsx

```

## API Endpoints

### Auth

* `POST /api/auth/register` - Register new user/admin
* `POST /api/auth/login` - Login and get token

### Payment

* `POST /api/payment/checkout` - Create Razorpay order
* `POST /api/payment/verify` - Verify payment signature
* `GET /api/payment/my-donations/:userId` - Get user history

### Admin

* `GET /api/admin/stats` - Get total users & funds
* `GET /api/admin/users` - List all registered users
* `GET /api/admin/donations` - List all transactions

## Frontend Routes

* `/` - Landing Page (Hero Section)
* `/Login` - Login Page with Demo Credentials
* `/Register` - Registration Page
* `/UserDashboard` - User Dashboard (Donation & History)
* `/AdminDashboard` - Admin Dashboard (Stats & Records)