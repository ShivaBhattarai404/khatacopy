import {
  Image,
  Text,
  View,
  Page,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import logo from "./logo.png";

const capitalizeText = (text) => {
  if(text === ""){
    return "";
  }
  const formatedText = text[0].toUpperCase() + text.slice(1);
  return formatedText;
};
const Invoice = (props) => {
  const data = props.data;
  if (!data) {
    return (
      <Document>
        <Page>
          <View>
            <Text>Null data</Text>
          </View>
        </Page>
      </Document>
    );
  }
  const invoiceName = props.invoiceName || "Expenses Report";

  const name = capitalizeText(data.label.name);
  const budget = data.label.budget;
  const totalExpense = data.label.totalExpense;
  const remainingBalance = data.label.remainingBalance;
  const reciept_data = data.expenses;
  const username = capitalizeText(props.username);
  const issueDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const styles = StyleSheet.create({
    page: {
      fontSize: 11,
      paddingTop: 15,
      paddingLeft: 40,
      paddingRight: 40,
      lineHeight: 1.5,
      flexDirection: "column",
    },

    logo: { width: 90 },

    reportTitle: { fontSize: 16, textAlign: "center", color: "#3366ff" },

    invoice: { fontWeight: "bold", fontSize: 20 },

    invoiceDetail: { fontSize: 11, fontWeight: "bold" },

    theader: {
      marginTop: 0,
      fontSize: 12,
      fontStyle: "bold",
      paddingTop: 6,
      paddingLeft: 7,
      flex: 1,
      height: 25,
      color: "white",
      backgroundColor: "#219bff",
    },

    theader2: { flex: 2 },

    tbody: {
      flexDirection: "row",
      justifyContent: "space-between",
      border: "1px solid #219bff",
      borderTop: "none",
      borderBottom: "none",
      paddingTop: 5,
      paddingBottom: 5,
    },
    lightBlue: {
      backgroundColor: "#d4ffff",
    },
    tdate: {
      flex: 0.65,
      paddingLeft: 7,
    },
    rowTotal: {
      flex: 0.65,
    },
    itemNPrice: {
      flexDirection: "column",
      flex: 2,
    },
    itemNPriceContent: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    itemName: {
      flex: 1.5,
      marginLeft: 4,
    },
    itemAmount: {
      flex: 0.75,
    },
    total: {
      fontSize: 9,
      paddingTop: 4,
      paddingLeft: 7,
      flex: 1.5,
      borderColor: "whitesmoke",
      borderBottomWidth: 1,
    },

    tbody2: { flex: 2, borderRightWidth: 1 },
  });

  const InvoiceTitle = () => (
    <View>
      <View style={styles.spaceBetween}>
        <Image style={styles.logo} src={logo} />
        <Text style={styles.reportTitle}>khatacopy.web.app</Text>
      </View>
    </View>
  );

  const Address = () => (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View>
        <Text style={styles.invoice}>Invoice </Text>
        <Text style={styles.invoiceDetail}>
          Name: <Text style={{ color: "#9032fc" }}>{name}</Text>
        </Text>
        <Text style={styles.invoiceDetail}>Issue date: {issueDate}</Text>
        <Text style={styles.invoiceDetail}>Issue By: {username} </Text>
      </View>
      <View style={{ alignSelf: "flex-end" }}>
        <Text style={styles.invoiceDetail}>
          Budget: <Text style={{ color: "#007d15" }}>Rs {budget}</Text>
        </Text>
        <Text style={styles.invoiceDetail}>
          Total Expenses:{" "}
          <Text style={{ color: "#ff2121" }}>Rs {totalExpense}</Text>
        </Text>
        <Text style={styles.invoiceDetail}>
          Remaining Balance:{" "}
          <Text style={{ color: "#9032fc" }}>Rs {remainingBalance}</Text>
        </Text>
      </View>
    </View>
  );

  const TableHead = () => (
    <View style={{ width: "100%", flexDirection: "row", marginTop: 10 }}>
      <View style={styles.theader}>
        <Text>Date</Text>
      </View>
      <View style={[styles.theader, styles.theader2]}>
        <Text>Item</Text>
      </View>
      <View style={styles.theader}>
        <Text>Amount</Text>
      </View>
      <View style={styles.theader}>
        <Text>Total</Text>
      </View>
    </View>
  );

  // Table body STARTS. RowDate, RowTotal, RowContent are components of TableBody
  const RowDate = ({ date }) => {
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return (
      <View style={styles.tdate}>
        <Text>{formattedDate}</Text>
      </View>
    );
  };
  const RowTotal = ({ total }) => (
    <View style={styles.rowTotal}>
      <Text> Rs {total}</Text>
    </View>
  );
  const RowContent = ({ expenses }) => {
    //  expenses = [
    //   { name: "Coeffee", amount: 20 },
    //   { name: "Latte", amount: 40 },
    //   { name: "Tea", amount: 70 },
    // ]
    return (
      <View style={styles.itemNPrice}>
        {expenses.map((expense, index) => (
          <View key={index} style={styles.itemNPriceContent}>
            <View style={styles.itemName}>
              <Text>{capitalizeText(expense.name)}</Text>
            </View>
            <View style={styles.itemAmount}>
              <Text>Rs {expense.amount}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const TableBody = () => {
    return Object.keys(reciept_data).map((date, index) => {
      const viewStyles = [styles.tbody];

      // Adding blue background to even rows
      index % 2 !== 0 && viewStyles.push(styles.lightBlue);

      // Adding border to last row
      Object.keys(reciept_data).length - 1 === index &&
        viewStyles.push({ borderBottom: "1px solid #219bff" });

      return (
        <View style={viewStyles} key={index}>
          <RowDate date={date} />
          {/* receipt_data[date] = {
                expenses: [
                  { name: "Coeffee", amount: 20 },
                  { name: "Latte", amount: 40 },
                  { name: "Tea", amount: 70 },
                ],
                total: 130,
          } */}
          <RowContent expenses={reciept_data[date].expenses} />
          <RowTotal total={reciept_data[date].total} />
        </View>
      );
    });
  };

  const TableTotal = () => <View></View>;

  return (
    <Document title={invoiceName}>
      <Page size="A4" style={styles.page}>
        <InvoiceTitle />
        <Address />
        <TableHead />
        <TableBody />
        <TableTotal />
      </Page>
    </Document>
  );
};

export default Invoice;
