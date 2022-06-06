<script lang="ts">
    import { browser } from '$app/env'
    import { KQL_Subreddit } from '$lib/graphql/_kitql/graphqlStores'

    let subreddit: string
    let tags: string
    let time_period: string

    const time_options = [
        { value: "0", text: "gesamt"},
        { value: "1", text: "letzte 7 Tage"},
        { value: "2", text: "letzten 14 Tage"},
        { value: "3", text: "letzter Monat"},
        { value: "4", text: "letztes Jahr"},
    ]

    const handleSearch = event => {
        browser && KQL_Subreddit.query({
            variables: {
                nameOrUrl: `r/${subreddit}`,
                tags: `r/${tags}`,
                time_period: `/r${time_period}`,
            }
        })
    }
</script>

<div class="flex w-1/3">

    <div class="flex flex-col w-3/4">
        <input type="text" class="mb-2 border-2 focus:border-orange-300 focus:outline-none px-1 border-r-0 h-9" bind:value={subreddit} placeholder="Subreddit">
        <input type="text" class="border-2 focus:border-orange-300 focus:outline-none px-1 h-9" bind:value={tags} placeholder="Tags">

    </div>
    <div class="flex flex-col w-1/4">

        <button on:click={handleSearch} class="bg-orange-600 hover:bg-orange-400 rounded-r-lg border-red-700 hover:border-red-500 border-2 text-white uppercase h-9 mb-2">
            Suche
        </button>
        <select bind:value={time_period} class="bg-white ml-2 border-b-2 focus:border-orange-400 h-9 text-gray-600 text-center">
            {#each time_options as option, index  }
                <option value={option.value}>{option.text}</option>
            {/each}
        
        </select>
    </div>


</div>

