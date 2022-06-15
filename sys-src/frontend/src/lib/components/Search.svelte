<script lang="ts">
    import { browser } from '$app/env'
    import { KQL_Subreddit } from '$lib/graphql/_kitql/graphqlStores'
    import Tags from 'svelte-tags-input'

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

    const changeStartDate = evt => date_from = evt.detail.date;
    const changeEndDate = evt => date_to = evt.detail.date;

</script>

<div class="flex justify-around m-4 pt-4 pb-4 bg-gray-50 rounded-lg">
    <input
        type="text"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
        placeholder="Subreddit"
        bind:value={subreddit}
        required
    >

    <!--<input type="text" class="w-1/2 border-2 focus:border-orange-300 focus:outline-none px-1 h-9" bind:value={keywords} placeholder="Tags">-->
    <div class="custom">
        <Tags class="" on:tags={keywords} placeholder="Tags"/>
    </div>

    <div date-rangepicker class="flex items-center">
        <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
            </div>
            <input
                name="start"
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                on:changeDate={changeStartDate}
                placeholder="Startdatum wählen"
            >
        </div>
        <span class="mx-4 text-gray-500">bis</span>
        <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
            </div>
            <input
                name="end"
                type="text"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                on:changeDate={changeEndDate}
                placeholder="Enddatum wählen"
            >
        </div>
    </div>

    <button on:click={handleSearch} class="w-1/6 bg-orange-500 hover:bg-orange-400 rounded-lg text-white uppercase">
        Suche
    </button>

</div>

<style>
    .custom :global(.svelte-tags-input-tag) {
        background: rgb(0, 0, 0);
    }

    .custom :global(.svelte-tags-input-layout:hover) {
        border-width: 1px;
        border-color: inherit;
    }
    .custom :global(.svelte-tags-input-layout.focus), .custom :global(.svelte-tags-input-layout:focus) {
        border-width: 1px;
        border-radius: 0.5rem;
    }
    :root{
        --date-picker-selected-color: white;
        --date-picker-selected-background:  rgb(253,186,116);
        --date-picker-highlight-border:  rgb(253,186,116);
        --date-picker-highlight-shadow:  transparent;
    }
</style>
