Cinezo is a subscription-based entertainment platform that provides users access to a wide range of movies, TV shows, and other media content. The platform is built with a focus on security and scalability, integrating advanced technologies like Public Key Infrastructure (PKI) and Zero-Knowledge Proof (ZKP) to enhance security and user privacy.

Key Objectives

- Security: Implementation of advanced security protocols, including PKI and ZKP, to ensure user data privacy and secure transactions.
- Scalability: Built with technologies that allow easy scaling to accommodate a growing user base.
- User Experience: A sleek and intuitive interface to enhance user engagement and satisfaction.
____________________________________________________________________________________________________________________________________________________________

Features

- Subscription Management: Users can manage their subscriptions, including plan upgrades, renewals, and cancellations.
- Secure Access: Uses PKI for certificate-based authentication and ZKP for secure verification without revealing sensitive information.
- Content Library: A vast collection of movies and TV shows, categorized and searchable.
- User Dashboard: Personalized user dashboard with viewing history, recommendations, and account settings.
________________________________________________________________________________________________________________________________________________________________

Technology Stack

- Backend: Express (Node.js Framework), MongoDB (NoSQL Database)
- Frontend: React JS (JavaScript Library), CSS (Styling)
- Security: PKI (Public Key Infrastructure), ZKP (Zero-Knowledge Proof)
- Other Dependencies:
        Mongoose: For MongoDB object modeling
        CORS: Middleware for enabling CORS
        body-parser: Middleware for parsing JSON, URL-encoded, and multipart bodies
        snarkjs: For implementing ZKP
        crypto: For cryptographic operations
        fs, path: For file and path operations
______________________________________________________________________________________________________________________________________________________________________

System Architecture
    
The Cinezo platform is built on a multi-tier architecture, ensuring separation of concerns and efficient management of different components:

- Frontend: Built using React JS, providing a dynamic and responsive user interface.
- Backend: Developed using Express, managing API requests, user authentication, and business logic.
- Database: MongoDB is used to store user data, subscription details, and content metadata.
- Security Layer: Integrated PKI and ZKP mechanisms to enhance the security of user transactions and data access.
_______________________________________________________________________________________________________________________________________________________________________

Installation
    
Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- Git

______________________________________________________________________________________________________________________________________________________________________
Setup

Clone the Repository

    git clone https://github.com/yourusername/cinezo.git
    cd cinezo

Install Dependencies

    npm install

Run the Application

    npm run dev
 
Access the Application
    
    Open your browser and navigate to http://localhost:5000.

Usage
    
User Registration and Login: Users can sign up and log in to their accounts using their email and password. The registration process includes certificate-based authentication for enhanced security. 

Subscription Management: Once logged in, users can manage their subscriptions, including selecting plans, renewing subscriptions, and canceling them.

Browsing and Streaming: Users can browse the content library, search for movies or TV shows, and start streaming with just a click.

___________________________________________________________________________________________________________________________________________________
Demo:


https://github.com/user-attachments/assets/be537aa0-3a3b-4704-bf6e-fd17020a60b2



