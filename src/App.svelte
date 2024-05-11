<script>
  import "./app.css";
  import Sidebar from "./components/sidebar.svelte";
  import Main from "./components/main.svelte";
  import { CYOAConfig } from "./stores/config";

  let fetchJson = fetch("form-config.json").then((res) => res.json());

  fetchJson.then((config) => CYOAConfig.set(config));
</script>

{#await fetchJson}
  <main>
    <p>Loading CYOA settings</p>
  </main>
{:then result}
  <main
    class="w-full flex-1 flex h-full bg-slate-200 justify-stretch"
    style="--textColor:{result.style.text.textColor};"
  >
    <Sidebar />
    <Main />
  </main>
{/await}

<style>
  :global(main) {
    color: var(--textColor);
  }
</style>
