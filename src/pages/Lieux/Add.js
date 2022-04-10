import { useState, useContext } from "react";
import { Map, MapMarker, Roadview, MapTypeControl } from "react-kakao-maps-sdk";
import { Box } from "@mui/material";
import MarkerContext from "../../Contexts/MarkerContext";


const RoadviewStyle = {
  position: "absolute",
  bottom: "50px",
  maxWidth: "100%",
  width: "350px",
  height: "250px",
  left: "0",
  zIndex: "100",
};

const MapViewStyle = {
  width: "100vw",
  height: "90vh",
  zIndex: "90",
};

export default function AddLieu() {

  return (
    <>
    <MarkerContext.Provider value={{ lat: 37.575712, long: 126.976801 }} >
      <Box sx={{ p: "relative" }}>
        <MapView />
        <StreetView />
      </Box>
    </MarkerContext.Provider>
    </>
  );
}

function StreetView() {

  const mapcontext = useContext(MarkerContext)

  return (
    <Roadview // 로드뷰를 표시할 Container
      position={{
        // 지도의 중심좌표
        lat: mapcontext.lat,
        lng: mapcontext.long,
        radius: 50,
      }}
      style={RoadviewStyle}
    />
  );
}

function MapView() {
  const mapcontext = useContext(MarkerContext)
  return (
    <Map
      id="map"
      center={{
        lat: mapcontext.lat,
        lng: mapcontext.long,
      }}
      style={MapViewStyle}
      level={13}
    >
      <MapTypeControl />
      <MapMarker // 마커를 생성합니다
        position={{
          // 마커가 표시될 위치입니다
          lat: 37.575712,
          lng: 126.976801,
        }}
      />
    </Map>
  );
}

function FormAjout(){

  return(
    <p>ajout</p>
  )
}
