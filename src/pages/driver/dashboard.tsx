import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import GoogleMapReact from 'google-map-react';
import { Driver } from 'src/components/driver';
import { gql, useMutation, useSubscription } from '@apollo/client';
import { FULL_ORDER_FRAGMENT } from 'src/fragment';
import { cookedOrders } from 'src/__generated__/cookedOrders';
import { Link, useHistory } from 'react-router-dom';
import { takeOrder, takeOrderVariables } from 'src/__generated__/takeOrder';

const COOKED_ORDERS_SUBSCRIPTION = gql`
  subscription cookedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

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
  const makeRoute = () => {
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
  const key: string = process.env.REACT_APP_GOOGLE_KEY || '';

  const { data: cookedOrderData } = useSubscription<cookedOrders>(
    COOKED_ORDERS_SUBSCRIPTION
  );

  useEffect(() => {
    if (cookedOrderData?.cookedOrders.id) {
      makeRoute();
    }
  }, [cookedOrderData]);
  const history = useHistory();
  const onCompleted = (data: takeOrder) => {
    if (data.takeOrder.ok) {
      setTimeout(() => {
        history.push(`/orders/${cookedOrderData?.cookedOrders.id}`);
      });
    }
  };
  const [takeOrderMutation] = useMutation<takeOrder, takeOrderVariables>(
    TAKE_ORDER_MUTATION,
    {
      onCompleted,
    }
  );
  const triggerMutaion = (id: number) => {
    takeOrderMutation({
      variables: {
        input: {
          id,
        },
      },
    });
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
          bootstrapURLKeys={{ key }}
        >
          <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
        </GoogleMapReact>
      </div>
      <div className="max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {cookedOrderData?.cookedOrders.restaurant ? (
          <>
            <h1 className="text-center text-3xl font-medium">
              New Coocked Order
            </h1>
            <h4 className="text-center my-3 text-2xl font-medium">
              Pick it up soon! @ {cookedOrderData.cookedOrders.restaurant?.name}
            </h4>
            <button
              onClick={() => triggerMutaion(cookedOrderData?.cookedOrders.id)}
              className="btn w-full block text-center mt-5"
            >
              Accept Challenge &rarr;
            </button>
          </>
        ) : (
          <h1 className="text-center text-3xl font-medium">No orders yet...</h1>
        )}
      </div>
    </div>
  );
};
