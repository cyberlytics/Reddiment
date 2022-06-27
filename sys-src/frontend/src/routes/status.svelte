<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from '$app/env';
    import { KQL_Health } from '../lib/graphql/_kitql/graphqlStores.js';

    onMount(async () => {
        browser && await KQL_Health.query({})
    });
</script>

<main class="p-8 flex-grow">

    <div class="relative overflow-x-auto sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Komponente
                </th>
                <th scope="col" class="px-6 py-3">
                    Letzte Verbindung
                </th>
                <th scope="col" class="px-6 py-3">
                    Status
                </th>
            </tr>
            </thead>
            <tbody>
            {#each $KQL_Health.data?.health ?? [] as service}
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {service.name}
                    </th>
                    <td class="px-6 py-4">
                        {service.lastConnect}
                    </td>
                    {#if service.status === 'UP'}
                        <td class="px-6 py-4 text-green-600">
                            Verfügbar
                        </td>
                    {:else}
                        <td class="px-6 py-4 text-red-600">
                            Nicht Verfügbar
                        </td>
                    {/if}
                </tr>
            {/each}
            </tbody>
        </table>
    </div>

</main>
