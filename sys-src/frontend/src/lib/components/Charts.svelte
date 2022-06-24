<script lang="ts">
    import Chart from "../shared/Chart.svelte";
    import { mentions } from "../mocks/mentionsMock";
    import { sentimentChart } from "../config/sentimentChart";
    import { mentionsChart} from "../config/mentionsChart";
    import { KQL_Stock } from "../graphql/_kitql/graphqlStores";
    import { KQL_Subreddit } from "../graphql/_kitql/graphqlStores";

    let sentimentChartOptions = {
        series: [
            {
                name: "Positiv",
                data: $KQL_Subreddit.data?.subreddit?.sentiment.map(s => [Date.parse(s["time"]), s["positive"]]) ?? []
            },
            {
                name: "Negativ",
                data: $KQL_Subreddit.data?.subreddit?.sentiment.map(s => [Date.parse(s["time"]), s["negative"]]) ?? []
            },
            {
                name: "Neutral",
                data: $KQL_Subreddit.data?.subreddit?.sentiment.map(s => [Date.parse(s["time"]), s["neutral"]]) ?? []
            },
        ],
        ...sentimentChart
    };

    let mentionsChartOptions = {
        series: mentions,
        ...mentionsChart
    };

    $: {
        let myData = [
            {
                name: "Erwähnungen",
                data: []
            },
            {
                name: "Aktienpreis",
                data: $KQL_Stock.data?.stock?.values?.map(v => [Date.parse(v["time"]), v["close"]]) ?? []
            }
        ]
        console.log(myData)
    }
</script>

<div class="grid grid-cols-2 gap-4">
    <div class="flex justify-center items-center bg-white rounded-lg m-4 pt-4 pb-2">
        <Chart options={sentimentChartOptions}/>
    </div>
    <div class="flex justify-center items-center bg-white rounded-lg m-4 pt-4 pb-2">
        <Chart options={mentionsChartOptions}/>
    </div>
</div>
