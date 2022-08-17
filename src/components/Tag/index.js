import React from 'react'
import styles from '../../styles/tag.module.css'

export default function Tag(props) {
  const computedColor = color => {
    if (color[0] === '#') {
      return color
    } else if (color === 'red') {
      return '#EDB7B7'
    } else {
      return '#C8E8FF'
    }
  }

  return (
    <span
      id={props.identifier}
      className={`${styles.tag} ${
        styles[`tag--${computedColor(props.color).substring(1)}`]
      }`}
    >
      {props.title}
    </span>
  )
}
