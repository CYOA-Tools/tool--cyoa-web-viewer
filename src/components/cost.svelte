<script>
  import { get } from "svelte/store";
  import { CYOAConfig } from "../stores/config";

  const config = get(CYOAConfig);
  export let opt;
</script>

<p class="flex gap-3 text-sm font-bold">
  {#each opt?.cost as cost, index}
    {#if cost !== 0}
      <span>{cost * -1} {config.setup.points[index].name}</span>
    {/if}
  {/each}
</p>
