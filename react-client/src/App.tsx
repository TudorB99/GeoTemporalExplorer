import "./App.css";
import CustomMap from "./components/custom_map/custom_map";
import Layout from "./layout/layout";

export default function App() {
  return (
    <Layout title="Home">
      {/* <div className="card">
        <h2 className="card__title">Hello</h2>
        <p className="card__text">This is the page content.</p>
      </div> */}

      <div className="page">
        <CustomMap />
      </div>
    </Layout>
  );
}
