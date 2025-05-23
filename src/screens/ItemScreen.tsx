import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert, TouchableOpacity, Modal, TextInput, Button } from "react-native";
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

    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const user = auth.currentUser;
                if (!user) throw new Error("User not authenticated");

                const token = await user.getIdToken();

                const response = await fetch (`http://localhost:5000/api/items/${binId}`, {
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

    const handleAddItem = async () => {
        if (!name.trim()) {
            Alert.alert("Validation Error", "Item name is required.");
            return;
        }

        try {
            const user = auth.currentUser;
            if(!user) throw new Error("User not authenticated");

            const token = await user.getIdToken();

            const response = await fetch(`http://localhost:5000/api/items/${binId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    category,
                    quantity: parseInt(quantity) || 0,
                    notes, 
                }),
            });

            if (!response.ok) throw new Error(`Server Error: ${response.status}`);

            const updated = await response.json();
            setItems(updated.items || []);

            setName('');
            setCategory('');
            setQuantity('');
            setNotes('');
            setModalVisible(false);
        } catch (error: any) {
            Alert.alert("Error adding item", error.message);
        }
    };

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

            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{
                    position:'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: '#007bff',
                    borderRadius: 20,
                    padding: 10,
                    zIndex: 1,
                }}
            >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ Item</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View 
                    style={{
                        flex: 1, 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        backgroundColor: '#000000aa' 
                    }}
                >
                    <View 
                        style={{
                            width: '90%',
                            backgroundColor: '#fff',
                            padding: 20,
                            borderRadius: 10
                        }}
                    >
                        <Text
                            style ={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                marginBottom: 10
                            }}
                        >Add New Item</Text>

                        <TextInput 
                            placeholder="Name" 
                            value={name} 
                            onChangeText={setName} 
                            style={{ 
                                marginBottom: 10, 
                                borderBottomWidth: 1 
                            }} 
                        />
                        <TextInput
                            placeholder="Category"
                            value={category}
                            onChangeText={setCategory}
                            style={{
                                marginBottom: 10, borderBottomWidth: 1
                            }}
                        />
                        <TextInput
                            placeholder="Quantity" 
                            value={quantity} 
                            onChangeText={setQuantity}
                            keyboardType="numeric"
                            style={{
                                marginBottom: 10,
                                borderBottomWidth: 1
                            }}
                        />
                        <TextInput
                            placeholder="Notes"
                            value={notes} 
                            onChangeText={setNotes}
                            multiline style={{
                                marginBottom: 10,
                                borderBottomWidth: 1
                            }}
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Button title="Cancel" onPress={() => setModalVisible(false)} />
                            <View style={{ width: 10}} />
                            <Button title="Add" onPress={handleAddItem} />
                        </View>
                    </View>
                </View>
            </Modal>
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