import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
        setLoading(true);
        // App.tsx switches to the bins screen when the auth state changes
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        Alert.alert("Login Failed", error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
        <Text style={styles.title}>VaultViewer Login</Text>
        <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
        />
        <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
        />
        <Button title={loading ? "Logging in..." : "Login"} onPress={handleLogin} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: "center", 
        padding: 20 
    },
    title: { 
        fontSize: 24, 
        fontWeight: "bold", 
        marginBottom: 20, 
        textAlign: "center" 
    },
    input: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
});

export default LoginScreen;
