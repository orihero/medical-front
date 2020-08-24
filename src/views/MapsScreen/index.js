import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { Link } from 'react-router-dom'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'


const url = 'http://142.93.79.101/api'

const mapStyles = {
    width: '100%',
    height: '100vh',
}

// const stores = [
//     {
//         name: 'Store 1',
//         location: {lat: 48.00, lng: -122.00},
//         data: {
//             telNumber: '+998999713258',
//             address: 'Store 1 address'
//         }
//     },
//     {
//         name: 'Store 2',
//         location: {lat: 48.00, lng: -120.00},
//         data: {
//             telNumber: '+998909336800',
//             address: 'Store 2 address'
//         },
//     },
//     {
//         name: 'Store 3',
//         location: {lat: 47.00, lng: -120.00},
//         data: {
//             telNumber: '+998903575657',
//             address: 'Store 3 address'
//         },
//     },
//     {
//         name: 'Store 4',
//         location: {lat: 47.00, lng: -122.00},
//         data: {
//             telNumber: '+998977615657',
//             address: 'Store 4 address'
//         }
//     }
// ]

const MapsScreen = ({ google }) => {
    const [stores, setStores] = useState([])
    const [isBoxShow, setIsBoxShow] = useState(false)
    const [selectedStore, setSelectedStore] = useState({})
    const [position, setPosition] = useState({ lat: 40.6971494, lng: -74.0598655 })
    const [menuExpanded, setMenuExpanded] = useState(false)

    const effect = async () => {
        try {
            let { data } = await axios.get(`${url}/branches`)

            setStores([...data])
        } catch (err) {
            console.log('error: ', err)
        }
    }

    let toggleMenu = (toggle) => {
        setMenuExpanded(toggle);
    }

    useEffect(() => {
        effect()
    }, [])

    const onMarkerClick = store => {
        setIsBoxShow(false)
        setSelectedStore(store)
        setPosition({
            lat: store.markercoords.split(',')[0],
            lng: store.markercoords.split(',')[1]
        })
        setIsBoxShow(true)
    }

    const handleBoxClose = () => {
        setIsBoxShow(false)
        setSelectedStore({})
    }

    return (
        <>
            <Container>
                <Navbar collapseOnSelect expand="lg" variant="light" bg="light" fixed="top" expanded={menuExpanded} onToggle={toggleMenu}>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            {stores.map((e) => {

                                return <Navbar.Brand onClick={() => onMarkerClick(store)}>{e.name}</Navbar.Brand>
                            })}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Container>
            <Map
                zoom={10.5}
                google={google}
                style={mapStyles}
                center={position}
                initialCenter={position}
            >
                {stores.map((store, index) => (
                    <Marker
                        id={index}
                        key={index}
                        title={store.name}
                        position={{ lat: store.markercoords.split(',')[0], lng: store.markercoords.split(',')[1] }}
                        onClick={() => onMarkerClick(store)}
                    />
                ))}
            </Map>
            <div className='mapsContainer'>
                {isBoxShow ? (
                    <div className='mapsCard'>
                        <Card>
                            <Card.Body>
                                <Card.Text>
                                    <div className='mapsCardBold'>Name: </div>
                                    {selectedStore.name}
                                </Card.Text>
                                <Card.Text>
                                    <div className='mapsCardBold'>Number: </div>
                                    {`${selectedStore.phone}`}
                                </Card.Text>
                                <Card.Text>
                                    <div className='mapsCardBold'>Fax: </div>
                                    {`${selectedStore.fax}`}
                                </Card.Text>
                                <Card.Text>
                                    <div className='mapsCardBold'>Address: </div>
                                    {`${selectedStore.state}, ${selectedStore.city}, ${selectedStore.address}, ${selectedStore.zip_code}`}
                                </Card.Text>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        className='mr-1'
                                        variant="secondary"
                                        onClick={handleBoxClose}
                                    >
                                        Close
                                </Button>
                                    <Link
                                        to={{
                                            pathname: '/screen-2',
                                            state: {
                                                id: selectedStore.id,
                                                end_time: selectedStore.end_time,
                                                start_time: selectedStore.start_time,
                                            }
                                        }}
                                    >
                                        <Button className='ml-1'>Apply</Button>
                                    </Link>
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