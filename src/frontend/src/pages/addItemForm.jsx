import "../css/AddItemForm.css";
import { Form, Button } from "react-bootstrap";
import React, { useState } from "react";
const link = process.env.REACT_APP_BACKEND_URL;
const fetch = require("node-fetch");

const AddItemForm = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [chinese, setChinese] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [enabled, setEnabled] = useState("true");

  const checkClicked = () => {
    setEnabled(!enabled);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      id,
      name,
      chinese,
      price,
      category,
      enabled,
    };
    fetch(`${link}/menu/add`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => console.log(json));
  };

  return (
    <>
      <Form>
        <Form.Group controlId="formItemId">
          <Form.Label>Item ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="1A"
            required
            onChange={(e) => setId(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formItemName">
          <Form.Label>Item Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Beef Noodle Soup"
            required
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formItemChinese">
          <Form.Label>Chinese Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="出前一丁"
            required
            onChange={(e) => setChinese(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formItemPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="text"
            placeholder="7.99"
            required
            onChange={(e) => setPrice(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formItemCategory">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            placeholder="Breakfast"
            required
            onChange={(e) => setCategory(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formItemEnabled">
          <Form.Check
            type="checkbox"
            label="Enabled"
            required
            onChange={checkClicked}
            checked
          />
          <Form.Text className="text-muted">
            Click to make this item active
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default AddItemForm;
