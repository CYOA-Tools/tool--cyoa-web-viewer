<script>
  import { get } from "svelte/store";
  import { CYOAConfig } from "../stores/config";

  let config = get(CYOAConfig);
  CYOAConfig.subscribe((newVal) => (config = newVal));
  export let opt;
</script>

<p class="flex gap-1.5 text-sm font-bold items-center">
  {#each opt?.cost as cost, index}
    {#if cost !== 0}
      {#if config.setup.points[index].icon}
        <img
          src={config.setup.points[index].icon}
          alt="points icon"
          class="h-8"
        />
      {/if}
      <span>{cost * -1} {config.setup.points[index].name}</span>
    {/if}
  {/each}
</p>
