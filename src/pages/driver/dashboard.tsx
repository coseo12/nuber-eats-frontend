import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import GoogleMapReact from 'google-map-react';
import { Driver } from 'src/components/driver';

interface ICoords {
  lat: number;
  lng: number;
}

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>();
  const onSucces: PositionCallback = ({ coords: { latitude, longitude } }) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };
  const onError: PositionErrorCallback = error => {
    alert(error);
  };
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };
  useEffect(() => {
    navigator.geolocation.watchPosition(onSucces, onError, {
      enableHighAccuracy: true,
    });
  }, []);
  useEffect(() => {
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
        },
        (results, status) => {
          // console.log(status, results);
        }
      );
    }
  }, [driverCoords.lat, driverCoords.lng]);
  const onGetRouteClick = () => {
    if (map) {
      const directionsSerice = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: '#000',
          strokeOpacity: 1,
          strokeWeight: 3,
        },
      });
      directionsRenderer.setMap(map);
      directionsSerice.route(
        {
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
          destination: {
            location: new google.maps.LatLng(
              driverCoords.lat + 0.1,
              driverCoords.lng + 0.1
            ),
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        results => {
          console.log(results);

          directionsRenderer.setDirections(results);
        }
      );
    }
  };

  return (
    <div>
      <Helmet>
        <title>Dashboard | Nuber Eats</title>
      </Helmet>
      <div
        className="overflow-hidden"
        style={{ width: `100vw`, height: `50vh` }}
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          defaultZoom={16}
          draggable={false}
          defaultCenter={{ lat: 33, lng: 127 }}
          bootstrapURLKeys={{ key: 'AIzaSyBM0k_VvlAs52qP7mRiTFq86EX1lhDLJc4' }}
        >
          {/* <Driver lat={driverCoords.lat} lng={driverCoords.lng} /> */}
        </GoogleMapReact>
      </div>
      <button onClick={onGetRouteClick}>Get Route</button>
    </div>
  );
};
