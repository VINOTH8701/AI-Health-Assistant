# AI Health Assistant

An AI-powered web application designed to provide general health information, symptom guidance, and convenient health management tools through a user-friendly interface.

## About the Project

AI Health Assistant is a web-based platform that brings multiple health-related features together in one place. Users can explore AI-assisted symptom analysis, manage health-related history, access medicine reminders, view hospital locations, and use other health tools.

The application aims to make general health information more accessible while providing a convenient interface for everyday health management. AI-generated information is intended for informational purposes and does not replace professional medical advice or diagnosis.

## Features

- **AI Symptom Analysis:** Provides AI-assisted information based on user-entered symptoms.
- **User Authentication:** Provides registration and login interfaces.
- **Dashboard:** Offers a central place to access health-related features.
- **Health History:** Provides an interface for reviewing health-related records.
- **Medicine Reminders:** Helps users organize medicine schedules.
- **User Profile:** Provides access to personal profile information.
- **Hospital Map:** Offers a map interface for finding healthcare facilities.
- **Health Tools:** Organizes additional health-related utilities.
- **Admin Dashboard:** Provides an interface for administrative functions.
- **Responsive Interface:** Uses a modern web interface designed for convenient navigation.

*Feature availability depends on the corresponding backend services and integrations being configured.*

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- React.js
- Vite

### Backend
- Node.js
- Express.js

### Database
- MongoDB (where database integration is configured)

### AI Integration
- Gemini API integration point for AI-assisted functionality

### Development Tools
- Visual Studio Code
- Git
- GitHub
- npm

## Project Structure

```text
AI-Health-Assistant/
├── public/
├── server/
│   ├── index.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Installation and Setup

### Prerequisites

Install the following before running the project:

- Node.js and npm
- Git
- A code editor such as Visual Studio Code

### 1. Clone the Repository

```bash
git clone https://github.com/VINOTH8701/AI-Health-Assistant.git
```

### 2. Open the Project Folder

```bash
cd AI-Health-Assistant
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### 5. Configure Environment Variables

Create the required `.env` files locally, based on the variables used by the application code.

For example:

```env
PORT=5000
GEMINI_API_KEY=your_api_key_here
MONGODB_URI=your_mongodb_connection_string
```

These are example variable names. Confirm the actual names and requirements in your source code before running the application.

**Security:** Never upload real API keys, database passwords, or `.env` files to GitHub. Keep secrets on the server side and configure them securely.

### 6. Run the Frontend

```bash
npm run dev
```

Vite will display the local development URL in the terminal, commonly `http://localhost:5173`.

### 7. Run the Backend

Open a second terminal:

```bash
cd server
node server.js
```

Use the actual backend entry point and start command configured in your project if they differ from this example.

## Application Workflow

1. Users open the application in a web browser.
2. They access available features through the navigation interface.
3. Users can enter symptoms to request AI-assisted health information.
4. The application processes requests through the relevant frontend services and backend integrations.
5. Users can access health history, medicine reminders, profiles, hospital maps, and other available tools.
6. Configured services handle data storage and retrieval where implemented.

## Benefits

- Combines several health-related tools in one platform.
- Provides convenient access to general health information.
- Offers a structured and user-friendly interface.
- Supports modular development and future enhancements.
- Provides a foundation for integrating additional AI-assisted features.

## Future Enhancements

- Improve AI-assisted health guidance and safety checks.
- Add secure health-record storage and retrieval.
- Implement configurable reminders and notifications.
- Improve hospital search and location-based services.
- Add multilingual support, including Tamil.
- Enhance accessibility and mobile responsiveness.
- Strengthen authentication and role-based access control.

## Disclaimer

AI Health Assistant is intended for general informational and wellness support. It is not a medical device and must not be used as a substitute for professional diagnosis, treatment, or emergency care. Users should consult qualified healthcare professionals for medical concerns.

## Author

**Vinoth M**

GitHub: [VINOTH8701](https://github.com/VINOTH8701)

## License

No license has been specified yet. Add a license if you intend to define how others may use, modify, and distribute this project.
