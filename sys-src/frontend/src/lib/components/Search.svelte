<script lang="ts">
    import { browser } from '$app/env'
    import { KQL_Subreddit } from '$lib/graphql/_kitql/graphqlStores'
    import Tags from 'svelte-tags-input'
    import {DateInput} from 'date-picker-svelte'


    let subreddit: string
    let keywords: string[]
    let date_from: Date;
    let date_to: Date;

    const handleSearch = event => {
        console.log(`${subreddit} ${date_from} ${date_to}`)
        browser && KQL_Subreddit.query({
            variables: {
                nameOrUrl: `r/${subreddit}`,
                keywords: keywords,
                from: date_from?.toISOString(),
                to: date_to?.toISOString(),
            }
        })
    }
</script>

<div class="flex w-1/3 flex-row flex-wrap">

    <input type="text" class="w-3/4 mb-2 border-2 border-slate-300 focus:border-orange-300 focus:outline-none px-1 border-r-0 h-9" bind:value={subreddit} placeholder="Subreddit">

    <button on:click={handleSearch} class="w-1/4 bg-orange-600 hover:bg-orange-400 rounded-r-lg border-red-700 hover:border-red-500 border-2 text-white uppercase h-9 mb-2">
        Suche
    </button>


  
    <!--<input type="text" class="w-1/2 border-2 focus:border-orange-300 focus:outline-none px-1 h-9" bind:value={keywords} placeholder="Tags">-->
    <div class="custom w-1/2">
        <Tags class="" on:tags={keywords} placeholder="Tags"/>

    </div>

    <div class="w-1/2 pl-2 justify-start">
        <div class="flex">
            <div class="mr-1"><DateInput bind:value={date_from} format="yyyy-MM-dd" placeholder="Start-Datum"/></div>
            <!--<span class="w-2/12 text-gray-500">bis</span>-->
            <div class="ml-1"><DateInput bind:value={date_to} format="yyyy-MM-dd" placeholder="End-Datum"/></div>
        </div>
    </div>

</div>
{date_from?.toISOString()}
{date_to?.toISOString()}

<style>
    .custom :global(.svelte-tags-input-tag) {
        background: rgb(253, 186, 116);
    }

    .custom :global(.svelte-tags-input-layout) {
        border-width: 1px;
        border-color: inherit;
        padding: 1px;
    }

    .custom :global(.svelte-tags-input-layout:hover) {
        border-width: 1px;
        border-color: inherit;
    }
    .custom :global(.svelte-tags-input-layout.focus), .custom :global(.svelte-tags-input-layout:focus) {
        border-width: 1px;
        border-color: rgb(253, 186, 116);
    }
    :root{
        --date-picker-selected-color: white;
        --date-picker-selected-background:  rgb(253,186,116);
        --date-picker-highlight-border:  rgb(253,186,116);
        --date-picker-highlight-shadow:  transparent;
    }
</style>