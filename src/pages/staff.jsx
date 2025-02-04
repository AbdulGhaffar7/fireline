import { Typography } from "antd";
import Header from "../components/header";
import Map from "../components/staff_map";

function Home() {
  return (
    <>
      <Header />
      <Map />
      <div
        style={{
          backgroundColor: "#b50000",
          padding: "20px",
          minHeight: "10vh",
        }}
      >
        <Typography
          style={{
            color: "#fff",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          Hello, Everyone!
        </Typography>
        <Typography
          style={{
            color: "#d8d8ca",
            fontSize: "16px",
          }}
        >
          Welcome to FireLine: A UK service that gives you live inscidents
          updates, fire serbice news and much more. Created by Fire Service
          Enthusiasts, for Fire Service Enthusiasts.
        </Typography>
      </div>
    </>
  );
}

export default Home;
