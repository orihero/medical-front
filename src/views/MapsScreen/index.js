import axios from 'axios';
import { GoogleApiWrapper, Map, Marker } from 'google-maps-react';
import React, { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import LoadingButton from 'react-bootstrap-button-loader';
import MaskedInput from 'react-bootstrap-maskedinput';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { MdLocationOn } from 'react-icons/md';
import PlacesAutocomplete from 'react-places-autocomplete';
import DateTimePicker from 'reactstrap-date-picker';
import swal from 'sweetalert';
import validator from 'validator';
import { Screen3Str, url } from '../../constants';

let weekDays = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
];

function distance(lat1, lon1, lat2, lon2, unit = 'K') {
	if (lat1 == lat2 && lon1 == lon2) {
		return 0;
	} else {
		var radlat1 = (Math.PI * lat1) / 180;
		var radlat2 = (Math.PI * lat2) / 180;
		var theta = lon1 - lon2;
		var radtheta = (Math.PI * theta) / 180;
		var dist =
			Math.sin(radlat1) * Math.sin(radlat2) +
			Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = (dist * 180) / Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit == 'K') {
			dist = dist * 1.609344;
		}
		if (unit == 'N') {
			dist = dist * 0.8684;
		}
		return dist;
	}
}

const {
	idk1,
	idk2,
	fullnameText,
	firstnameText,
	lastnameText,
	phoneText,
	addressText,
	emailText,
} = Screen3Str;

const mapStyles = {
	width: '100%',
	height: '100vh',
};

