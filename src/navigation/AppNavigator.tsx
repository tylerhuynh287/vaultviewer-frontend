import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import BinScreen from "../screens/BinScreen";

export type RootStackParamList = {
    Login: undefined;
    Bins: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen 
                    name="Login" 
                    component={LoginScreen} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen
                    name="Bins"
                    component={BinScreen}
                    options={{ title: "My Bins" }}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}