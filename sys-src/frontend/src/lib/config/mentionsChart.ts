export const mentionsChart = {
    chart: {
        type: "area",
        width: 700,
        height: 400,
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
    xaxis: {
        type: 'datetime',
        tickAmount: 6,
        title: {
            text: "Datum"
        },
    },
    yaxis: [
        {
            title: {
                text: "Erwähnungen"
            },
        },
        {
            opposite: true,
            title: {
                text: "Aktienpreis"
            }
        }
    ],
    colors:['#f37735', '#00aedb'],
    title: {
        text: "Erwähnungen",
        align: "center"
    },
}
