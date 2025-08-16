<script>
  import "./app.css";
  import Sidebar from "./components/sidebar.svelte";
  import Main from "./components/main.svelte";
  import { CYOAConfig } from "./stores/config";
  import { Choices } from "./stores/choices";
  import { getFromLocalStorage } from "./stores/local-storage";
  import { get } from "svelte/store";

  const urlParams = new URLSearchParams(window.location.search);
  // All possible sources of data
  const sources = {
    local: "local", // local .json file
    embed: "embed", // embeded in app
    iframe: "iframe", // iframe
  };
  const defaultSource = sources.embed;
  const src = urlParams.get("src") || sources.embed;

  let isLoading = true;
  let textFontURL;
  let familyMain;
  let paragraphSettings;
  let css;

  function applyConfigFromMsg() {
    window.addEventListener("message", (event) => {
      if (event.data.type === "config") {
        const config = event.data.config;
        CYOAConfig.set(config);
        isLoading = false;
      }
    });
  }

  function applyConfigFromLocal() {
    const fetchJson = fetch("form-config.json").then((res) => res.json());

    fetchJson.then((config) => {
      CYOAConfig.set(config);
      isLoading = false;
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
      css = config.style.css;

      document.querySelector("html").style.fontSize =
        config.style.text.rootSize ?? "16px";
    });
  }

  if (src === defaultSource) {
    applyConfigFromLocal();
  } else {
    window.addEventListener("message", applyConfigFromMsg);
  }
</script>

<svelte:head>
  <link href={textFontURL} rel="stylesheet" />
</svelte:head>

{@html "<" + `style>${css}</style>`}

{#if isLoading}
  <main>
    <p>Loading CYOA settings</p>
  </main>
{:else}
  <div style={paragraphSettings}>
    <main
      class="w-full flex-1 flex bg-slate-200 justify-stretch h-screen overflow-hidden"
      style="color:{get(CYOAConfig).style.text.textColor ??
        'black'};font-family:{get(CYOAConfig).style.text.familyMain ?? 'sans'};"
    >
      <Sidebar />
      <Main />
    </main>
  </div>
{/if}

<style>
  :global(html p.para) {
    line-height: var(--line-height);
    letter-spacing: var(--letter-spacing);
    font-family: var(--font-family);
    max-width: 720px;
    white-space: pre-line;
  }
</style>
