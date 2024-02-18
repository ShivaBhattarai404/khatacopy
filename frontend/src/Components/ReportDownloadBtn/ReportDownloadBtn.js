import { PDFDownloadLink } from "@react-pdf/renderer";
import Invoice from "./invoice";
import { formatter } from "./helper";
import classes from "./ReportDownloadBtn.module.css"
import Button from "../UI/Button/Button";

function ReportDownloadBtn(props) {
  const fileName = props.filename || "expenses_report";
  const username = localStorage.getItem("username") || "";
  const data = formatter(props.data);

  return (
    <PDFDownloadLink
    style={{textDecoration: "none"}}
      document={<Invoice data={data} username={username} />}
      fileName={fileName}
    >
      <div className={classes.btn}><Button variant="peace" >Download Report</Button></div>
      {/* <button className={classes.btn}>Download Report</button> */}
    </PDFDownloadLink>
  );
}

export default ReportDownloadBtn;
