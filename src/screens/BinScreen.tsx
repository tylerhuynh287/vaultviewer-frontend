import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, TextInput, Button, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

type Bin = {
    binId: string;
    name: string;
};

export default function BinScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { signOut } = useAuth();

    const [bins, setBins] = useState<Bin[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newBinName, setNewBinName] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <Button title="Sign out" onPress={signOut} />,
        });
    }, [navigation, signOut]);

    const fetchBins = async () => {
        try {
            setLoading(true);
            const { bins } = await api.getBins();
            setBins(bins || []);
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
            await api.createBin(newBinName.trim());
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
        <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate("Items", { binId: item.binId })}
        >
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
                    onPress={() => setShowModal(true)}
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
}

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
    },
});


