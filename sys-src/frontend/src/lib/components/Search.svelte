<script lang="ts">
    import { browser } from '$app/env'
    import { KQL_Subreddit } from '$lib/graphql/_kitql/graphqlStores'

    let subreddit: string

    const handleSearch = event => {
        browser && KQL_Subreddit.query({
            variables: {
                nameOrUrl: `r/${subreddit}`
            }
        })
    }
</script>

<input type="text" class="border" bind:value={subreddit}>
<button on:click={handleSearch}>Suche</button>
