<script>
  import Sidebar from "./sidebar.svelte";
  import Main from "./main.svelte";

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
  <div>
    <main
      class="w-full flex-1 flex bg-slate-200 justify-stretch h-screen overflow-hidden"
    >
      <Sidebar />
      <Main />
    </main>
  </div>
{/if}
