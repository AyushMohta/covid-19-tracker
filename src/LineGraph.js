import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';
// import {Line} from 'react-chartjs-2';

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: { // when you're gonna hover over the graph u'll be able to see the data at that point
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            }
        }
    },
    scales: {
        xAxes: [{
            type: "time",
            time: {
                format: "MM/DD/YY",
                tooltipFormat: "ll"
            },
        },],
        yAxes: [{
            gridLines: {
                display: false, // ******
            },
            ticks: {
                callback: function (value, index, values) {
                    return numeral(value).format("0a");
                },
            },
        },],
    }
}

function LineGraph({casesType = "cases"}) {

    const [data, setData] = useState({});

    function buildChartData(data, casesType='cases') {
        const chartData = [];   // contains {x: 21/9/20, y: no. of cases}
        let lastDataPoint;

        for(let date in data[casesType]) {
            if(lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint)
            }
            lastDataPoint = data[casesType][date];
        };
        return chartData;
    }

    useEffect(() => {
        async function fetchData() {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(res => res.json())
            .then(data => {
                const chartData = buildChartData(data);  // array of objects
                // console.log(chartData);
                setData(chartData);
            })
        }
        fetchData();

    }, [casesType])


    return (
        <div>
            {data.length > 0 ?
                <Line data={{
                    datasets: [{
                        backgroundColor: "rgba(204, 16, 52, 0.6)",
                        borderColor:"#cc1034",
                        data: data
                    },],
                }} options ={options} />
            : ''}
        </div>
    )
}

export default LineGraph


