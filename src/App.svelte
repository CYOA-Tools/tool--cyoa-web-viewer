<script>
  import "./app.css";
  import { CYOAConfig } from "./stores/config";
  import { Choices } from "./stores/choices";
  import { getFromLocalStorage } from "./stores/local-storage";
  import Root from "./components/root.svelte";
  import { configCSS } from "./utils/configCSS";

  const urlParams = new URLSearchParams(window.location.search);
  // All possible sources of data
  const sources = {
    local: "local", // local .json file
    // embed: "embed", // embeded in app
    iframe: "iframe", // iframe
  };
  const defaultSource = sources.local;
  const src = urlParams.get("src") || defaultSource;

  let isLoading = true;
  let textFontURL;
  let customCSS;
  let formCSS;

  // @ts-ignore
  window.appMessageListener = null;
  function applyConfigFromMsg() {
    // @ts-ignore
    if (window.appMessageListener) {
      return;
    }
    // @ts-ignore
    window.appMessageListener = window.addEventListener("message", (event) => {
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
      customCSS = config.style.css;
      formCSS = configCSS(config.style);
    });
  }

  if (src === defaultSource) {
    console.log(">>> Local source");
    applyConfigFromLocal();
  } else if (src === sources.embed) {
    console.log(">>> Embed source");
    // TODO
    applyConfigFromMsg();
  } else {
    console.log(">>> Iframe Msg source");
    applyConfigFromMsg();
  }
</script>

<svelte:head>
  <link href={textFontURL} rel="stylesheet" />
</svelte:head>

{@html "<" + `style id="custom-css">${customCSS}</style>`}
{@html "<" + `style id="form-css">${formCSS}</style>`}

<Root {isLoading} />

<style>
  :global(html p.para) {
    line-height: var(--paragraph-line-height);
    letter-spacing: var(--paragraph-letter-spacing);
    font-family: var(--paragraph-font-family);
    max-width: 720px;
    white-space: pre-line;
  }
</style>
