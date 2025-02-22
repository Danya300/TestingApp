"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, Button, StyleSheet } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { RadioButton } from "react-native-paper"

export default function FormCompletionScreen({ route, navigation }) {
  const { formId } = route.params
  const [form, setForm] = useState(null)
  const [answers, setAnswers] = useState({})

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
          const initialAnswers = {}
          foundForm.questions.forEach((q) => {
            initialAnswers[q.id] = ""
          })
          setAnswers(initialAnswers)
        }
      }
    } catch (error) {
      console.error("Error loading form:", error)
    }
  }

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value })
  }

  const calculateResults = () => {
    // This is a simple example. You can implement more complex logic here.
    const totalQuestions = form.questions.length
    const answeredQuestions = Object.values(answers).filter((a) => a !== "").length
    const completionPercentage = (answeredQuestions / totalQuestions) * 100

    return `You've completed ${completionPercentage.toFixed(2)}% of the form.`
  }

  const submitForm = async () => {
    try {
      const results = calculateResults()
      // You can save the results to AsyncStorage here if needed

      // Display results to the user
      alert(results)
      navigation.goBack()
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  if (!form) {
    return <Text>Loading...</Text>
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{form.title}</Text>
      {form.questions.map((question, index) => (
        <View key={question.id} style={styles.questionContainer}>
          <Text style={styles.questionText}>{`${index + 1}. ${question.text}`}</Text>
          <RadioButton.Group onValueChange={(value) => handleAnswer(question.id, value)} value={answers[question.id]}>
            {question.options.map((option) => (
              <RadioButton.Item key={option.id} label={option.text} value={option.id} />
            ))}
          </RadioButton.Group>
        </View>
      ))}
      <Button title="Submit" onPress={submitForm} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 10,
  },
})

