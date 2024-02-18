import React from "react";
import { json, redirect, useLoaderData } from "react-router-dom";

import { API_BASE_URL } from "../config";
import LabelComponent from "../Components/Label/Label";

const Label = () => {
  const data = useLoaderData();
  return (
    <LabelComponent
      data={data}
      expenses={data.expenses}
      label={data.label || { name: "", id: "" }}
    />
  );
};

export const loader = async ({ params }) => {
  const labelId = params.labelId;
  const token = localStorage.getItem("token");

  if (!token) {
    return redirect("/login");
  }
  try {
    const response = await fetch(`${API_BASE_URL}/expenses/${labelId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (
      response.status === 400 ||
      response.status === 401 ||
      response.status === 422
    ) {
      return redirect("/login");
    }
    if (response.status === 404) {
      throw json(
        {},
        { status: 404, statusText: "this api endpoint doesnot exits" }
      );
    }
    if (!response.ok) {
      const errMessage = await response.json().message;
      throw json({}, { status: response.status, statusText: errMessage });
    }
    const data = await response.json();
    return json({
      label: data.label,
      expenses: data.expenses,
    });
  } catch (error) {
    throw json(
      {
        message:
          error.message ||
          error.statusText ||
          "default error from catch block of expenses loader",
      },
      { status: error.status }
    );
  }
};

export const action = async ({ params, request: req }) => {
  const formData = await req.formData();
  const name = formData.get("name");
  const amount = formData.get("amount");
  const multipleExpenses = formData.get("multipleExpenses");
  const date = formData.get("date");
  const fullDate = new Date(date);

  const token = localStorage.getItem("token");
  const labelId = params.labelId;
  if (!token) {
    return redirect("/login");
  }
  try {
    let url = `${API_BASE_URL}/expense`;
    let reqBody = { labelId, name, amount, date: fullDate };
    if (multipleExpenses) {
      url = `${API_BASE_URL}/multiexpenses`;
      reqBody = { labelId, multipleExpenses, date: fullDate };
    }
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(reqBody),
    });
    if (response.status === 401 || response.status === 400) {
      throw json(
        {},
        { status: response.status, statusText: "Invalid Token or LabelId" }
      );
    }
    if (!response.ok) {
      throw json(
        {},
        { status: response.status, statusText: "Error response from server" }
      );
    }
    await response.json();
    return null;
  } catch (error) {
    throw json(
      {
        message:
          error.message ||
          error.statusText ||
          "default error from catch block of expenses action",
      },
      { status: error.status }
    );
  }
};

export default Label;
