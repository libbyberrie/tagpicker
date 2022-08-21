import { React, useState } from 'react'
import styles from '../styles/dropdown.module.css'
import { Transition, Combobox } from '@headlessui/react'

export default function Dropdown(props) {
  const [tagQuery, setTagQuery] = useState({})
  const [inputVisible, setInputVisibility] = useState(false)

  const inputTags = () => {
    const notUserTags = props.alltags.filter(
      tag => props.usertags.indexOf(tag.uuid) === -1
    )
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

  const toggleVisibility = () => {
    setInputVisibility(!inputVisible)
    document.getElementById('headlessui-combobox-input-1').focus()
  }

  return (
    <div className={`${styles.combobox} ${inputVisible ? styles.visible : ''}`}>
      {' '}
      <Combobox value="" onChange={props.function}>
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
                    <span className={styles['add-button']}>+</span>Create tag
                  </span>
                </Combobox.Option>
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      <button
        type="button"
        id="addbutton"
        className={styles[`add-button`]}
        onClick={toggleVisibility}
      >
        <span>+</span>
        <span className={styles.popup}>Add</span>
      </button>
    </div>
  )
}
