import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { auth } from "../firebase";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { TextInput } from "react-native-gesture-handler";
import { Button } from "react-native";

interface Bin {
    binId: string;
    name: string;
}

const BinScreen = () => {
    const [bins, setBins] = useState<Bin[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newBinName, setNewBinName] = useState("");
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


    const fetchBins = async () => {
        try {
            setLoading(true);

            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated");

            const token = await user.getIdToken();

            const response = await fetch ("http://localhost:5000/api/bins", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setBins(data.bins);
        } catch (error: any) {
            console.error("Error fetching bins:", error);
            Alert.alert("Error", error.message || "Failed to load bins.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBin = async () => {
        if (!newBinName.trim()) return;

        try {
            const user = auth.currentUser;
            if (!user) throw new Error ("Not authenticated");

            const token = await user.getIdToken();

            const response = await fetch("http://localhost:5000/api/bins", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: newBinName }),
            });

            if (!response.ok) throw new Error("Failed to create bin");

            setNewBinName("");
            setShowModal(false);
            fetchBins();
        } catch (error:any) {
            Alert.alert("Error", error.message);
        }
    };

    useEffect(() => {
        fetchBins();
    }, []);

    const renderItem = ({ item }: { item: Bin }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Items", { binId: item.binId })}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.count}>ID: {item.binId}</Text>
        </TouchableOpacity>
    );

    return (
        <>
            {showModal && (
                <View style={styles.modal}>
                    <Text style={styles.modalTitle}>Create New Bin</Text>
                    <TextInput
                        placeholder="Enter bin name"
                        style={styles.input}
                        value={newBinName}
                        onChangeText={setNewBinName}
                    />
                    <View style={styles.modalButtons}>
                        <Button title="Cancel" onPress={() => setShowModal(false)} />
                        <Button title="Create" onPress={handleCreateBin} />
                    </View>
                </View>
            )}

            <View style={styles.container}>
                <Text style={styles.header}>Your Storage Bins</Text>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        console.log("Pressed + Bin");
                        setShowModal(true);
                    }}
                >
                    <Text style={styles.addButtonText}>+ Bin</Text>
                </TouchableOpacity>

                {loading ? (
                    <ActivityIndicator size="large" color="#555" />
                ) : (
                    <FlatList
                        data={bins}
                        keyExtractor={(item) => item.binId}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingBottom: 30 }}
                    />
                )}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    header: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    card: { padding: 16, backgroundColor: "#f5f5f5", marginBottom: 12, borderRadius: 8, elevation: 2},
    title: { fontSize: 18, fontWeight: "bold" },
    count: { marginTop: 4, color: "#666" },
    modal: {
        position: "absolute",
        top: "30%",
        left: "5%",
        right: "5%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2},
        shadowRadius: 5,
        elevation: 10,
        zIndex: 1000
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
        textAlign: "center"
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 6,
        marginBottom: 12
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    addButton: {
        alignSelf: "flex-end",
        backgroundColor: "#007aff",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginBottom: 10
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    }
});

export default BinScreen;
