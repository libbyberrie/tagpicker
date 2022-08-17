import "./styles.css";

import {
  fetchTags,
  createTag,
  fetchUser,
  fetchUserTags,
  assignUserTag,
  removeUserTag
} from "./api";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <p>
        For convenience I've just added in some buttons that will excute the
        mocked API functions and log their results to the console. Feel free to
        play around and remove these
      </p>
      <button onClick={() => fetchTags().then(console.log)}>Get Tags</button>
      <button
        onClick={() => fetchUser("1111-2222-3333-4444").then(console.log)}
      >
        Get User
      </button>
      <button
        onClick={() => fetchUserTags("1111-2222-3333-4444").then(console.log)}
      >
        Get User Tags
      </button>
      <button
        onClick={() =>
          createTag({ title: "My tag " + Math.random() }).then(console.log)
        }
      >
        Create new tag
      </button>
      <button
        onClick={() =>
          assignUserTag("1111-2222-3333-4444", prompt("Enter a Tag UUID")).then(
            console.log
          )
        }
      >
        Assign Tag
      </button>
      <button
        onClick={() =>
          removeUserTag("1111-2222-3333-4444", prompt("Enter a Tag UUID")).then(
            console.log
          )
        }
      >
        Remove Tag
      </button>
    </div>
  );
}
