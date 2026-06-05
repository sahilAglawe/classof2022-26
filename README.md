# 🎓 Class of 2022-26: Digital Yearbook & Memory Archive

A premium, interactive digital yearbook and memory archive built with **React**, **Vite**, **Tailwind CSS**, and **Firebase**. This application serves as a collaborative platform for college cohorts to preserve memories, sign yearbooks, share media, and document their shared college journey.

---

## 🌟 Key Features

*   **⏳ Interactive Journey Timeline**: A curated, visual timeline documenting key milestones, events, exams, and celebrations from day one to graduation.
*   **✍️ Digital Yearbook**: Write messages on classmates' yearbooks, customize student profiles, and share heartfelt notes.
*   **🖼️ Media Vault**: A collaborative, high-performance gallery for uploading and browsing shared memory photos, powered by Cloudinary.
*   **💬 The Wall**: A real-time message board for sharing thoughts, announcements, inside jokes, and daily updates.
*   **🔒 Secure Registration & Approval**: Dual-role architecture (Students and Admins) with email-notified approval workflows powered by EmailJS.
*   **🛠️ Admin Dashboard**: Dedicated moderation panel to review registration requests, manage user approval states, and moderate user content.
*   **👤 My Content Panel**: A personalized panel where users can review, edit, and manage their uploaded photos and yearbook signatures.

---

## 🛠️ Tech Stack

*   **Frontend Framework**: React 19 + Vite (for lightning-fast builds and hot reloading)
*   **Styling**: Tailwind CSS (with modern, glassmorphic dark-theme aesthetics)
*   **Database & Authentication**: Firebase (Firestore Database & Firebase Auth)
*   **Image Storage**: Cloudinary (optimized cloud storage & transformation delivery)
*   **Email Deliverability**: EmailJS (sending real-time notification emails to students when registered, approved, or rejected)

---

## 🚀 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   A Firebase Project
*   A Cloudinary account (for media storage)
*   An EmailJS account (for email alerts)

### Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/sahilAglawe/classof2022-26.git
    cd classof2022-26
    ```

2.  **Install Dependencies**:
    ```bash
    # Install frontend dependencies
    cd frontend
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file inside the `frontend` folder and fill in your cloud service credentials:
    ```env
    # Firebase Configuration
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_firebase_app_id
    VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

    # Cloudinary Configuration
    VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset

    # EmailJS Configuration
    VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
    VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
    VITE_EMAILJS_TEMPLATE_PENDING=your_template_pending_id
    VITE_EMAILJS_TEMPLATE_DECISION=your_template_decision_id
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

---

## 🌐 Deployment (Firebase Hosting)

Deploy updates to production with a single command from the project root:

```bash
# Build the React application and deploy it to hosting
npm run build && npm run deploy
```

---

## 📄 License

This project is licensed under the MIT License.
