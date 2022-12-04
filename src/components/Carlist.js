import React,{ useState, useEffect } from 'react';
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css"; 
import Button from '@mui/material/Button';
import Addcar from './Addcar';
import Editcar from './Editcar';

export default function Carlist() {
    const [cars, setCars] = useState([]);

    useEffect(() => fetchData() , []); //fetchData function will call after first round

    const fetchData = () => {
        fetch('https://carstockrest.herokuapp.com/cars')
        .then(response => response.json())
        .then(data => setCars(data._embedded.cars))
    }

    const deleteCar = (link) => {
        //console.log(link);
        if(window.confirm("Are you sure?")){
        fetch(link, {method: 'DELETE'}) //{object}
        .then(res => fetchData())
        .catch(err => console.error(err))
        }
        //could try snackbar from component(https://mui.com/material-ui/react-snackbar/)
    }

    const saveCar = (car) => {
        fetch('https://carstockrest.herokuapp.com/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => console.error(err))
    }

    const updateCar = (car, link) => {
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => console.error(err))
    }

    const columns = [
        {
            Header: 'Brand',
            accessor:'brand'
        },
        {
            Header:'Model',
            accessor:'model'
        },
        {
            Header:'Color',
            accessor:'color'
        },
        {
            Header:'Fuel',
            accessor:'fuel'
        },
        {
            Header:'Year',
            accessor:'year'
        },
        {
            Header:'Price',
            accessor:'price'
        },
        {
            sortable: false,
            filterable: false,
            width: 100,
            Cell: row => <Editcar updateCar = {updateCar} car={row.original} />
        },
        {
            sortable: false,
            filterable: false,
            width: 100,
            accessor:'_links.self.href',
            Cell: row => <Button color="secondary" size="small"  onClick={() => deleteCar(row.value)}>Delete</Button>
            //because already import the Buttom materails, so we could change button--> Button
            // <button onClick={() => deleteCar(row.value)}>Delete</button>--> <Button></Button>
        }
    ]
    return (
        <div>
            <Addcar saveCar={saveCar} />
            <ReactTable filterable={true} data={cars} columns={columns} />
        </div>
    )
}