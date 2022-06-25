<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from '$app/env'
    import {
        KQL_Subreddit,
        KQL_Subreddits,
        KQL_Stock
    } from '$lib/graphql/_kitql/graphqlStores'
    import Tags from 'svelte-tags-input'

    let subreddit: string
    let keywords: string[]
    let date_from: Date;
    let date_to: Date;

    const changeStartDate = evt => date_from = evt.detail.date;
    const changeEndDate = evt => date_to = evt.detail.date;
    const addTagInput = evt => keywords = [...evt.detail.tags];

    const handleSearch = () => {
        // Query subreddit data
        browser && KQL_Subreddit.query({
            variables: {
                nameOrUrl: subreddit,
                keywords: keywords,
                from: date_from?.toISOString(),
                to: date_to?.toISOString(),
            }
        })

        // Query stock data
        browser && KQL_Stock.query({
            variables: {
                name: keywords[0],
                from: date_from?.toISOString(),
                to: date_to?.toISOString(),
            }
        })
    }

    onMount(async () => {
        browser && await KQL_Subreddits.query({})
    });
</script>

<div class="flex justify-around m-4 pt-4 pb-4 bg-white rounded-lg">

    <select
        id="subreddits"
        class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/6 p-2.5"
        bind:value={subreddit}
    >
        <option selected>Subreddit</option>
        {#each $KQL_Subreddits.data?.subreddits ?? [] as subreddit}
            <option value={subreddit}>{subreddit}</option>
        {/each}
    </select>

    <div class="custom">
        <Tags on:tags={addTagInput} placeholder="Schlüsselwörter" addKeys={[13, 32, 39]} removeKeys={[8, 37]}/>
    </div>

    <div date-rangepicker class="flex items-center">
        <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
            </div>
            <input
                name="start"
                type="text"
                class="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                class="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
        background-color: rgb(255 138 76);
        border-radius: 0.35rem;
        padding: 3px 5px 5px 5px;
        margin: 0 4px 0 0;
        font-weight: 550;
        display: inline;
    }

    .custom :global(.svelte-tags-input-tag-remove) {
        margin-left: 1px;
        font-size: large;
    }

    .custom :global(.svelte-tags-input-tag:hover) {
        background-color: rgba(255, 138, 76, 0.78);
    }

    .custom :global(.svelte-tags-input-layout) {
        padding: 0;
        border-width: 0;
        align-items: center;
    }

    .custom :global(.svelte-tags-input-layout:hover) {
        border-width: 0;
    }

    .custom :global(.svelte-tags-input-tag.focus), .custom :global(.svelte-tags-input:focus) {
        border-radius: 0.5rem;
        border-width: 1px;
        border-color: rgb(63 131 248);
        box-shadow: 5 0 0 0 calc(1px + 3px) rgb(63 131 248);
        margin: 0;
    }

    .custom :global(.svelte-tags-input) {
        margin-top: 0;
        padding: 0.5rem;
        border-radius: 0.5rem;
        border: 1px solid rgb(203 209 219);
    }

</style>
