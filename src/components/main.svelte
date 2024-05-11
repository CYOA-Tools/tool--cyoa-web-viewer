<script>
  import { get } from "svelte/store";
  import { CYOAConfig } from "../stores/config";
  import Card from "./card.svelte";

  const config = get(CYOAConfig);
</script>

<div
  class={`w-full flex-1 flex flex-col gap-6 p-3 md:p-6 overflow-y-scroll h-screen`}
>
  <Card className="gap-6">
    <div class="flex justify-between text-sm">
      <span>{config.title?.tagline}</span>
      <span>By {config.title?.author}</span>
      <span>{config.title?.version}</span>
    </div>

    <h1 class="text-2xl">{config.title?.cyoaName}</h1>
  </Card>

  <Card className="gap-3">
    <h2 class="text-lg">{config.intro?.title}</h2>

    <p class="cols lg:columns-2 xl:columns-3 text-sm">
      {config.intro?.introText}
    </p>
    <img
      src={config.intro?.baseImage}
      alt="intro base"
      class="max-w-2xl mx-auto"
    />
    <p class="text-sm">{config.intro?.subtitle}</p>
  </Card>

  <!-- choices list -->

  {#each config.choices as choice}
    <Card className="gap-3">
      <h2 class="text-2xl font-bold">{choice.title}</h2>
      <p class="text-sm">{choice.description}</p>
      <p class="text-sm"> Selection: None</p>
      <div class="w-full h-px bg-black"></div>
      {#if choice.style === "list"}
        {#each choice.options as opt}
          <button class="flex gap-3" on:click={() => console.log("opt", opt)}>
            <div class="flex flex-col gap-1.5 items-start ">
              <h4 class="font-semibold">{opt.title}</h4>
              <p class="text-sm text-left">{opt.description}</p>
            </div>
            <img src={opt.image} alt={choice.title} />
          </button>
        {/each}
      {/if}
    </Card>
  {/each}
</div>
