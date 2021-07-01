import "../css/AddItemForm.css";
import { Form, Button } from "react-bootstrap";
import React, { useState } from "react";
const link = process.env.REACT_APP_BACKEND_URL;
const fetch = require("node-fetch");

const LoginForm = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    if (!validateForm) {
      console.log("One of the required fields are empty");
    }

    const payload = {
      id: loginId,
      password,
    };

    const formBody = Object.keys(payload)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(payload[key])
      )
      .join("&");

    fetch(`${link}/users/login`, {
      method: "POST",
      body: formBody,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((json) => console.log(json));
  };

  const validateForm = () => {
    return loginId.length > 0 && password.length > 0;
  };

  return (
    <>
      <Form>
        <Form.Group controlId="loginId">
          <Form.Label>Account ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="account@email.com"
            required
            onChange={(e) => setLoginId(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="text"
            placeholder="password123"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
