import React from "react"
import Chart from "react-apexcharts";

export default function CategoryChart(props) {
    const categories = Object.keys(props.categories)
    var values = Object.values(props.categories)

    var completedCount = []
    var inCompletedCount = []

    console.log(props.categories)
    values.forEach(element => {
        completedCount.push(element.completedCount)
        inCompletedCount.push(element.count - element.completedCount)
    });


    const chart = {
        options: {
            chart: {
                type: 'bar',
                stacked: true,
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: true
                }
            },
            xaxis: {
                categories: categories
            },
            fill: {
                opacity: 1,
                colors: ["#008FFB", "#00E396"]
            }

        },
        series: [
            {
                name: 'Not Completed',
                data: inCompletedCount
            },
            {
                name: 'Completed',
                data: completedCount
            }]
    }

    return (
        <Chart options={chart.options} series={chart.series} type="bar" height="100%" />
    )
}