# VaultViewer Mobile Frontend

A React Native (Expo CLI) frontend for the VaultViewer app – a QR-coded digital storage catalog system to manage physical storage bins and their items.

## Features
- **Authentication**: Firebase login with token-based access.
- **Bin Management**: Create and view storage bins.
- **Item Management**: Add and view items within each bin.
- **Modal-Based Input**: Clean modal forms for new bins and items.
- **Secure API Communication**: Auth tokens used to access backend routes.
- **Mobile-First UI**: Built and styled with scalability in mind.

## Technologies Used
- **React Native (Expo)**
- **Firebase Authentication**
- **TypeScript**
- **Fetch API**
- **React Navigation**

## Developer Notes
- This frontend uses `http://localhost:5000` for development purposes and is not configured for production.
- Firebase API keys are handled securely through `.env` using `EXPO_PUBLIC_` variables.
- API calls expect a valid ID token from Firebase Auth.

## Status
- Functional and stable for core bin and item operations.
- Designed as a foundation for future enhancements like editing and deletion features.
