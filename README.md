# **Digital Asset Request Form for Marketing Teams**

## Repository Information
This project is hosted on GitHub

### Frontend  
[GitHub](https://github.com/StefanyLopez/Frontend_adidas_ignite)

### Backend  
[GitHub](https://github.com/danniiell/Backend_Adidas_ignite)

---

## **Project Description**
This project enables marketing teams to view a digital asset gallery and submit requests for use. Administrators can manage these requests via a dedicated dashboard, approving or rejecting them as needed.

---

## Project Objectives

### Technical
- Develop a lightweight web gallery for digital assets.
- Implement a request system with fields like asset type, purpose, and deadline.
- Create an admin panel to review, approve, or reject requests.
- Integrate automatic email notifications upon status changes.

### User Experience
- Search and filter by keyword and file type.
- Multi-selection of assets with preview (dimensions, size).
- Admin login with secure authentication.
- On-screen visual notifications.

### Design & Accessibility
- Responsive interface for desktop and tablet.
- Intuitive navigation for users and admins.
- Error handling with clear and friendly messages.
- Security: form validation and secure authentication.

### Scalability
- Prepared to support new file types and future functionalities.

---

## **Technologies Used**

| Area         | Technology            |
|--------------|------------------------|
| Frontend     | React + Tailwind CSS   |
| Backend      | Node.js + Express      |
| Design       | Figma                  |
| Database     | JSON Files             |

---

## System Requirements

```bash
Install Node.js
```

---

## **Project Setup**

Install all dependencies from the root:
```bash
npm install
```

### Backend
```bash
cd backend
$env:DEBUG='myapp:*'; npm start
```

### Frontend
```bash
cd frontend
npm run dev
```

---

### Backend Dependencies

```json
"dependencies": {
  "cookie-parser": "~1.4.4",
  "cors": "^2.8.5",
  "debug": "~2.6.9",
  "express": "~4.16.1",
  "http-errors": "~1.6.3",
  "jade": "~1.11.0",
  "morgan": "~1.9.1",
  "nodemailer": "^7.0.5",
  "swagger-jsdoc": "^6.2.8",
  "swagger-ui-express": "^5.0.1",
  "uuid": "^11.1.0"
}
```

### Frontend Dependencies

```json
"dependencies": {
  "@splinetool/react-spline": "^4.1.0",
  "@tailwindcss/vite": "^4.1.11",
  "axios": "^1.11.0",
  "framer-motion": "^12.23.11",
  "gsap": "^3.13.0",
  "lucide-react": "^0.534.0",
  "next": "^15.4.4",
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-router-dom": "^7.7.1",
  "tailwindcss": "^4.1.11"
}
```

---

## System Testing

Interactive access:  
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## API Endpoints

### Create New Request  
**POST** `/test/requests`

**Request body**:
```json
{
  "id": "b1adb1c4-d37e-4a40-9caa-9c74be99bb97",
  "requesterName": "Santiago",
  "requesterEmail": "ing.daniel@gmail.com",
  "purpose": "SUMMER PROMO",
  "deadline": "2025-08-21",
  "items": ["video-video1.mp4", "audio-audio1.mp3"],
  "status": "Pending",
  "adminComments": "Approved",
  "createdAt": "2025-07-30T01:44:23.262Z",
  "updatedAt": "2025-07-30T23:51:19.624Z"
}
```

- **201 Created** – Request created successfully  
- **400 Bad Request** – Missing required fields  

---

### Get All Requests  
**GET** `/test/requests`

- **200 OK** – List of requests  
- **204 No Content** – No requests available  

---

### Update Request Status  
**PATCH** `/test/requests/:id`

**Request body**:
```json
{
  "status": "Approved",
  "adminComments": "Approved for August campaign"
}
```

- **200 OK** – Request updated  
- **404 Not Found** – Request not found  

---

### Create Admin Account  
**POST** `/admin/create`

**Request body**:
```json
{
  "email": "admin@example.com",
  "password": "secure123"
}
```

- **201 Created** – Admin created  
- **400 Bad Request** – Missing data  
- **409 Conflict** – Email already registered  

---

### Admin Login  
**POST** `/admin/login`

**Request body**:
```json
{
  "email": "admin@example.com",
  "password": "secure123"
}
```

- **200 OK** – Login successful  
- **400 Bad Request** – Missing data  
- **401 Unauthorized** – Invalid credentials  

---

### Simulate Email Sending (Mailtrap)  
**GET** `/test/requests/{id}/summary`

- **200 OK** – Email sent successfully  
- **400 Bad Request** – Request not yet approved or rejected  
- **404 Not Found** – Request not found  
- **500 Internal Server Error** – Failed to send email  

---

## Design Artifacts  
Design diagrams in Figma:  
[Figma](https://www.figma.com/design/15JgwGWGz6yvRMucaOumCD/Ignite---Adidas?node-id=13-2378&t=lyxVKhsICZcIc1OP-1)

---

## Project Timeline  
Gantt plan in ClickUp:  
[ClickUp](https://app.clickup.com/9014793560/v/s/90143359183)

---

## Known Issues and Future Improvements

- No critical functionality pending  
- Mobile responsiveness  
- Custom icons  
- Admin statistics  
- Email with file attachments  
- Admin account generation with unique identifiers  
- Access validation for authorized users on deployment  

---

## Additional Documentation

### Backend Structure

```
backend/
├── routes/
│   └── test.js
├── storage/
│   ├── adminStorage.js
│   └── fileStorage.js
├── app.js
├── adminusers.json
├── requests.json
├── package.json
├── public/
│   ├── videos/
│   ├── audios/
│   └── images/
├── views/
└── README.md
```

### Frontend Structure

```
frontend/
├── public/
│   └── logos/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Cart/
│   │   ├── Gallery/
│   │   └── ...
│   ├── hooks/
│   ├── pages/
│   ├── styles/
│   ├── utilities/
│   ├── App.jsx
│   ├── assetsData.js
│   ├── main.jsx
│   └── vite.env.d.tsx
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```