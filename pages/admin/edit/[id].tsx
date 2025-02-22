"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"

export default function EditForm() {
  const [form, setForm] = useState(null)
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
  }

  const updateForm = (field, value) => {
    setForm({ ...form, [field]: value })
  }

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...form.questions]
    updatedQuestions[index][field] = value
    setForm({ ...form, questions: updatedQuestions })
  }

  const addOption = (questionIndex) => {
    const updatedQuestions = [...form.questions]
    updatedQuestions[questionIndex].options.push({ text: "" })
    setForm({ ...form, questions: updatedQuestions })
  }

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...form.questions]
    updatedQuestions[questionIndex].options[optionIndex].text = value
    setForm({ ...form, questions: updatedQuestions })
  }

  const saveForm = async () => {
    const response = await fetch(`/api/forms/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (response.ok) {
      router.push("/admin")
    }
  }

  if (!form) return <div>Loading...</div>

  return (
    <div>
      <h1>Edit Form</h1>
      <input type="text" value={form.title} onChange={(e) => updateForm("title", e.target.value)} />
      {form.questions.map((question, qIndex) => (
        <div key={qIndex}>
          <input type="text" value={question.text} onChange={(e) => updateQuestion(qIndex, "text", e.target.value)} />
          <select value={question.type} onChange={(e) => updateQuestion(qIndex, "type", e.target.value)}>
            <option value="text">Text</option>
            <option value="radio">Single Choice</option>
            <option value="checkbox">Multiple Choice</option>
          </select>
          {(question.type === "radio" || question.type === "checkbox") && (
            <>
              <button onClick={() => addOption(qIndex)}>Add Option</button>
              {question.options.map((option, oIndex) => (
                <input
                  key={oIndex}
                  type="text"
                  value={option.text}
                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                />
              ))}
            </>
          )}
        </div>
      ))}
      <button onClick={saveForm}>Save Form</button>
    </div>
  )
}

