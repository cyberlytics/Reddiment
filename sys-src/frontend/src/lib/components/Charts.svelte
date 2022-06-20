<script lang="ts">
    import Chart from "../shared/Chart.svelte";

    let options = {
        series: [
            {
                name: "GME",
                data: [
                    [1653602400000,0.76],
                    [1653606000000,0.34],
                    [1653609600000,0.12],
                    [1653624000000,0.64],
                    [1653627600000,0.06],
                    [1653631200000,0.24],
                    [1653634800000,0.79],
                    [1653638400000,0.31],
                    [1653642000000,0.72],
                    [1653645600000,0.87],
                    [1653649200000,0.38],
                    [1653652800000,0.04]
                ]
            }],
        chart: {
            id: 'area-datetime',
            type: 'bar',
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
            tickAmount: 6,
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
        title: {
          text: "Sentiment",
          align: "center"
        },
        colors:['#F44336'],
    };

    const options2 = {
        chart: {
            type: "line",
            width: 700,
            height: 400,
            toolbar: {
                tools: {
                    download: false,
                    pan: false
                }
            }
        },
        series: [
            {
                name: "GME",
                data: [
                    [1653602400000,100],
                    [1653606000000,77],
                    [1653609600000,80],
                    [1653613200000,42],
                    [1653616800000,65],
                    [1653620400000,57],
                    [1653624000000,64],
                    [1653627600000,110],
                    [1653631200000,99],
                    [1653634800000,70],
                    [1653638400000,90],
                    [1653642000000,92],
                    [1653645600000,87],
                    [1653649200000,38],
                    [1653652800000,4]
                ]
            }],
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
            }
        ],
        colors:['#F44336'],
        title: {
            text: "Erwähnungen",
            align: "center"
        },
    };
</script>

<div class="grid grid-cols-2 gap-4">
    <div class="flex justify-center items-center bg-white rounded-lg m-4 pt-4 pb-2">
        <Chart options={options}/>
    </div>
    <div class="flex justify-center items-center bg-white rounded-lg m-4 pt-4 pb-2">
        <Chart options={options2}/>
    </div>
</div>
