import React from 'react';
import numeral from 'numeral';
import {Circle, Popup} from 'react-leaflet';

const caseTypeColors = {
    cases: {
        hex: '#CC1034',
        rgb: 'rgba(204, 16, 52)',
        multiplier: 800
    },
    recovered: {
        hex: '#7dd71d',
        rgb: 'rgba(125, 215, 29)',
        multiplier: 1200,
    },
    deaths: {
        hex: '#fb4443',
        rgb: 'rgba(215, 68, 67)',
        multiplier: 2000,
    },
};


export function sortData(data) {

    return data.sort((a, b) => {
        if(a.cases > b.cases) {
            return -1;
        }
        else {
            return 1;
        }
    })

}

export const prettyPrintStat = (stat) => (
    stat ? `+${numeral(stat).format("0.0a")}` : "+0"
)

// Draw circles on the map with interactive tooltip
export const showDataOnMap = (data, casesType='cases') => (
    data.map(country => (
        <Circle center={[country.countryInfo.lat, country.countryInfo.long]} fillOpacity={0.4} color={caseTypeColors[casesType].hex} fillColor={caseTypeColors[casesType].hex} 
        radius={
            Math.sqrt(country[casesType]) * caseTypeColors[casesType].multiplier
        }>
            <Popup>
                <div className="info-container">
                    <div className="info-flag" style={{backgroundImage: `url(${country.countryInfo.flag})`}} />
                    <div className="info-name">{country.country}</div>
                    <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                    <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                    <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
                </div>
            </Popup>

        </Circle>
    ))
);