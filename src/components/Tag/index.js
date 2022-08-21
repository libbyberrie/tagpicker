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
    <div
      // id={props.identifier}
      className={`${styles.tag} ${
        styles[`tag--${computedColor(props.color).substring(1)}`]
      }`}
    >
      {props.title}
      <button type="button" className={styles.close} onClick={props.onClose}>
        <span id={props.identifier} aria-hidden="true">
          <svg viewBox="0 0 320 512">
            {/* <!-- font awesome free, minified with SVGOMG --> */}
            <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25-6.2 6.25-14.4 9.35-22.6 9.35s-16.38-3.125-22.62-9.375L160 301.3 54.63 406.6C48.38 412.9 40.19 416 32 416s-16.37-3.1-22.625-9.4c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z" />
          </svg>
        </span>
        <span className="screenreader-only">
          Remove {props.title} from this user's tags
        </span>
      </button>
    </div>
  )
}
