import React, { useEffect, useReducer, useState } from "react";
import { useNavigate, useSubmit } from "react-router-dom";

import { IoAddCircleOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { GrMultiple } from "react-icons/gr";

import classes from "./Label.module.css";

import { API_BASE_URL } from "../../config";
import Card from "../UI/Card/Card";
import Button from "../UI/Button/Button";
import Modal from "../UI/Modal/Modal";
import Input from "../UI/Input/Input";
import ReportDownloadBtn from "../ReportDownloadBtn/ReportDownloadBtn";

function formatDate(date, format) {
  return format
    .replace("yy", date.getFullYear())
    .replace("mm", ("0" + (date.getMonth() + 1)).slice(-2))
    .replace("dd", ("0" + date.getDate()).slice(-2))
    .replace("hh", ("0" + (date.getHours() % 12)).slice(-2))
    .replace("min", ("0" + date.getMinutes()).slice(-2))
    .replace("sec", ("0" + date.getSeconds()).slice(-2))
    .replace("am", date.getHours() < 12 ? "am" : "pm");
}
function formatText(text) {
  return text[0].toUpperCase() + text.slice(1);
}

const initialState = {
  name: {
    value: "",
    invalidText: null,
    touched: false,
  },
  amount: {
    value: 0,
    invalidText: null,
    touched: false,
  },
  date: {
    value: formatDate(new Date(), "yy-mm-dd"),
  },
  multiExpenses: {
    value: "",
    invalidText: null,
    touched: false,
  },
};
const reducer = (state, { type, payload }) => {
  let invalidText;
  switch (type) {
    case "name":
      invalidText = !payload.length ? "Name can't be empty" : null;
      return { ...state, name: { value: payload, invalidText, touched: true } };
    case "amount":
      invalidText = payload <= 0 ? "Amount should be greater than zero" : null;
      return {
        ...state,
        amount: { value: +payload, invalidText, touched: true },
      };
    case "date":
      return {
        ...state,
        date: { value: payload },
      };
    case "multiExpenses":
      invalidText =
        payload &&
        payload.match(/^"?(\w+)"?\((\d+)\)(,\s*"?(\w+)"?\((\d+)\))*$/)
          ? null
          : "Enter in correct format";
      return {
        ...state,
        multiExpenses: { value: payload, invalidText, touched: true },
      };
    case "reset":
      return initialState;
    default:
      throw new Error("Invalid action type from switch case of login.jsx");
  }
};

const Label = (props) => {
  const [transactions, setTransactions] = useState([]);
  const [displayModal, setDisplayModal] = useState(false);
  const [addExpenseModal, setAddExpenseModal] = useState({
    display: false,
    mode: "single",
  });
  const [modalData, setModalData] = useState({});
  const [errors, setErrors] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ status: false, data: {} });
  const navigate = useNavigate();
  const submit = useSubmit();
  const [state, dispatch] = useReducer(reducer, initialState);

  const totalExpenseAmount = transactions.reduce(
    (amount, expense) => amount + +expense.amount,
    0
  );

  useEffect(() => {
    setTransactions(props.expenses || []);
  }, [props.expenses]);
  const transactionClickHandler = (transaction) => {
    setDisplayModal(true);
    setModalData(transaction);
  };
  const modalCancelHandler = () => {
    setDisplayModal(false);
    setModalData({});
  };
  const deleteTransactionHandler = ({ _id: id }) => {
    // delete transaction from database
    fetch(`${API_BASE_URL}/expense`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        id: id,
        labelId: props.label.id,
      }),
    })
      .then((reponse) => {
        return reponse.json();
      })
      .then((resData) => {
        setTransactions((prevData) =>
          prevData.filter(
            (transaction) => transaction._id !== resData.deletedExpense._id
          )
        );
      })
      .catch((err) => {
        setErrors({
          message: "Failed to delete expense&" + err.message,
          status: err.status || 500,
        });
      });
    setDisplayModal(false);
    setModalData({});
  };
  const addBtnClickHandler = () => {
    setAddExpenseModal((prevModal) => ({ ...prevModal, display: true }));
  };
  const addSingleExpenseHandler = (e) => {
    if (
      addExpenseModal.mode === "single" &&
      !state.name.value &&
      state.amount.value <= 0
    ) {
      setErrors({
        message:
          "1. Expense name should not be empty & 2. Expense amount should be greater than zero",
      });
    } else if (addExpenseModal.mode === "single" && !state.name.value) {
      setErrors({ message: "1. Expense name should not be empty" });
    } else if (addExpenseModal.mode === "single" && state.amount.value <= 0) {
      setErrors({ message: "1. Expense amount should be greater than zero" });
    } else if (
      addExpenseModal.mode === "multiple" &&
      state.multiExpenses.invalidText
    ) {
      setErrors({ message: state.multiExpenses.invalidText });
    } else {
      const formData = new FormData();
      formData.append("name", state.name.value);
      formData.append("amount", state.amount.value);
      formData.append("date", state.date.value);
      formData.append("multipleExpenses", state.multiExpenses.value);
      submit(formData, { method: "PUT", action: "/label/" + props.label.id });
      dispatch({ type: "reset" });

      setAddExpenseModal((prevModal) => ({ ...prevModal, display: false }));
    }
  };
  const addExpenseCanceler = () => {
    dispatch({ type: "reset" });

    setAddExpenseModal((prevModal) => ({ ...prevModal, display: false }));
  };

  // Function for deleting label
  const deleteLabelHandler = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return setErrors({ status: 401, message: "Invalid token" });
    }
    if (!props.label.id) {
      return setErrors({ status: 401, message: "Invalid Label Id" });
    }
    fetch(`${API_BASE_URL}/label`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        labelId: props.label.id,
      }),
    })
      .then((response) => {
        if (response.status === 400) {
          return setErrors({
            status: 400,
            message: "Invalid Label Id or token",
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data?.label) {
          navigate("/");
        }
      })
      .catch((err) => {
        setErrors({
          status: err.status || 500,
          message:
            "Failed to delete &" + err.message ||
            "Error from delteLabelHandler",
        });
      });
    setDeleteModal({ status: false, data: {} });
  };

  const addExpenseModeHandler = () => {
    setAddExpenseModal((prevModal) => {
      const mode = prevModal.mode === "single" ? "multiple" : "single";
      return { ...prevModal, mode: mode };
    });
    dispatch({ type: "reset" });
  };

  return (
    <section className={classes.section}>
      {/* MODALS STARTS FROM HERE */}
      {displayModal && (
        <Modal
          title="Transaction Details"
          confirmText="Okay"
          confirmColor="green"
          onConfirm={modalCancelHandler}
          onCancel={modalCancelHandler}
        >
          <div
            className={classes.modal__deleteBtn}
            onClick={() => deleteTransactionHandler(modalData)}
          >
            <MdDelete />
          </div>
          <ul className={classes.modal__ul}>
            <li>
              <span className={classes.modal__ul__name}>Name: </span>
              <span className={classes.modal__ul__value}>
                {formatText(modalData.name)}
              </span>
            </li>
            <li>
              <span className={classes.modal__ul__name}>Amount: </span>
              <span className={classes.modal__ul__value}>
                Rs {modalData.amount}
              </span>
            </li>
            <li>
              <span className={classes.modal__ul__name}>Date Created: </span>
              <span
                className={classes.modal__ul__value}
                style={{ wordSpacing: "10px" }}
              >
                {formatDate(
                  new Date(modalData.createdAt),
                  `yy/mm/dd hh:min:secam`
                )}
              </span>
            </li>
            <li>
              <span className={classes.modal__ul__name}>ID: </span>
              <span className={classes.modal__ul__value}>{modalData._id}</span>
            </li>
          </ul>
        </Modal>
      )}
      {addExpenseModal.display && (
        <Modal
          title="Add an Expense"
          confirmText="Save"
          submitable={true}
          onConfirm={addSingleExpenseHandler}
          onCancel={addExpenseCanceler}
        >
          <div
            className={`${classes.addExpenseModal__addMoreBtn} ${
              addExpenseModal.mode === "multiple" ? classes.active : ""
            }`}
            onClick={addExpenseModeHandler}
          >
            <span>
              <GrMultiple />
            </span>
            <span>{addExpenseModal.mode}</span>
          </div>
          {addExpenseModal.mode === "single" ? (
            <>
              <Input
                name="name"
                title="Name"
                required="true"
                value={state.name.value}
                invalid={state.name.invalidText && state.name.touched}
                invalidText={state.name.invalidText}
                onChange={(e) =>
                  dispatch({ type: "name", payload: e.target.value })
                }
                onBlur={(e) =>
                  dispatch({ type: "name", payload: e.target.value })
                }
              />
              <Input
                name="amount"
                type="number"
                step="0.01"
                title="Amount"
                required="true"
                value={state.amount.value}
                invalid={state.amount.invalidText && state.amount.touched}
                invalidText={state.amount.invalidText}
                onChange={(e) =>
                  dispatch({ type: "amount", payload: e.target.value })
                }
                onBlur={(e) =>
                  dispatch({ type: "amount", payload: e.target.value })
                }
              />
            </>
          ) : (
            <Input
              name="multipleExpenses"
              title="Expenses Detail"
              type="textarea"
              required="true"
              placeholder="name1(amount1),name2(amount2),...."
              value={state.multiExpenses.value}
              invalid={
                state.multiExpenses.invalidText && state.multiExpenses.touched
              }
              invalidText={state.multiExpenses.invalidText}
              onChange={(e) =>
                dispatch({ type: "multiExpenses", payload: e.target.value })
              }
              onBlur={(e) =>
                dispatch({ type: "multiExpenses", payload: e.target.value })
              }
            />
          )}
          <Input
            name="date"
            title="Date"
            type="date"
            value={state.date.value}
            onChange={(e) =>
              dispatch({ type: "date", payload: e.target.value })
            }
          />
        </Modal>
      )}
      {errors && (
        <Modal
          title="Error Occured!!!"
          confirmText="Okay"
          onConfirm={() => setErrors(null)}
          onCancel={() => setErrors(null)}
        >
          <h3>{[errors.status, " ", errors.message.split("&")[0]]}</h3>
          <h3>{errors.message.split("&")[1]}</h3>
        </Modal>
      )}
      {deleteModal.status && (
        <Modal
          title="Deletion Confirmation"
          confirmText="Delete"
          confirmColor="red"
          onConfirm={deleteLabelHandler}
          onCancel={() => {
            setDeleteModal({ status: false, data: {} });
          }}
        >
          <h1>
            Are you sure to delete <i>"{props.label.name}"</i>
          </h1>
        </Modal>
      )}
      {/* MODAL ENDS HERE */}

      {/* Label Header starts */}
      <div className={classes.heading}>
        <h1 className={classes.labelname}>{props.label.name}</h1>
        <div className={classes.heading__btnWrapper}>
          <Button
            className={classes["heading__btn--edit"]}
            onClick={navigate.bind(null, "/new/" + props.label.id)}
          >
            <MdEdit />
            <span>Edit</span>
          </Button>
          <Button
            className={classes["heading__btn--delete"]}
            onClick={() => {
              setDeleteModal({ status: true });
            }}
          >
            <MdDelete />
            <span>Delete</span>
          </Button>
        </div>
      </div>
      {/* Label Header ends */}

      <h1 className={classes.balance}>
        YOUR BALANCE IS: Rs {+props.label.budget - totalExpenseAmount}/-
      </h1>
      <Card className={classes.card}>
        <div className={classes.card__title}>Budget</div>
        <div className={classes.card__deposit}>
          <span>Deposit: </span>Rs {props.label.budget}/-
        </div>
      </Card>
      <Card className={classes.card}>
        <div className={classes.card__title}>Expenses</div>
        <div className={classes.card__expenses}>
          <span>Expenses: </span>Rs {totalExpenseAmount}/-
        </div>
      </Card>
      <Button
        className={classes.addExpenseBtn}
        animated="true"
        onClick={addBtnClickHandler}
      >
        <span className={classes.addExpenseBtn__icon}>
          <IoAddCircleOutline />
        </span>
        <span>Add an expense</span>
      </Button>

      <div className={classes.history}>
        {
          <h1 className={classes.history__title}>
            {transactions.length > 0 ? (
              <>
                <span>Transaction Details</span>
                <ReportDownloadBtn
                  data={props.data}
                  filename={`expenses-report-${props.label.name.replace(
                    " ",
                    "-"
                  )}-${props.label.id.slice(-5)}`}
                />
              </>
            ) : (
              "No expenses found"
            )}
          </h1>
        }
        {transactions.map((transaction) => {
          return (
            <div
              key={transaction._id}
              className={classes.history__item}
              onClick={() => transactionClickHandler(transaction)}
            >
              <h1 className={classes.history__item__name}>
                <span style={{ color: "#ff5eff", marginRight: "1rem" }}>
                  {new Date(transaction.createdAt).toLocaleDateString("en-us", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                {formatText(transaction.name)}
              </h1>
              <span className={classes.history__item__amount}>
                Rs {transaction.amount}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Label;
