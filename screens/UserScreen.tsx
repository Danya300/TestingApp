"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, Button, StyleSheet } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function UserScreen({ navigation }) {
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

  return (
    <View style={styles.container}>
      <FlatList
        data={forms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.formItem}>
            <Text>{item.title}</Text>
            <Button title="Start" onPress={() => navigation.navigate("FormCompletion", { formId: item.id })} />
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

