<script>
  import Sidebar from "./sidebar.svelte";
  import Main from "./main.svelte";
  import { CYOAConfig } from "../stores/config";
  import { get } from "svelte/store";

  let config = get(CYOAConfig);
  let paragraphSettings = "";

  function applyNewConfig(newConfig) {
    config = newConfig;
    paragraphSettings = !!config.style?.paragraph
    ? `--line-height:${config.style?.paragraph?.lineHeight};--letter-spacing:${config.style?.paragraph?.letterSpacing};--font-family:${config.style?.paragraph?.fontFamily}`
    : "";
  }
  
  CYOAConfig.subscribe((newVal) => applyNewConfig(newVal));

  window.addEventListener('insufficientPoints', () => {
    document.getElementById('points-sidebar').classList.add('flash');
    setTimeout(() => {
      document.getElementById('points-sidebar').classList.remove('flash');
    }, 500);
  });

  export let isLoading = true;
</script>

{#if isLoading}
  <main>
    <p>Loading CYOA settings</p>
  </main>
{:else}
  <div style={paragraphSettings}>
    <main
      class="w-full flex-1 flex bg-slate-200 justify-stretch h-screen overflow-hidden"
      style="color:{config.style.text.textColor ?? 'black'};font-family:{config
        .style.text.familyMain ?? 'sans'};"
    >
      <Sidebar />
      <Main />
    </main>
  </div>
{/if}
