import React from "react";
import classes from "./Input.module.css";

const Input = (props) => {
  let input = (
    <input
      className={props.invalid === true ? classes.invalid : ""}
      id={props.name}
      type={props.type || "text"}
      name={props.name}
      step={props.step}
      value={props.value || ""}
      onChange={props.onChange}
      onBlur={props.onBlur}
      autoComplete={props.autoComplete || "on"}
      min="2020-01-01"
      max="2030-12-30"
    />
  );
  if (props.type === "textarea") {
    input = (
      <textarea
        className={`${classes.form__textarea} ${
          props.invalid === true ? classes.invalid : ""
        }`}
        id={props.name}
        name={props.name}
        step={props.step}
        value={props.value || ""}
        onChange={props.onChange}
        onBlur={props.onBlur}
        placeholder={props.placeholder || ""}
        autoComplete={props.autoComplete || "on"}
        rows={props.rows || 5}
        spellCheck={false}
      ></textarea>
    );
  }
  return (
    <div
      className={`${classes.inputWrapper} ${
        props.className ? props.className : ""
      }`}
      style={{ ...props.style }}
    >
      <label htmlFor={props.name}>
        {props.title || "Input"}
        {props.required === "true" ? (
          <span className={classes.input__required}> *</span>
        ) : (
          ""
        )}
        {props.invalidText && (
          <span className={classes.invalidText}> ({props.invalidText})</span>
        )}
      </label>
      {input}
    </div>
  );
};

export default Input;
