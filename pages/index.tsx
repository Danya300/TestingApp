import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import styles from "../styles/Home.module.css"

export default function Home() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className={styles.container}>
        <h1>Welcome, {session.user.email}</h1>
        <button onClick={() => signOut()}>Sign out</button>
        <div>
          <Link href="/admin">
            <a className={styles.button}>Admin Mode</a>
          </Link>
        </div>
        <div>
          <Link href="/user">
            <a className={styles.button}>User Mode</a>
          </Link>
        </div>
      </div>
    )
  }
  return (
    <div className={styles.container}>
      <h1>Welcome to Form Builder</h1>
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  )
}

