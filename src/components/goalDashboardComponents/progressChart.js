import React from "react"
import Chart from "react-apexcharts";

function ProgressChart(props) {
    //console.log(props.data)
    var data = []
    var dates = []
    const arr = props.data ? Object.values(props.data) : []
    arr.map((item, index) => {
        data.push(item.value)
        const date = new Date(item.date).getTime()
        dates.push(date)
    })

    
    console.log(props.reversed)
    console.log(Math.min.apply(null, data))

    //console.log(data)
    //console.log(dates)
    //console.log("Target value: "+props.targetValue)

    const chart = {

        series: [{
            name: 'Result',
            data: data
        }],
        options: {
            chart: {
                height: 350,
                type: 'line',
            },
            stroke: {
                width: 7,
                curve: 'smooth'
            },
            xaxis: {
                type: 'datetime',
                categories: dates,
                
            },
            title: {
                text: 'Progress Line Chart',
                align: 'left',
                style: {
                    fontSize: "16px",
                    color: '#666'
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    gradientToColors: ['#FDD835'],
                    shadeIntensity: 1,
                    type: 'horizontal',
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 100, 100, 100]
                },
            },
            markers: {
                size: 6,
                colors: ["#FFA41B"],
                strokeColors: "#fff",
                strokeWidth: 2,
                hover: {
                    size: 10,
                }
            },
            yaxis: {
                min: props.reversed ? parseFloat(props.targetValue) : Math.min.apply(null, data), //10.0
                max: props.reversed ? Math.max.apply(null, data) : parseFloat(props.targetValue),  //11.0 
                title: {
                    text: 'Result',
                },
                reversed: props.reversed
            }
        },
    };


    return (
        <Chart options={chart.options} series={chart.series} type="line" height={props.height+"px"} />
    )
}

export default ProgressChart;