import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import BinScreen from "../screens/BinScreen";
import ItemScreen from "../screens/ItemScreen";

export type RootStackParamList = {
    Login: undefined;
    Bins: undefined;
    Items: { binId: string };
};

const Public = createNativeStackNavigator<RootStackParamList>();
export const PublicStack = () => (
    <Public.Navigator>
        <Public.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
        />
    </Public.Navigator>
);

const Private = createNativeStackNavigator<RootStackParamList>();
export const PrivateStack = () => (
    <Private.Navigator>
        <Private.Screen
            name="Bins"
            component={BinScreen}
            options={{ title: "My Bins" }}
        />
        <Private.Screen name="Items" component={ItemScreen} />
    </Private.Navigator>
);