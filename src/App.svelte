<script>
  import "./app.css";
  import Sidebar from "./components/sidebar.svelte";
  import Main from "./components/main.svelte";
  import { CYOAConfig } from "./stores/config";
  import { Choices } from "./stores/choices";
  import { getFromLocalStorage } from "./stores/local-storage";

  let fetchJson = fetch("form-config.json").then((res) => res.json());
  let textFontURL;
  let familyMain;
  let paragraphSettings;

  fetchJson.then((config) => {
    CYOAConfig.set(config);
    Choices.set({
      points: config.setup.points.map((p) => p.startValue),
      selections: {},
      effects: {},
      ...getFromLocalStorage(),
    });
    textFontURL = config.style.import.text;
    familyMain = config.style.text.familyMain;
    paragraphSettings = !!config.style?.paragraph
      ? `--line-height:${config.style?.paragraph?.lineHeight};--letter-spacing:${config.style?.paragraph?.letterSpacing};--font-family:${config.style?.paragraph?.fontFamily}`
      : "";

    document.querySelector("html").style.fontSize =
      config.style.text.rootSize ?? "16px";
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
  <div style={paragraphSettings}>
    <main
      class="w-full flex-1 flex bg-slate-200 justify-stretch h-screen overflow-hidden"
      style="color:{result.style.text.textColor ?? 'black'};font-family:{result
        .style.text.familyMain ?? 'sans'};"
    >
      <Sidebar />
      <Main />
    </main>
  </div>
{/await}

<style>
  :global(html p.para) {
    line-height: var(--line-height);
    letter-spacing: var(--letter-spacing);
    font-family: var(--font-family);
    max-width: 720px;
  }
</style>
