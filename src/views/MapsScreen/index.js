import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { Link } from 'react-router-dom';

import LoadingButton from 'react-bootstrap-button-loader'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

import { MdLocationOn } from 'react-icons/md'

import { url } from '../../constants'

const mapStyles = {
	width: '100%',
	height: '100vh',
};

const MapsScreen = ({ google }) => {
	const [stores, setStores] = useState([]);
	const [isBoxShow, setIsBoxShow] = useState({b: true});
	const [selectedStore, setSelectedStore] = useState({});
	const [position, setPosition] = useState({
		lat: 40.6971494,
		lng: -74.0598655,
	});
	const [loading, setLoading] = useState(false)
	const [nearestBranch, setNearestBranch] = useState(null)

	const effect = async () => {
		try {
			let { data } = await axios.get(`${url}/branches`);

			setStores([...data]);
		} catch (err) {
			console.log('error: ', err);
		}
	};

	useEffect(() => {
		effect();
	}, []);

	const onMarkerClick = (store, toggle) => {
		setIsBoxShow({});
		setSelectedStore(store);
		setPosition({
			lat: store.markercoords.split(',')[0],
			lng: store.markercoords.split(',')[1],
		});
		setIsBoxShow({a: true});
	};

	const handleBoxClose = () => {
		setIsBoxShow({b: true});
		setSelectedStore({});
	};

	const handleLocateMe = (e) => {
		if('geolocation' in navigator){
			navigator.geolocation.getCurrentPosition(position => {
				console.log('position: ', position)
				console.log("Latitude is :", position.coords.latitude);
				console.log("Longitude is :", position.coords.longitude);
			});
		} else {
			console.log('Not Avalaible')
		}
		setLoading(true)
		setTimeout(() => {
			setNearestBranch(stores[0])
			setLoading(false)
		}, 3000);
	}

	return (
		<>
			<Map
				zoom={10.5}
				google={google}
				style={mapStyles}
				center={position}
				initialCenter={position}>
				{stores.map((store, index) => (
					<Marker
						id={index}
						key={index}
						title={store.name}
						position={{
							lat: store.markercoords.split(',')[0],
							lng: store.markercoords.split(',')[1],
						}}
						onClick={() => onMarkerClick(store)}
					/>
				))}
			</Map>
			<div className='mapsContainer'>
				{isBoxShow.b ? (
					<div className='absoluteCard'>
						{loading ? (
							<div style={{display: 'flex', justifyContent: 'space-between'}}>
								<LoadingButton variant='secondary' loading={true} />
								<Button variant='secondary' onClick={() => setIsBoxShow({})}>x</Button>
							</div>
						) : (
							<div style={{display: 'flex', justifyContent: 'space-between'}}>
								<Button
									variant='secondary'
									onClick={handleLocateMe}
								>
									<MdLocationOn />
									{' Locate me'}
								</Button>
								<Button variant='secondary' onClick={() => setIsBoxShow({})}>x</Button>
							</div>
						)}
						{nearestBranch ? (
							<div className='resultLocationsBox'>
								<p>Nearest branch to you</p>
								<div
									className='branchCard'
									onClick={() => onMarkerClick(nearestBranch)}
								>
									<div className='mapsCardBold'>{nearestBranch.name}</div>
									<div>
										{`${nearestBranch.state}, ${nearestBranch.city}, ${nearestBranch.address}, ${nearestBranch.zip_code}`}
									</div>
								</div>
							</div>
						) : null}
						<div className='resultLocationsBox'>
							<p>Branches</p>
							{stores.map((store, index) => (
								<div
									key={index}
									className='branchCard'
									onClick={() => onMarkerClick(store)}
								>
									<div className='mapsCardBold'>{store.name}</div>
									<div>
										{`${store.state}, ${store.city}, ${store.address}, ${store.zip_code}`}
									</div>
								</div>
							))}
						</div>
					</div>
				) : null}
				{isBoxShow.a ? (
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
									<div className='mapsCardBold'>
										Address:{' '}
									</div>
									{`${selectedStore.state}, ${selectedStore.city}, ${selectedStore.address}, ${selectedStore.zip_code}`}
								</Card.Text>
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
									}}>
									<Button
										className='mr-1'
										variant='secondary'
										onClick={handleBoxClose}>
										Close
									</Button>
									<Link
										to={{
											pathname: '/screen-2',
											state: {
												id: selectedStore.id,
												end_time:
													selectedStore.end_time,
												start_time:
													selectedStore.start_time,
											},
										}}>
										<Button className='ml-1'>Apply</Button>
									</Link>
								</div>
							</Card.Body>
						</Card>
					</div>
				) : null}
			</div>
		</>
	);
};

export default GoogleApiWrapper({
	apiKey: 'AIzaSyB8czjIJ9xo666_Y0_S4EChl9nJ8PGO6aY',
})(MapsScreen);
