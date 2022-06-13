<script lang="ts">
    import { browser } from '$app/env'
    import { KQL_Subreddit } from '$lib/graphql/_kitql/graphqlStores'
    import Tags from 'svelte-tags-input'
    import {DateInput} from 'date-picker-svelte'


    let subreddit: string
    let keywords: string[]
    let date_from: Date
    let date_to: Date

    const handleSearch = event => {
        console.log(`${subreddit} ${date_from} ${date_to}`)
        browser && KQL_Subreddit.query({
            variables: {
                nameOrUrl: `r/${subreddit}`,
                keywords: keywords,
                from: date_from.toISOString(),
                to: date_to.toISOString(),
            }
        })
    }
</script>

<div class="flex w-1/3 flex-row flex-wrap">

    <input type="text" class="w-3/4 mb-2 border-2 focus:border-orange-300 focus:outline-none px-1 border-r-0 h-9" bind:value={subreddit} placeholder="Subreddit">

    <button on:click={handleSearch} class="w-1/4 bg-orange-600 hover:bg-orange-400 rounded-r-lg border-red-700 hover:border-red-500 border-2 text-white uppercase h-9 mb-2">
        Suche
    </button>


  
    <!--<input type="text" class="w-1/2 border-2 focus:border-orange-300 focus:outline-none px-1 h-9" bind:value={keywords} placeholder="Tags">-->
    <div class="custom w-1/2">
        <Tags class="" on:tags={keywords} placeholder="Tags"/>

    </div>

    <div class="w-1/2 pl-2 justify-start">
        <div class="flex items-center">
            <DateInput bind:value={date_from}/>
            <span class="mx-2 text-gray-500">bis</span>
            <DateInput bind:value={date_to}/>
        </div>
    </div>

</div>
{date_from?.toISOString()}
{date_to?.toISOString()}

<style>
    .custom :global(.svelte-tags-input-tag) {
        background: orange;
    }

    .custom :global(.svelte-tags-input-layout) {
        border-width: 0;
    }

    .custom :global(.svelte-tags-input-layout:hover) {
        border-width: 0;
    }
</style>