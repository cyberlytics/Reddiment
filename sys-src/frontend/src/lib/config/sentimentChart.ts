export const sentimentChart = {
    chart: {
        id: 'area-datetime',
        type: 'bar',
        stacked: true,
        height: 400,
        width: 700,
        zoom: {
            autoScaleYaxis: true
        },
        toolbar: {
            tools: {
                download: false,
                pan: false
            }
        }
    },
    dataLabels: {
        enabled: false
    },
    markers: {
        size: 0,
        style: 'hollow',
    },
    xaxis: {
        type: 'datetime',
        title: {
            text: "Datum"
        },
    },
    yaxis: [
        {
            title: {
                text: "Sentiment"
            },
        }
    ],
    tooltip: {
        x: {
            format: 'dd MMM yyyy'
        }
    },
    colors:[ '#d11141', '#ffc425', '#00b159'],
    title: {
        text: "Sentiment",
        align: "center"
    },

}
