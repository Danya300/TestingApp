"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Link from "next/link"
import styles from "../../styles/Admin.module.css"

export default function AdminDashboard() {
  const [forms, setForms] = useState([])
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.push("/")
    } else {
      fetchForms()
    }
  }, [session, router])

  const fetchForms = async () => {
    const response = await fetch("/api/forms")
    const data = await response.json()
    setForms(data)
  }

  const deleteForm = async (id) => {
    await fetch(`/api/forms/${id}`, { method: "DELETE" })
    fetchForms()
  }

  return (
    <div className={styles.container}>
      <h1>Admin Dashboard</h1>
      <Link href="/admin/create">
        <a className={styles.button}>Create New Form</a>
      </Link>
      <ul className={styles.formList}>
        {forms.map((form) => (
          <li key={form.id} className={styles.formItem}>
            <span>{form.title}</span>
            <div>
              <Link href={`/admin/edit/${form.id}`}>
                <a className={styles.button}>Edit</a>
              </Link>
              <button onClick={() => deleteForm(form.id)} className={styles.deleteButton}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

