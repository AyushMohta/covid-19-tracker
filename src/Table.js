import React from 'react';
import './Table.css';

function Table(props) {
    return (
        <div className="table"> 
            {props.countries.map(country => (
                <tr key={country.country}>
                    <td>{country.country}</td>
                    <td>{country.cases}</td>
                </tr>
            ))}
        </div>
    )
}

export default Table
