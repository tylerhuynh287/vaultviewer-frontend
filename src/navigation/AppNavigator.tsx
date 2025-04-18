import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import BinScreen from "../screens/BinScreen";
import ItemScreen from "../screens/ItemScreen";

export type RootStackParamList = {
    Login: undefined;
    Bins: undefined;
    Items: { binId: string };
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
                    options={{ title: "My Bins" }}
                />
                <Stack.Screen
                    name="Items"
                    component={ItemScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}