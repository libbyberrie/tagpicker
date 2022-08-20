import Tag from './components/Tag'
import './styles.css'
import styles from './styles/taglist.module.css'
import { Transition, Combobox } from '@headlessui/react'
import {
  fetchTags,
  createTag,
  fetchUser,
  fetchUserTags,
  assignUserTag,
  removeUserTag,
} from './api'
import { React, useState, useEffect, useMemo } from 'react'

let userID = '1111-2222-3333-4444'
export default function App() {
  const [user, setUser] = useState([])
  const [usertags, setUsertags] = useState([])
  const [alltags, setAlltags] = useState([])
  const [inputVisible, setInputVisibility] = useState(false)

  const [tagQuery, setTagQuery] = useState({})
  useEffect(() => {
    fetchUser(userID).then(response => {
      setUser(response)
    })
  }, [userID])

  useEffect(() => {
    fetchUserTags(userID).then(response => {
      setUsertags(response)
    })

    fetchTags().then(response => {
      setAlltags(response)
    })
  }, [usertags, alltags])

  const matchingTagObjects = () => {
    const filteredtags = alltags.filter(tag => usertags.indexOf(tag.uuid) != -1)
    return filteredtags
  }
  const toggleVisibility = () => {
    setInputVisibility(!inputVisible)
  }

  const addTag = event => {
    console.log("Oh, i'm supposed to add a tag here. ")
    if (event.uuid) {
      assignUserTag(userID, event.uuid).then(response =>
        setUsertags(response.tags)
      )
    }
    matchingTagObjects()
  }

  const inputTags = () => {
    const notUserTags = alltags.filter(tag => usertags.indexOf(tag.uuid) === -1)
    if (notUserTags.length > 0 && tagQuery.length > 0) {
      let matchingvalues = []
      // For whatever reason, nesting the includes within a filter wasn't working? so i had to use a map function instead. Bit lost as to why
      notUserTags.map(tag => {
        if (tag.title.toLowerCase().includes(tagQuery.toLowerCase())) {
          matchingvalues.push(tag)
        }
      })
      return matchingvalues
    } else {
      return notUserTags
    }
  }

  return (
    <div className="App">
      <h1>We're viewing {user.fullName}'s tags!</h1>
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
          <div
            className={`${styles.combobox} ${
              inputVisible ? styles.visible : ''
            }`}
          >
            <Combobox value="" onChange={addTag}>
              <Combobox.Input
                onChange={event => setTagQuery(event.target.value)}
                displayValue={tag => tag.title}
              />
              <div className={styles.comboboxdropdown}>
                <Transition
                  enter={styles['comboboxdropdown--transition']}
                  enterFrom={styles['comboboxdropdown--invisible']}
                  enterTo={styles['comboboxdropdown--visible']}
                  leave={styles['comboboxdropdown--transition']}
                  leaveFrom={styles['comboboxdropdown--visible']}
                  leaveTo={styles['comboboxdropdown--invisible']}
                >
                  <Combobox.Options>
                    {inputTags().length > 0 &&
                      inputTags().map(tag => (
                        <Combobox.Option key={tag.uuid} value={tag}>
                          {tag.title}
                        </Combobox.Option>
                      ))}
                    {tagQuery.length > 0 && (
                      <Combobox.Option value={{ id: null, name: tagQuery }}>
                        <span className={styles['add-option']}>
                          <span className={styles['add-button']}>+</span>Create
                          tag
                        </span>
                      </Combobox.Option>
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
            <button
              type="button"
              className={styles[`add-button`]}
              onClick={toggleVisibility}
            >
              <span>+</span>
              <span className={styles.popup}>Add</span>
            </button>
          </div>
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

// SCRATCH NOTES:
