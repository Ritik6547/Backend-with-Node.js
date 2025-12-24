import React from "react";
import Layout from "./Layout";

const Index = ({ todos }) => {
  return (
    <Layout title="Todos App">
      <form action="/todos" method="post">
        <input type="text" name="title" required />
        <button>Add Todo</button>
      </form>

      <ul>
        {todos.reverse().map(({ title, completed, _id }) => (
          <li key={_id.toString()}>
            <span
              style={{
                textDecoration: completed ? "line-through" : "",
                paddingRight: "6px",
              }}>
              {title}
            </span>
            <button data-id={_id.toString()} id="deleteBtn">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Index;
