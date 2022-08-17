import Tag from './components/Tag'
import './styles.css'
import styles from './styles/taglist.module.css'

import {
  fetchTags,
  createTag,
  fetchUser,
  fetchUserTags,
  assignUserTag,
  removeUserTag,
} from './api'
import { React, useState, useEffect } from 'react'

let userID = '1111-2222-3333-4444'
export default function App() {
  const [user, setUser] = useState([])
  const [usertags, setUsertags] = useState([])
  const [alltags, setAlltags] = useState([])
  useState(() => {
    fetchUser(userID).then(response => {
      setUser(response)
    })

    fetchUserTags(userID).then(response => {
      setUsertags(response)
    })

    fetchTags().then(response => {
      setAlltags(response)
    })
  }, [])

  const matchingTagObjects = () => {
    const filteredtags = alltags.filter(tag => usertags.indexOf(tag.uuid) != -1)
    return filteredtags
  }
  return (
    <div className="App">
      <h1>We're viewing {user.fullName}'s tags!</h1>
      <p>{matchingTagObjects().length}</p>
      {matchingTagObjects().length > 0 && (
        <div className={styles.taglist}>
          {matchingTagObjects().map(tag => (
            <Tag
              key={tag.uuid}
              identifier={tag.uuid}
              title={tag.title}
              color={tag.color}
            />
          ))}
        </div>
      )}

      <hr />

      <button onClick={() => fetchTags().then(console.log)}>Get Tags</button>
      <button
        onClick={() => fetchUser('1111-2222-3333-4444').then(console.log)}
      >
        Get User
      </button>
      <button
        onClick={() => fetchUserTags('1111-2222-3333-4444').then(console.log)}
      >
        Get User Tags
      </button>
      <button
        onClick={() =>
          createTag({ title: 'My tag ' + Math.random() }).then(console.log)
        }
      >
        Create new tag
      </button>
      <button
        onClick={() =>
          assignUserTag('1111-2222-3333-4444', prompt('Enter a Tag UUID')).then(
            console.log
          )
        }
      >
        Assign Tag
      </button>
      <button
        onClick={() =>
          removeUserTag('1111-2222-3333-4444', prompt('Enter a Tag UUID')).then(
            console.log
          )
        }
      >
        Remove Tag
      </button>
    </div>
  )
}
