"use client"

import { useState } from "react"
import { View, TextInput, Button, ScrollView, StyleSheet } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { v4 as uuidv4 } from "uuid"

export default function FormCreationScreen({ navigation }) {
  const [title, setTitle] = useState("")
  const [questions, setQuestions] = useState([])

  const addQuestion = () => {
    setQuestions([...questions, { id: uuidv4(), text: "", type: "text", options: [] }])
  }

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  const addOption = (questionId) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, options: [...q.options, { id: uuidv4(), text: "" }] } : q)),
    )
  }

  const updateOption = (questionId, optionId, value) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.map((o) => (o.id === optionId ? { ...o, text: value } : o)) }
          : q,
      ),
    )
  }

  const saveForm = async () => {
    try {
      const newForm = { id: uuidv4(), title, questions }
      const storedForms = await AsyncStorage.getItem("forms")
      const forms = storedForms ? JSON.parse(storedForms) : []
      forms.push(newForm)
      await AsyncStorage.setItem("forms", JSON.stringify(forms))
      navigation.goBack()
    } catch (error) {
      console.error("Error saving form:", error)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <TextInput style={styles.input} placeholder="Form Title" value={title} onChangeText={setTitle} />
      {questions.map((question, index) => (
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
      <Button title="Add Question" onPress={addQuestion} />
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

