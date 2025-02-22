"use client"

import { useState } from "react"
import { useRouter } from "next/router"
import styles from "../../styles/FormCreation.module.css"

export default function CreateForm() {
  const [title, setTitle] = useState("")
  const [questions, setQuestions] = useState([])
  const router = useRouter()

  const addQuestion = () => {
    setQuestions([...questions, { text: "", type: "text", options: [] }])
  }

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index][field] = value
    setQuestions(updatedQuestions)
  }

  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].options.push({ text: "" })
    setQuestions(updatedQuestions)
  }

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].options[optionIndex].text = value
    setQuestions(updatedQuestions)
  }

  const saveForm = async () => {
    const response = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, questions }),
    })
    if (response.ok) {
      router.push("/admin")
    }
  }

  return (
    <div className={styles.container}>
      <h1>Create Form</h1>
      <input
        type="text"
        placeholder="Form Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={styles.input}
      />
      {questions.map((question, qIndex) => (
        <div key={qIndex} className={styles.questionContainer}>
          <input
            type="text"
            placeholder={`Question ${qIndex + 1}`}
            value={question.text}
            onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
            className={styles.input}
          />
          <select
            value={question.type}
            onChange={(e) => updateQuestion(qIndex, "type", e.target.value)}
            className={styles.select}
          >
            <option value="text">Text</option>
            <option value="radio">Single Choice</option>
            <option value="checkbox">Multiple Choice</option>
          </select>
          {(question.type === "radio" || question.type === "checkbox") && (
            <>
              <button onClick={() => addOption(qIndex)} className={styles.button}>
                Add Option
              </button>
              {question.options.map((option, oIndex) => (
                <input
                  key={oIndex}
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  value={option.text}
                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                  className={styles.input}
                />
              ))}
            </>
          )}
        </div>
      ))}
      <button onClick={addQuestion} className={styles.button}>
        Add Question
      </button>
      <button onClick={saveForm} className={styles.button}>
        Save Form
      </button>
    </div>
  )
}

