"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import styles from "../../../styles/FormCompletion.module.css"

export default function CompleteForm() {
  const [form, setForm] = useState(null)
  const [answers, setAnswers] = useState({})
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (id) {
      fetchForm()
    }
  }, [id])

  const fetchForm = async () => {
    const response = await fetch(`/api/forms/${id}`)
    const data = await response.json()
    setForm(data)
    const initialAnswers = {}
    data.questions.forEach((q) => {
      initialAnswers[q.id] = q.type === "checkbox" ? [] : ""
    })
    setAnswers(initialAnswers)
  }

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => {
      if (form.questions.find((q) => q.id === questionId).type === "checkbox") {
        const currentAnswers = prev[questionId]
        if (currentAnswers.includes(value)) {
          return { ...prev, [questionId]: currentAnswers.filter((v) => v !== value) }
        } else {
          return { ...prev, [questionId]: [...currentAnswers, value] }
        }
      }
      return { ...prev, [questionId]: value }
    })
  }

  const submitForm = async () => {
    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formId: id, answers }),
    })
    if (response.ok) {
      const result = await response.json()
      alert(`Your score: ${result.score}`)
      router.push("/user")
    }
  }

  if (!form) return <div>Loading...</div>

  return (
    <div className={styles.container}>
      <h1>{form.title}</h1>
      {form.questions.map((question) => (
        <div key={question.id} className={styles.questionContainer}>
          <p>{question.text}</p>
          {question.type === "text" && (
            <input
              type="text"
              value={answers[question.id]}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              className={styles.input}
            />
          )}
          {question.type === "radio" && (
            <div className={styles.optionsContainer}>
              {question.options.map((option) => (
                <label key={option.id} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name={question.id}
                    value={option.id}
                    checked={answers[question.id] === option.id}
                    onChange={() => handleAnswer(question.id, option.id)}
                    className={styles.radioInput}
                  />
                  {option.text}
                </label>
              ))}
            </div>
          )}
          {question.type === "checkbox" && (
            <div className={styles.optionsContainer}>
              {question.options.map((option) => (
                <label key={option.id} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    value={option.id}
                    checked={answers[question.id].includes(option.id)}
                    onChange={() => handleAnswer(question.id, option.id)}
                    className={styles.checkboxInput}
                  />
                  {option.text}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
      <button onClick={submitForm} className={styles.button}>
        Submit
      </button>
    </div>
  )
}

