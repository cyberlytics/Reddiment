<script lang="ts">
    import Chart from "../shared/Chart.svelte";
    import { sentiment } from "../mocks/sentimentMock";
    import { mentions } from "../mocks/mentionsMock";
    import { sentimentChart } from "../config/sentimentChart";
    import { mentionsChart} from "../config/mentionsChart";

    let sentimentChartOptions = {
        series: sentiment,
        ...sentimentChart
    };

    let mentionsChartOptions = {
        series: mentions,
        ...mentionsChart
    };
</script>

<div class="grid grid-cols-2 gap-4">
    <div class="flex justify-center items-center bg-white rounded-lg m-4 pt-4 pb-2">
        <Chart options={sentimentChartOptions}/>
    </div>
    <div class="flex justify-center items-center bg-white rounded-lg m-4 pt-4 pb-2">
        <Chart options={mentionsChartOptions}/>
    </div>
</div>
