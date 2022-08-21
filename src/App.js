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
  const [usertags, setUsertags] = useState([])
  const [alltags, setAlltags] = useState([])
  const [inputVisible, setInputVisibility] = useState(false)

  const [tagQuery, setTagQuery] = useState({})

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

  // I think React uses a comparison to check for changes in a memoised  variable
  // so there is essentially "no change" as they're not going that deep -
  // the stack's reference to the array is essentially the same.

  const toggleVisibility = () => {
    setInputVisibility(!inputVisible)
    document.getElementById('headlessui-combobox-input-1').focus()
  }

  const addTag = event => {
    if (event.uuid) {
      assignUserTag(userID, event.uuid).then(response =>
        setUsertags([...response.tags])
      )
    } else {
      createTag({ title: event.title }).then(response =>
        assignUserTag(userID, response.uuid).then(response =>
          setUsertags([...response.tags])
        )
      )
    }
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
        <div className={styles.taglist}>
          {matchingTagObjects.map(tag => (
            <Tag
              key={tag.uuid}
              identifier={tag.uuid}
              title={tag.title}
              color={tag.color}
              onClose={removeTag}
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
                      <Combobox.Option value={{ id: null, title: tagQuery }}>
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
    </div>
  )
}
