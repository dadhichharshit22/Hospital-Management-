
## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🕸️ [Snippets](#snippets)
6. 🔗 [Links](#links)
7. 🚀 [More](#more)

## <a name="introduction">🤖 Introduction</a>

The Hospital application stands as a comprehensive, full-stack platform for managing events. It serves as a hub, spotlighting diverse Hospital Website taking place globally. you have the capability to purchase tickets for any Doctor or even initiate and manage your own Doctors.

## <a name="tech-stack">⚙️ Tech Stack</a>

- Node.js
- TypeScript
- TailwindCSS
- Razporpay
- Redux
- React Hook Form
- Shadcn
- uploadthing

## <a name="features">🔋 Features</a>

👉 **Authentication (CRUD) with JWT:** User management through JWT Authentication, ensuring secure and efficient authentication.

👉 **Doctors (CRUD):** Comprehensive functionality for creating, reading, updating, and deleting Doctor, giving users full control over Hospital management.
- **Create Doctor:** Users can effortlessly generate new events, providing essential details such as title, date, location, and any additional information.
- **Appointement:** Seamless access to a detailed view of all Doctor list, allowing users to explore Doctor specifics, including descriptions, schedules, and related information.
- **Update Doctor Details:** Empowering users to modify event details dynamically, ensuring that event information remains accurate and up-to-date.
- **Delete Doctor:** A straightforward process for removing events from the system, giving administrators the ability to manage and curate the platform effectively.
        
👉 **Related Doctors:** Smartly connects events that are related and displaying on the event details page, making it more engaging for users
    
👉 **Organized Doctors:** Efficient organization of events, ensuring a structured and user-friendly display for the audience, i.e., showing events created by the user on the user profile
    
👉 **Search & Filter:** Empowering users with a robust search and filter system, enabling them to easily find the events that match their preferences.
    
👉 **New Category:** Dynamic categorization allows for the seamless addition of new event categories, keeping your platform adaptable.
    
👉 **Checkout and Pay with Stripe:** Smooth and secure payment transactions using Stripe, enhancing user experience during the checkout process.
    
👉 **Appointment Orders:** Comprehensive order management system, providing a clear overview of all event-related transactions.
    
👉 **Search Orders:** Quick and efficient search functionality for orders, facilitating easy tracking and management.

and many more, including code architecture and reusability 

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/your-username/your-project.git
cd your-project
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
PORT = Your Port Number
MONGODB_URI =  Your MongoDB URL
JWT_SECRET= your jwt_secret
EMAIL_USER = your email id
EMAIL_PASSWORD = your email password 
RAZORPAY_KEY_ID = your razorpay_key_id
RAZORPAY_KEY_SECRET = your razorpay_secret_key
CORS_ORIGIN= your frontend url
CLOUDINARY_NAME = your cloudinary name
CLOUDINARY_API_KEY = your cloudinary_api_key
CLOUDINARY_SECRET_KEY= your cloudinary_secret_key
VITE_BACKEND_URL= your backend url
```

Replace the placeholder values with your actual credentials 

**Running the Project**

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.


