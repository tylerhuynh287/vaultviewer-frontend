import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { auth } from "../firebase";
import { RootStackParamList } from "../navigation/AppNavigator";

type ItemScreenRouteProp = RouteProp<RootStackParamList, "Items">;

interface Item {
    itemId: string;
    name: string;
    category: string;
    quantity: number;
    notes?: string;
}

const ItemScreen = () => {
    const route = useRoute<ItemScreenRouteProp>();
    const { binId } = route.params;

    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const user = auth.currentUser;
                if (!user) throw new Error("User not authenticated");

                const token = await user.getIdToken();

                const response = await fetch (`http://localhost:5000/api/items/${user.uid}/${binId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error (`Error: ${response.status}`);

                const data = await response.json();
                setItems(data.items || []);
            } catch (error: any) {
                Alert.alert("Error loading items", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [binId]);

    const renderItem = ({ item }: { item: Item }) => (
        <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.details}>
                Qty: {item.quantity} | {item.category}
            </Text>
            {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Items in Bin: {binId}</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#555" />
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.itemId}
                    renderItem={renderItem}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff"
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16
    },
    card: {
        padding: 12,
        marginBottom: 12,
        backgroundColor: "#f9f9f9",
        borderRadius: 8
    },
    name: {
        fontSize: 16,
        fontWeight: "bold"
    },
    details: {
        color: "#666",
        marginTop: 4
    },
    notes: {
        fontStyle: "italic",
        marginTop: 4
    }
});

export default ItemScreen;