const MapsScreen = ({ google }) => {
	const [stores, setStores] = useState([]);
	const [isBoxShow, setIsBoxShow] = useState({ b: true });
	const [selectedStore, setSelectedStore] = useState({});
	const [position, setPosition] = useState({
		lat: 40.6971494,
		lng: -74.0598655,
	});
	const [loading, setLoading] = useState(false);
	const [nearestBranch, setNearestBranch] = useState(null);

	const [state, setState] = useState({
		email: '',
		phone: '',
		comment: '',
		address: '',
		firstname: '',
		lastname: '',
		branch_id: '',
		arrived_at: null,
	});
	const [modalShow, setModalShow] = useState(false);
	const [errorText, setErrorText] = useState({});
	const [times, setTimes] = useState([]);
	const [occupiedTimes, setOccupiedTimes] = useState([]);

	const handleWorkTime = (start, end) => {
		let arr = [];
		let tmpTime = start;
		console.log({ tmps: tmpTime < end, start, end });
		while (tmpTime < end) {
			arr = [...arr, new Date(tmpTime)];

			let tmpTimeHour = tmpTime.getHours();
			let tmpTimeMinutes = tmpTime.getMinutes() + 5;
			let tmpTimeSeconds = tmpTime.getSeconds();
			let tmpTimeMillieconds = tmpTime.getMilliseconds();

			tmpTime.setHours(
				tmpTimeHour,
				tmpTimeMinutes,
				tmpTimeSeconds,
				tmpTimeMillieconds
			);
		}

		return arr;
	};

	let toggleMenu = () => {
		setIsBoxShow({ b: !isBoxShow.b });
	};

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

	let checkOccupations = async () => {
		let startDay = new Date(state.date);
		let endDay = new Date(state.date);
		endDay.setDate(endDay.getDate() + 1);
		const { data } = await axios.get(
			`${url}/requests?branch_id=${
				selectedStore.id
			}&start_day=${startDay.toLocaleDateString()}&end_day=${endDay.toLocaleDateString()}`
		);
		setOccupiedTimes([...data.map((s, i) => new Date(s.arrived_at))]);
	};

	useEffect(() => {
		if (
			selectedStore &&
			Object.keys(selectedStore).length > 0 &&
			state.date
		) {
			let { date } = state;
			let start_time = new Date(
				selectedStore[
					weekDays[new Date(date).getDay()].toLowerCase() + '_start'
				]
			);
			let end_time = new Date(
				selectedStore[
					weekDays[new Date(date).getDay()].toLowerCase() + '_end'
				]
			);
			// let { start_time, end_time } = selectedStore;
			let dDate = new Date(date);
			let workTime = {
				startTime: new Date(date),
				endTime: new Date(date),
			};
			workTime.startTime.setHours(start_time.getHours());
			workTime.startTime.setMinutes(start_time.getMinutes());
			workTime.endTime.setHours(end_time.getHours() - 5);
			workTime.endTime.setMinutes(end_time.getMinutes());
			// workTime.startTime.setHours(
			// 	parseInt(start_time.split(':')[0]),
			// 	parseInt(start_time.split(':')[1]),
			// 	0,
			// 	0
			// );
			// workTime.endTime.setHours(
			// 	parseInt(end_time.split(':')[0]),
			// 	parseInt(start_time.split(':')[1]),
			// 	0,
			// 	0
			// );
			console.log({ start_time, end_time });
			setTimes([...handleWorkTime(start_time, end_time)]);
			checkOccupations();
		}
	}, [selectedStore, state.date]);

	const onMarkerClick = (store, toggle) => {
		setIsBoxShow({});
		setSelectedStore(store);
		setPosition({
			lat: store.markercoords.split(',')[0],
			lng: store.markercoords.split(',')[1],
		});
		setIsBoxShow({ a: true });
	};

	const handleBoxClose = () => {
		setIsBoxShow({ b: true });
		setSelectedStore({});
	};

	const handleClose = () => {
		setModalShow(false);
		setState({
			email: '',
			phone: '',
			address: '',
			comment: '',
			firstname: '',
			lastname: '',
			branch_id: '',
			arrived_at: null,
		});
		setIsBoxShow({ b: true });
	};

	const handleSubmit = async () => {
		if (
			state.firstname &&
			state.lastname &&
			state.phone &&
			state.address &&
			state.date &&
			state.time
		) {
			try {
				let { email, phone, address, comment, firstname, lastname } = state;
				let arrived_at = new Date(state.date);
				let split = state.time.split(':');
				arrived_at.setHours(parseInt(split[0]));
				arrived_at.setMinutes(parseInt(split[1]));
				// console.log({
				// 	utc: arrived_at.toUTCString(),
				// 	loc:
				// 		,
				// });
				phone = phone
					.replace(/\s/g, '')
					.replace('(', '')
					.replace(')', '')
					.replace('-', '');
				let { id: branch_id } = selectedStore;
				let submitData = {
					email,
					phone,
					address,
					comment,
					fullname: `${firstname} ${lastname}`,
					arrived_at:
						arrived_at.toLocaleDateString() +
						' ' +
						arrived_at.toLocaleTimeString(),
					branch_id,
					type: 0,
				};
				console.log('state: ', state, { arrived_at });
				console.log('submitData: ', submitData);
				let res = await axios.post(`${url}/requests`, submitData);
				console.log('res: ', res.data);
				setErrorText({});
				setState({
					email: '',
					phone: '',
					address: '',
					comment: '',
					firstname: '',
					lastname: '',
					branch_id: '',
					arrived_at: null,
				});
				setModalShow(false);
				const willDelete = await swal({
					title: 'Success',
					text: `Thank you for Scheduling your Appointment for COVID-19 Testing
					
					We are checking availability, You will receive confirmation shortly.
					
					Thank you!
					
					We look forward to servicing you.`,
// 					text: `Thank you for scheduling your appointment for Covid-19 testing.
// the address for your testing is:

// Center Name: ${selectedStore.name}
// Center Address: ${selectedStore.address}
// Scheduled Visit Time: ${arrived_at}

// Please look for our tent on the parking lot of the address provided.

// Looking forward to servicing you.`,
					icon: 'success',
				});
				if (willDelete) {
					window.location.href = `https://covid.accureference.com/appointment?requestId=${res.data.id}`;
				}
			} catch (err) {
				setErrorText({ request: true });
			}
		} else {
			let newError = {};
			if (!state.firstname) {
				newError = { ...newError, firstname: true };
			}
			if (!state.lastname) {
				newError = { ...newError, lastname: true };
			}
			if (!state.phone) {
				newError = { ...newError, phone: true };
			}
			if (!state.address) {
				newError = { ...newError, address: true };
			}
			if (!state.date) {
				newError = { ...newError, date: true };
			}
			if (!state.arrived_at) {
				newError = { ...newError, arrived_at: true };
			}
			setErrorText(newError);
		}
	};

	const handleLocateMe = (e) => {
		setLoading(true);
		console.log('LOCATING', 'geolocation' in navigator);
		if ('geolocation' in navigator) {
			try {
				navigator.geolocation.getCurrentPosition((position) => {
					console.log('position: ', position);
					console.log('Latitude is :', position.coords.latitude);
					console.log('Longitude is :', position.coords.longitude);
					let distances = stores.map((store, index) => {
						let el = {
							lat: parseFloat(store.markercoords.split(',')[0]),
							lng: parseFloat(store.markercoords.split(',')[1]),
						};
						return {
							distance: distance(
								el.lat,
								el.lng,
								position.coords.latitude,
								position.coords.longitude
							),
							storeIndex: index,
						};
					});
					distances.sort((a, b) => a.distance - b.distance);
					setNearestBranch(stores[distances[0].storeIndex]);
					setLoading(false);
				});
			} catch (error) {
				setLoading(false);
			}
		} else {
			alert('Location is not allowed or unavailable');
			setLoading(false);
		}
	};

	let onApllyClick = () => {
		setModalShow(true);
		setIsBoxShow(false);
	};

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
				<div className='burger-button' onClick={toggleMenu}>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='24'
						height='24'
						viewBox='0 0 24 24'
						fill='none'
						stroke='black'
						stroke-width='2'
						stroke-linecap='round'
						stroke-linejoin='round'
						class='feather feather-menu'>
						<line x1='3' y1='12' x2='21' y2='12'></line>
						<line x1='3' y1='6' x2='21' y2='6'></line>
						<line x1='3' y1='18' x2='21' y2='18'></line>
					</svg>
				</div>
				{isBoxShow.b ? (
					<div className='absoluteCard'>
						{loading ? (
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
								}}>
								<LoadingButton
									variant='secondary'
									loading={true}
								/>
								<Button
									variant='secondary'
									onClick={() => setIsBoxShow({})}>
									x
								</Button>
							</div>
						) : (
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
								}}>
								<Button
									variant='secondary'
									onClick={handleLocateMe}>
									<MdLocationOn />
									{' Locate me'}
								</Button>
								<Button
									variant='secondary'
									onClick={() => setIsBoxShow({})}>
									x
								</Button>
							</div>
						)}
						{nearestBranch ? (
							<div className='resultLocationsBox'>
								<p>Nearest branch to you</p>
								<div
									className='branchCard'
									onClick={() =>
										onMarkerClick(nearestBranch)
									}>
									<div className='mapsCardBold'>
										{nearestBranch.name}
									</div>
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
									onClick={() => onMarkerClick(store)}>
									<div className='mapsCardBold'>
										{store.name}
									</div>
									<div>
										{`${store.state}, ${store.city}, ${store.address}, ${store.zip_code}`}
									</div>
								</div>
							))}
						</div>
					</div>
				) : null}
				<Modal show={isBoxShow.a}>
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
							<Card.Text>
								<div className='mapsCardBold'>Schedule: </div>
								{Object.keys(selectedStore).map((key) => {
									if (
										key
											.toLocaleLowerCase()
											.indexOf('works') !== -1 &&
										!!selectedStore[key]
									) {
										let day = key.split('_')[0];
										return (
											<p
												style={{
													textTransform: 'capitalize',
												}}>
												{day} :{' '}
												{new Date(
													selectedStore[
														day + '_start'
													]
												).toLocaleTimeString()}{' '}
												-{' '}
												{new Date(
													selectedStore[day + '_end']
												).toLocaleTimeString()}{' '}
											</p>
										);
									}
									return null;
								})}
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
								<Button onClick={onApllyClick} className='ml-1'>
									Apply
								</Button>
								{/* </Link> */}
							</div>
						</Card.Body>
					</Card>
				</Modal>
			</div>
			<Modal show={modalShow} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Your information</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					{errorText.request ? (
						<p className='mt-2' style={{ color: '#eb5757' }}>
							Error! Please check the correctness of info that you
							filled!
						</p>
					) : null}
					<Form>
						<Form.Group controlId='formBasicFullname'>
							<Form.Label>{firstnameText}</Form.Label>
							<Form.Control
								type='text'
								value={state.firstname}
								placeholder={`Enter ${firstnameText}`}
								onChange={({ target }) => {
									setState({
										...state,
										firstname: target.value,
									});
									if (!target.value) {
										setErrorText({
											...errorText,
											firstname: 'Please enter full name',
										});
									} else {
										setErrorText({});
									}
								}}
							/>
							{errorText.firstname ? (
								<Form.Text
									className='mt-2'
									style={{ color: '#eb5757' }}>
									{`Enter ${firstnameText}`}
								</Form.Text>
							) : null}
						</Form.Group>

						<Form.Group controlId='formBasicFullname'>
							<Form.Label>{lastnameText}</Form.Label>
							<Form.Control
								type='text'
								value={state.lastname}
								placeholder={`Enter ${lastnameText}`}
								onChange={({ target }) => {
									setState({
										...state,
										lastname: target.value,
									});
									if (!target.value) {
										setErrorText({
											...errorText,
											lastname: 'Please enter full name',
										});
									} else {
										setErrorText({});
									}
								}}
							/>
							{errorText.lastname ? (
								<Form.Text
									className='mt-2'
									style={{ color: '#eb5757' }}>
									{`Enter ${lastnameText}`}
								</Form.Text>
							) : null}
						</Form.Group>

						<Form.Group controlId='formBasicPhoneNumber'>
							<Form.Label>{phoneText}</Form.Label>

							<Form.Control
								type='phone'
								inputMode='tel'
								value={`${state.phone}`}
								placeholder={`Enter your phone number`}
								onFocus={() =>
									setState({ ...state, phone: '+1' })
								}
								onChange={({ target }) => {
									if (
										target.value &&
										!target.value.startsWith('+')
									) {
										setState({
											...state,
											phone: '+1' + target.value,
										});
										return;
									}
									setState({ ...state, phone: target.value });
								}}
								maxLength={12}></Form.Control>
							{errorText.phone ? (
								<Form.Text
									className='mt-2'
									style={{ color: '#eb5757' }}>
									{`Please enter valid phone number`}
								</Form.Text>
							) : null}
						</Form.Group>

						<Form.Group controlId='formBasicEmail'>
							<Form.Label>{emailText}</Form.Label>
							<Form.Control
								type='email'
								value={state.email}
								placeholder={`Enter ${emailText}`}
								onChange={({ target }) => {
									setState({ ...state, email: target.value });
									if (!validator.isEmail(target.value)) {
										setErrorText({
											...errorText,
											email:
												'Please enter valid email address',
										});
									} else {
										setErrorText({});
									}
								}}
							/>
							{errorText.email ? (
								<Form.Text
									className='mt-2'
									style={{ color: '#eb5757' }}>
									{`Please enter valid email address`}
								</Form.Text>
							) : null}
						</Form.Group>
						<Form.Group controlId='formBasicDate'>
							<Form.Label>Date of Visit*</Form.Label>
						</Form.Group>
						<DateTimePicker
							id='example-datepicker'
							value={state.date}
							onChange={(date) => {
								let dayInNY = new Date(
									Date.now()
								).toLocaleString('en-US', {
									timeZone: 'America/New_York',
								});
								let dateNY = new Date(dayInNY);
								dateNY.setDate(dateNY.getDate() + 1);
								console.log(
									new Date(date) < new Date(Date.now),
									{
										date,
										todaysDate: new Date(Date.now()),
										dayInNY,
									}
								);

								if (
									new Date(date).getDate() < dateNY.getDate()
								) {
									alert(
										'You cannot make an appointment on this day!'
									);
									setState({
										...state,
										date: '',
									});
									return;
								}
								if (
									selectedStore[
										weekDays[
											new Date(date).getDay()
										].toLowerCase() + '_works'
									]
								)
									setState({ ...state, date });
								else {
									alert(
										'You cannot make an appointment on this day!'
									);
								}
							}}
						/>
						{errorText.date ? (
							<Form.Text
								className='mt-2'
								style={{ color: '#eb5757' }}>
								{`Select date`}
							</Form.Text>
						) : null}
						<br />
						<Form.Group controlId='formBasicTime'>
							<Form.Label>Visit time*</Form.Label>
							<Form.Control
								as='select'
								value={state.time}
								placeholder={`Select visit time`}
								onChange={({ target }) =>
									setState({ ...state, time: target.value })
								}>
								{times.map((item, key) => {
									let occupied = occupiedTimes.find(
										(occupiedTime) =>
											occupiedTime.getHours() ===
												item.getHours() &&
											occupiedTime.getMinutes() ===
												item.getMinutes()
									);
									return (
										<option key={key} disabled={occupied}>
											{item.getMinutes() >= 10
												? `${item.getHours()}:${item.getMinutes()}`
												: `${item.getHours()}:0${item.getMinutes()}`}{' '}
											{occupied ? 'Occupied' : ''}
										</option>
									);
								})}
							</Form.Control>
						</Form.Group>
						{errorText.arrived_at ? (
							<Form.Text
								className='mt-2'
								style={{ color: '#eb5757' }}>
								{`Select visit time`}
							</Form.Text>
						) : null}
						<PlacesAutocomplete
							value={state.address}
							onChange={(address) =>
								setState({
									...state,
									address,
								})
							}
							onSelect={(address, pl) => {
								setState({
									...state,
									address,
								});
							}}>
							{({
								getInputProps,
								suggestions,
								getSuggestionItemProps,
								loading,
							}) => (
								<Form.Group controlId='formBasicAddress'>
									<Form.Label>Enter your address</Form.Label>
									<Form.Control
										type='text'
										value={state.address}
										placeholder={`Enter ${addressText}`}
										onChange={({ target }) =>
											setState({
												...state,
												address: target.value,
											})
										}
										{...getInputProps({
											placeholder: 'Enter your address',
											className: 'location-search-input',
										})}
									/>
									{errorText.address ? (
										<Form.Text
											className='mt-2'
											style={{ color: '#eb5757' }}>
											{`Enter ${addressText}`}
										</Form.Text>
									) : null}
									<div className='autocomplete-dropdown-container'>
										{loading && <div>Loading...</div>}
										{suggestions.map((suggestion) => {
											const className = suggestion.active
												? 'suggestion-item--active'
												: 'suggestion-item';
											// inline style for demonstration purpose
											const style = suggestion.active
												? {
														backgroundColor:
															'#fafafa',
														cursor: 'pointer',
												  }
												: {
														backgroundColor:
															'#ffffff',
														cursor: 'pointer',
												  };
											return (
												<div
													{...getSuggestionItemProps(
														suggestion,
														{
															className,
															style,
														}
													)}>
													<span>
														{suggestion.description}
													</span>
												</div>
											);
										})}
									</div>
								</Form.Group>
							)}
						</PlacesAutocomplete>

						<Form.Group controlId='exampleForm.ControlTextarea1'>
							<Form.Label>Comment</Form.Label>
							<Form.Control
								rows='3'
								as='textarea'
								value={state.comment}
								onChange={({ target }) =>
									setState({
										...state,
										comment: target.value,
									})
								}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>

				<Modal.Footer>
					<Button variant='secondary' onClick={handleClose}>
						Close
					</Button>
					<Button variant='primary' onClick={handleSubmit}>
						{idk1}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default GoogleApiWrapper({
	apiKey: 'AIzaSyB8czjIJ9xo666_Y0_S4EChl9nJ8PGO6aY',
})(MapsScreen);
