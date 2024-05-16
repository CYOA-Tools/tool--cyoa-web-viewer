<script>
  import "./app.css";
  import Sidebar from "./components/sidebar.svelte";
  import Main from "./components/main.svelte";
  import { CYOAConfig } from "./stores/config";
  import { Choices } from "./stores/choices";

  let fetchJson = fetch("form-config.json").then((res) => res.json());
  let textFontURL;
  let familyMain;

  fetchJson.then((config) => {
    CYOAConfig.set(config);
    Choices.set({
      points: config.setup.points.map((p) => p.startValue),
      selections: {},
      effects: {},
    });
    textFontURL = config.style.import.text;
    familyMain = config.style.text.familyMain;
  });
</script>

<svelte:head>
  <link href={textFontURL} rel="stylesheet" />
</svelte:head>

{#await fetchJson}
  <main>
    <p>Loading CYOA settings</p>
  </main>
{:then result}
  <main
    class="w-full flex-1 flex bg-slate-200 justify-stretch h-screen overflow-hidden"
    style="--textColor:{result.style.text.textColor};--familyMain:{result.style
      .text.familyMain}"
  >
    <Sidebar />
    <Main />
  </main>
{/await}

<style>
  :global(main) {
    color: var(--textColor);
    font-family: var(--familyMain);
    /* font-weight: 400; */
    font-style: normal;
  }
</style>
