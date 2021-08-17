import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import './App.css';
import InfoBox from './InfoBox';
import LineGraph from './LineGraph';
import Map from './Map';
import Table from './Table';
import {sortData, prettyPrintStat} from './util';
import 'leaflet/dist/leaflet.css';


function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);


  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(res => res.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, [])

  useEffect(() => {
    // The code inside here will run once when the component loads and not again
    async function getCountriesData() {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        // data returns an array of objects containing each country's information
        const countries = data.map(country => (
          {
            name: country.country,
            value: country.countryInfo.iso2, // US, UK, IND
            key: country.country
          }
        ));
        
        setCountries(countries);
        setMapCountries(data);
        const sortedData = sortData(data);
        setTableData(sortedData);
      })
    }
    getCountriesData();
  }, []); // based on countries


  async function onCountryChange(event) {
      const countryCode = event.target.value;
      
      const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
      
      await fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter({
          lat : data.countryInfo.lat,
          lng: data.countryInfo.long
        });
        setMapZoom(4);
      })
      
      // https://disease.sh/v3/covid-19/all - WorldWide
      // https://disease.sh/v3/covid-19/countries/[Country_code]
  }

  // console.log(countryInfo);

  return (
    <div className="app">
      <div className="app__left">
        {/* Header */}
        <div className="app__header">
          {/* Title + Countries DropDown */}
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {countries.map(country => (
                <MenuItem key={country.name} value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      
        <div className="app__stats">
          {/* InfoBoxes */}
          <InfoBox title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)} />
          {/* InfoBoxes */}
          <InfoBox title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)} />
          {/* InfoBoxes */}
          <InfoBox title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)} />
        </div>

        {/* Map */}
        <Map countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>
      
      <Card className="app__right">
        <CardContent>
          {/* Table */}
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}/>
          {/* Graph */}
          <h3>Worldwide new cases</h3>
          <LineGraph />
        </CardContent>        
      </Card>
    </div>
  );
}

export default App;
