import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { AgGridReact } from 'ag-grid-react';
import Modal from 'react-modal';
import { validateAll, extend } from 'indicative/validator';
import * as _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { setStores } from '../reducer/actions';

import 'react-calendar/dist/Calendar.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import Input from '../component/Input';
import { displayDate } from '../helper/Utils';

export default function ToDoList() {
	const dispatch = useDispatch();
	const toDoArray = useSelector((state) => state.lookup.toDoArray);
	const [isAddNewTaskVisible, setIsAddNewTaskVisible] = useState(false);
	const [isEditViewVisible, setIsEditViewVisible] = useState(false);
	const [selectedId, setSelectedId] = useState(null);

	const initState = {
		taskName: '',
		estimatedTime: '',
		selectedDate: new Date(),
		isDeleted: '',
		hour: 0,
		minute: 0,
		errors: {}
	};
	const [state, setState] = useState(initState);

	// const initDisplayColumns = [
	// 	{ field: 'taskName', editable: true },
	// 	{ field: 'estimatedTime' },
	// 	{ field: 'selectedDate', sortable: true }
	// ];
	// const [displayColumns] = useState(initDisplayColumns);

	const openOrCloseModel = () => {
		setIsAddNewTaskVisible(!isAddNewTaskVisible);
	};

	const openOrCloseEditModel = (isUpdate = false) => {
		if (isUpdate) {
			const objIndex = toDoArray.find((obj => obj.id === selectedId));
			objIndex.taskName = state.taskName;
			objIndex.estimatedTime = `${state.hour}:${state.minute}`;
			objIndex.selectedDate = state.selectedDate;
			objIndex.hour = state.hour;
			objIndex.minute = state.minute;
			dispatch(setStores([...toDoArray, objIndex]));
		}
		setIsEditViewVisible(!isEditViewVisible);
	};

	const onValueChange = (e) => {
		if (e?.target?.id) {
			setState({
				...state,
				[e.target.id]: e.target.value,
				errors: {}
			});
		}
		else {
			setState({
				...state,
				selectedDate: e,
				errors: {}
			});
		}
	};

	extend('validHoursMinite', {
		validate() {
			if (Number(state.hour) === 0 && Number(state.minute === 0)) {
				return false;
			}
			return true;
		}
	});

	const onAddTask = () => {
		const messages = {
			'taskName.required': 'Please enter Task name',
			'selectedDate.required': 'Please select a date',
			'hour.validHoursMinite': 'Please select estimeted time',
			'minute.validHoursMinite': 'Please select estimeted time'
		};

		const rules = {
			taskName: 'required',
			selectedDate: 'required',
			hour: 'validHoursMinite',
			minute: 'validHoursMinite'
		};

		validateAll(state, rules, messages)
			.then(() => {
				toDoArray.push({
					id: toDoArray.length,
					taskName: state.taskName,
					estimatedTime: `${state.hour}:${state.minute}`,
					selectedDate: displayDate(state.selectedDate),
					isDeleted: false
				});
				dispatch(setStores(toDoArray));
				openOrCloseModel();
			})
			.catch(errors => {
				const formattedErrors = {};
				errors.forEach(error => formattedErrors[error.field] = error.message);
				setState({
					...state,
					errors: formattedErrors
				});
			});
	};

	const onDeletePress = (id) => {
		const objIndex = toDoArray.find((obj => obj.id === id));
		objIndex.isDeleted = true;
		dispatch(setStores([...toDoArray, objIndex]));
	};

	const onEditPress = (id) => {
		const objIndex = toDoArray.findIndex((obj => obj.id === id));
		const task = toDoArray[objIndex];
		setState({
			...state,
			taskName: task.taskName,
			estimatedTime: task.estimatedTime,
			selectedDate: new Date(task.selectedDate),
			isDeleted: task.isDeleted,
			hour: Number(task.estimatedTime.split(':')[0]),
			minute: Number(task.estimatedTime.split(':')[1])
		});
		setSelectedId(id);
		setIsEditViewVisible(true);
		setIsAddNewTaskVisible(false);
	};

	return (
		<>
			<div className='container ag-theme-alpine'>
				{
					toDoArray.length ?
						<table className='table'>
							<thead className='thead-dark'>
								<tr>
									{/* <th scope='col'>Id</th> */}
									<th scope='col'>Nask Name</th>
									<th scope='col'>Date</th>
									<th scope='col'>Estimated Time</th>
									<th scope='col'>Action</th>
								</tr>
							</thead>
							<tbody>
								{toDoArray.map(item => (
									item.isDeleted ? null :
										<tr key={item.id}>
											{/* <th scope='row'>{item.id}</th> */}
											<td>{item.taskName}</td>
											<td>{displayDate(item.selectedDate)}</td>
											<td>{item.estimatedTime}</td>
											<td><i className='fa fa-trash text-danger' aria-hidden='true' onClick={() => onDeletePress(item.id)} />
												<i className='fas fa-edit px-md-5' aria-hidden='true' onClick={() => onEditPress(item.id)} />
											</td>
										</tr>
								))}
							</tbody>
						</table>
						: <h4 className='text-center text-danger'>No data found Please add new Todo List</h4>
				}

				{/* <AgGridReact rowData={toDoArray} columnDefs={displayColumns} /> */}
				<button className='btn btn-primary' onClick={() => openOrCloseModel()} >Add new task</button>
			</div>

			<Modal isOpen={isAddNewTaskVisible} onRequestClose={() => openOrCloseModel()}>
				<div className='container'>
					<button className='btn btn-danger float-end' onClick={() => openOrCloseModel()}>Close</button>
					<Input
						placeholder='Please enter Task name'
						onChange={(e) => onValueChange(e)}
						label='Task Name'
						id='taskName'
						value={state.taskName}
						errorMessage={state.errors.taskName}
					/>

					<h5>Date</h5>
					<Calendar
						id='selectedDate'
						onChange={onValueChange} value={state.selectedDate}
					/>

					<h4 className='text-danger'>{state.errors.selectedDate}</h4>
					<h5>Estimated Time</h5>
					<div className='container'>
						<div className='row'>
							<div className='col'>
								<select className='form-select' aria-label='Default select example' id='hour' onChange={(e) => onValueChange(e)}>
									{
										_.range(0, 24).map(i => <option key={i} value={i}>{i}</option>)
									}
								</select>
							</div>

							<div className='col-md-auto'>
								<h4>:</h4>
							</div>

							<div className='col'>
								<select className='form-select' aria-label='Default select example' id='minute' onChange={(e) => onValueChange(e)}>
									{
										_.range(0, 60).map(i => <option key={i} value={i}>{i}</option>)
									}
								</select>
							</div>
						</div>
					</div>
					<h5 className='text-danger'>{state.errors.hour || state.errors.minute}</h5>
					<button className='btn btn-primary' onClick={() => onAddTask()} >Add task</button>
				</div>
			</Modal>

			<Modal isOpen={isEditViewVisible} onRequestClose={() => openOrCloseEditModel()}>
				<div className='container'>
					<button className='btn btn-info float-end' onClick={() => openOrCloseEditModel(true)}>Update</button>
					<Input
						placeholder='Please enter Task name'
						onChange={(e) => onValueChange(e)}
						label='Task Name'
						id='taskName'
						value={state.taskName}
						errorMessage={state.errors.taskName}
					/>

					<h5>Date</h5>
					<Calendar
						id='selectedDate'
						onChange={onValueChange} value={state.selectedDate}
					/>
					<h4 className='text-danger'>{state.errors.selectedDate}</h4>
					<h5>Estimated Time</h5>
					<div className='container'>
						<div className='row'>
							<div className='col'>
								<select className='form-select' aria-label='Default select example' id='hour' onChange={(e) => onValueChange(e)}>
									{
										_.range(0, 24).map(i => <option key={i} value={i} selected={state.hour === i}>{i}</option>)
									}
								</select>
							</div>

							<div className='col-md-auto'>
								<h4>:</h4>
							</div>

							<div className='col'>
								<select className='form-select' aria-label='Default select example' id='minute' onChange={(e) => onValueChange(e)}>
									{
										_.range(0, 60).map(i => <option key={i} value={i} selected={state.minute === i}>{i}</option>)
									}
								</select>
							</div>
						</div>
					</div>
					<h5 className='text-danger'>{state.errors.hour || state.errors.minute}</h5>
				</div>
			</Modal>
		</>
	)
}