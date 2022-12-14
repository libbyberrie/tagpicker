import Tag from './components/tag'
import './styles.css'
import styles from './styles/taglist.module.css'
import Dropdown from './components/dropdown'
import {
  fetchTags,
  createTag,
  fetchUserTags,
  assignUserTag,
  removeUserTag,
} from './api'
import { React, useState, useEffect, useMemo } from 'react'

let userID = '1111-2222-3333-4444'
export default function App() {
  const [usertags, setUsertags] = useState([])
  const [alltags, setAlltags] = useState([])

  useEffect(() => {
    fetchUserTags(userID).then(response => {
      setUsertags([...response])
    })
  }, [userID])

  useEffect(() => {
    fetchTags().then(response => {
      setAlltags([...response])
    })
  }, [usertags])

  const matchingTagObjects = useMemo(() => {
    if (alltags) {
      const filteredtags = alltags.filter(
        tag => usertags.indexOf(tag.uuid) != -1
      )
      return filteredtags
    }
  }, [alltags, usertags])

  const addTag = event => {
    if (event.id) {
      assignUserTag(userID, event.id).then(response =>
        setUsertags([...response.tags])
      )
    } else {
      createTag({ title: event.title }).then(response =>
        assignUserTag(userID, response.uuid).then(
          response => setUsertags([...response.tags])
          // i attempted to just setUserTags and setAllTags
          // without needed to assign the user taga and making
          // another call to the API, but unfortunately - for
          // whatever reason - it wasn't being detected by matchingTagObjects.
          //i thought it was a reference vs comparison thing (because the
          //reference to the array remains the same so i tried
          // replacing it with a new variable but now dice.
          // The consecutive api calls are probably why it's so slow.
        )
      )
    }
  }

  const removeTag = event => {
    let uuid = event.target.id
    removeUserTag(userID, uuid).then(response =>
      setUsertags([...response.tags])
    )
  }

  return (
    <div className="App">
      <h1 className={styles.tagheader}>Tag viewer</h1>
      {matchingTagObjects.length > 0 && (
        <div className={styles.taglist} id="button-parent">
          {matchingTagObjects.map(tag => (
            <Tag
              key={tag.uuid}
              identifier={tag.uuid}
              title={tag.title}
              color={tag.color}
              onClose={removeTag}
            />
          ))}

          <Dropdown function={addTag} alltags={alltags} usertags={usertags} />
        </div>
      )}
    </div>
  )
}
