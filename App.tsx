import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { PublicStack, PrivateStack } from "./src/navigation/AppNavigator";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import SplashScreen from "./src/screens/SplashScreen";

function Root() {
  const { user, initializing } = useAuth();

  if (initializing) return <SplashScreen />;

  return user ? <PrivateStack /> : <PublicStack />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Root />
      </NavigationContainer>
    </AuthProvider>
  );
}