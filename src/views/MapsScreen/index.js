import React, { useState } from 'react'

import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

const mapStyles = {
    width: '100%',
    height: '100vh',
}

const stores = [
    {
        name: 'Store 1',
        location: {lat: 48.00, lng: -122.00},
        data: {
            telNumber: '+998999713258',
            address: 'Store 1 address'
        }
    },
    {
        name: 'Store 2',
        location: {lat: 48.00, lng: -120.00},
        data: {
            telNumber: '+998909336800',
            address: 'Store 2 address'
        },
    },
    {
        name: 'Store 3',
        location: {lat: 47.00, lng: -120.00},
        data: {
            telNumber: '+998903575657',
            address: 'Store 3 address'
        },
    },
    {
        name: 'Store 4',
        location: {lat: 47.00, lng: -122.00},
        data: {
            telNumber: '+998977615657',
            address: 'Store 4 address'
        }
    }
]

const MapsScreen = ({ google }) => {
    const [position, setPosition] = useState({ lat: 47.444, lng: -122.176})
    const [isBoxShow, setIsBoxShow] = useState(false)

    const onMarkerClick = (location) => {
        setIsBoxShow(false)
        setPosition(location)
        setIsBoxShow(true)
    }

    return(
        <>
            <Map
                google={google}
                zoom={8}
                style={mapStyles}
                initialCenter={position}
                center={position}
            >
                {stores.map((store, index) => (
                    <Marker
                        id={index}
                        key={index}
                        position={store.location}
                        // name={store.name}
                        title={store.name}
                        onClick={() => onMarkerClick(store.location)}
                    >
                    </Marker>
                ))}
            </Map>
        <div className='mapsContainer'>
            {isBoxShow ? (
                <div className='mapsCard'>
                    <Card>
                        <Card.Body>
                            <Card.Text>
                                <div className='mapsCardBold'>Number: </div>
                                +998909336800
                            </Card.Text>
                            <Card.Text>
                                <div className='mapsCardBold'>Address: </div>
                                Tashkent, Shaykhontokhur, Qoratosh 17-21
                            </Card.Text>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <Button>Apply</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            ) : null}
        </div>
        </>
    )
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyB8czjIJ9xo666_Y0_S4EChl9nJ8PGO6aY'
})(MapsScreen)