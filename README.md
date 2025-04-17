Procrew E-commerce Application

Overview

The Procrew E-commerce Application is a full-stack web application built with React, Vite, and Tailwind CSS for the frontend, and a JSON-based backend hosted on my-json-server.typicode.com. The app supports user authentication, product browsing, cart management, and admin functionalities. It is deployed on Netlify for easy access.

Features





User Authentication: Login and registration (mocked due to backend limitations).



Product Catalog: Browse products by category and view detailed product information.



Cart Management: Add, update, and remove items from the cart (for authenticated users).



Admin Dashboard: Manage products and view user orders (admin role only).



Responsive Design: Optimized for both desktop and mobile devices using Tailwind CSS.



Internationalization: Supports multiple languages via react-i18next.



Protected Routes: Restricts access to certain pages (e.g., /products, /cart) for authenticated users.

Credentials

To test the application, use the following login credentials:





Admin:





Email: admin@example.com



Password: password123



User:





Email: user@example.com



Password: 123456789

Note: Registration is currently mocked due to the read-only nature of the backend (my-json-server.typicode.com). Use the provided credentials to log in.

Deployment

The application is deployed on Netlify and can be accessed at:
https://procrew-e-commerce.netlify.app/login

Repository





Frontend: https://github.com/Mohamed-Fawzy15/Procrew-E-commerce-app



Backend: https://github.com/Mohamed-Fawzy15/Mohamed-Fawzy15-Procrew-db

Tech Stack





Frontend:





React (^19.0.0)



Vite (^6.2.0) for build and development



Tailwind CSS (^4.1.3) for styling



React Router (^7.5.0) for client-side routing



Axios (^1.8.4) for API requests



React Hook Form (^7.55.0) and Zod (^3.24.2) for form validation



React i18next (^15.4.1) for internationalization



Backend:





JSON Server (via my-json-server.typicode.com) for mock API



Data stored in db.json (users, products, cart)



Deployment:





Netlify for hosting the frontend



Tools:





ESLint (^9.21.0) for linting



Chart.js (^4.4.9) for data visualization



SweetAlert2 (^11.18.0) for alerts
