"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { v4 as uuidv4 } from "uuid"

export default function FormEditScreen({ route, navigation }) {
  const { formId } = route.params
  const [form, setForm] = useState(null)

  useEffect(() => {
    loadForm()
  }, [])

  const loadForm = async () => {
    try {
      const storedForms = await AsyncStorage.getItem("forms")
      if (storedForms) {
        const forms = JSON.parse(storedForms)
        const foundForm = forms.find((f) => f.id === formId)
        if (foundForm) {
          setForm(foundForm)
        }
      }
    } catch (error) {
      console.error("Error loading form:", error)
    }
  }

  const updateForm = (field, value) => {
    setForm({ ...form, [field]: value })
  }

  const updateQuestion = (id, field, value) => {
    setForm({
      ...form,
      questions: form.questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    })
  }

  const addOption = (questionId) => {
    setForm({
      ...form,
      questions: form.questions.map((q) =>
        q.id === questionId ? { ...q, options: [...q.options, { id: uuidv4(), text: "" }] } : q,
      ),
    })
  }

  const updateOption = (questionId, optionId, value) => {
    setForm({
      ...form,
      questions: form.questions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.map((o) => (o.id === optionId ? { ...o, text: value } : o)) }
          : q,
      ),
    })
  }

  const saveForm = async () => {
    try {
      const storedForms = await AsyncStorage.getItem("forms")
      if (storedForms) {
        const forms = JSON.parse(storedForms)
        const updatedForms = forms.map((f) => (f.id === form.id ? form : f))
        await AsyncStorage.setItem("forms", JSON.stringify(updatedForms))
      }
      navigation.goBack()
    } catch (error) {
      console.error("Error saving form:", error)
    }
  }

  if (!form) {
    return <Text>Loading...</Text>
  }

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Form Title"
        value={form.title}
        onChangeText={(text) => updateForm("title", text)}
      />
      {form.questions.map((question, index) => (
        <View key={question.id} style={styles.questionContainer}>
          <TextInput
            style={styles.input}
            placeholder={`Question ${index + 1}`}
            value={question.text}
            onChangeText={(text) => updateQuestion(question.id, "text", text)}
          />
          <Button title="Add Option" onPress={() => addOption(question.id)} />
          {question.options.map((option) => (
            <TextInput
              key={option.id}
              style={styles.input}
              placeholder="Option"
              value={option.text}
              onChangeText={(text) => updateOption(question.id, option.id, text)}
            />
          ))}
        </View>
      ))}
      <Button title="Save Form" onPress={saveForm} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  questionContainer: {
    marginBottom: 20,
  },
})

