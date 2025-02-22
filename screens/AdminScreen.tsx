"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, Button, StyleSheet } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function AdminScreen({ navigation }) {
  const [forms, setForms] = useState([])

  useEffect(() => {
    loadForms()
  }, [])

  const loadForms = async () => {
    try {
      const storedForms = await AsyncStorage.getItem("forms")
      if (storedForms) {
        setForms(JSON.parse(storedForms))
      }
    } catch (error) {
      console.error("Error loading forms:", error)
    }
  }

  const deleteForm = async (id) => {
    const updatedForms = forms.filter((form) => form.id !== id)
    setForms(updatedForms)
    try {
      await AsyncStorage.setItem("forms", JSON.stringify(updatedForms))
    } catch (error) {
      console.error("Error deleting form:", error)
    }
  }

  return (
    <View style={styles.container}>
      <Button title="Create New Form" onPress={() => navigation.navigate("FormCreation")} />
      <FlatList
        data={forms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.formItem}>
            <Text>{item.title}</Text>
            <Button title="Edit" onPress={() => navigation.navigate("FormEdit", { formId: item.id })} />
            <Button title="Delete" onPress={() => deleteForm(item.id)} color="red" />
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  formItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
})

