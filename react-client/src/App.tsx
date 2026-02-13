import "leaflet/dist/leaflet.css";
import "./App.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Layout from "./layout/layout";

export default function App() {
  const center = { lat: 53.8008, lng: -1.5491 };

  return (
    <Layout title="Home">
      {/* <div className="card">
        <h2 className="card__title">Hello</h2>
        <p className="card__text">This is the page content.</p>
      </div> */}

      <div className="page">
        <div className="mapWrap">
          <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom={false}
            preferCanvas
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors &copy; CARTO"
              detectRetina
              updateWhenIdle
            />

            <Marker position={center}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </Layout>
  );
}
