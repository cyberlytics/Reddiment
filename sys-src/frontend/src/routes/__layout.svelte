<script lang="ts">
    import "../app.css";
    import "flowbite/dist/flowbite.css";
    import Navbar from "$components/Navbar.svelte";
    import Footer from "$components/Footer.svelte";
    import { KQL__Init } from '$lib/graphql/_kitql/graphqlStores'
    KQL__Init()
</script>

<div class="flex flex-col h-screen">
    <Navbar />
    <slot/>
    <Footer />
</div>
