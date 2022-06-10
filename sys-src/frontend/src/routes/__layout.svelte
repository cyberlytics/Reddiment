<script lang="ts">
    import "../app.css";
    import { KQL__Init } from '$lib/graphql/_kitql/graphqlStores'
    KQL__Init()
</script>

<div class="flex flex-col h-screen">
    <header class="p-4 bg-gray-400">Reddiment</header>
    <slot/>
    <footer class="p-4 bg-gray-400">Footer</footer>
</div>
