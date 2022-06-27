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
    //let datepicker: Node;
    //onMount(() => {
    //    datepicker.addEventListener("changeMonth", (evt) => evt.detail.date)
    //})
    
    onTagInput => (evt) => keywords = [...evt.detail.tags];
    
</script>

<div class="flex w-1/3 flex-row flex-wrap">

    <input type="text" class="w-3/4 mb-2 border-2 border-slate-300 focus:border-orange-300 focus:outline-none px-1 border-r-0 h-9" bind:value={subreddit} placeholder="Subreddit">

    <button on:click={handleSearch} class="w-1/4 bg-orange-600 hover:bg-orange-400 rounded-r-lg border-red-700 hover:border-red-500 border-2 text-white uppercase h-9 mb-2">
        Suche
    </button>


  
    <!--<input type="text" class="w-1/2 border-2 focus:border-orange-300 focus:outline-none px-1 h-9" bind:value={keywords} placeholder="Tags">-->
    <div class="custom w-1/2">
        <Tags class="" on:tags={onTagInput} placeholder="Tags"/>

    </div>
    
    <!-- Without Tailwind - using two separate Date-Picker -->
    <div class="w-1/2 pl-2 justify-start">
        <div class="flex">
            <div class="mr-1"><DateInput bind:value={date_from} format="yyyy-MM-dd" placeholder="Start-Datum"/></div>
            <!--<span class="w-2/12 text-gray-500">bis</span>-->
            <div class="ml-1"><DateInput bind:value={date_to} format="yyyy-MM-dd" placeholder="End-Datum"/></div>
        </div>
    </div>
    
    
    <!-- With Tailwind Date-Range Picker -->
    <!--<div class="w-1/2 pl-2 justify-start">
        <div date-rangepicker class="flex items-center" bind:this={datepicker} >
            <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
                </div>
                <input bind:value={date_from} type="text" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Start-Datum">
            </div>
            <span class="mx-2 text-gray-500">bis</span>
            <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
            </div>
            <input bind:value={date_to} type="text" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="End-Datum">
        </div>
        </div>
    </div>-->

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