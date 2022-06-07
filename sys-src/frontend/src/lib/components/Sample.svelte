<script lang="ts">
    import { KQL_Subreddit } from '$lib/graphql/_kitql/graphqlStores'
</script>

{JSON.stringify($KQL_Subreddit.data, null, 2)}
