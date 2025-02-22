"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import Link from "next/link"
import styles from "../../styles/User.module.css"

export default function UserDashboard() {
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

  return (
    <div className={styles.container}>
      <h1>Available Forms</h1>
      <ul className={styles.formList}>
        {forms.map((form) => (
          <li key={form.id} className={styles.formItem}>
            <span>{form.title}</span>
            <Link href={`/user/form/${form.id}`}>
              <a className={styles.button}>Start</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

