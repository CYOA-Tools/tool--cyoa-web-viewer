<script>
  import { get } from "svelte/store";
  import { CYOAConfig } from "../stores/config";
  import Card from "./card.svelte";
  import { Choices, ChoiceDefault } from "../stores/choices";
  import ChoiceOptions from "./choices.svelte";
  import Icon from "@iconify/svelte";
  import CardButton from "./card-button.svelte";
  import SelectionSummary from "./selection-summary.svelte";

  let config = get(CYOAConfig);
  CYOAConfig.subscribe((newVal) => (config = newVal));

  function onReset() {
    Choices.update(() => ({
      ...ChoiceDefault,
      points: config.setup.points.map((p) => p.startValue),
    }));
  }
</script>

<article
  class={`w-full flex-1 flex flex-col gap-6 p-3 md:p-6 overflow-y-scroll h-screen scrollbar-custom`}
>
  <Card className="gap-6 mx-16" id="section--title">
    <div class="flex justify-between text-sm">
      <span>{config.title?.tagline}</span>
      <span>By {config.title?.author}</span>
      <span>{config.title?.version}</span>
    </div>

    <h1 class="text-2xl">{config.title?.cyoaName}</h1>
  </Card>

  <Card className="gap-6" id="section--intro">
    <h2 class="text-lg mx-auto">{config.intro?.title}</h2>

    <p class="cols lg:columns-2 max-w-3xl mx-auto para">
      {config.intro?.introText}
    </p>
    <img
      src={config.intro?.baseImage}
      alt="intro base"
      class="max-w-4xl mx-auto w-full"
    />
    <p class="mx-auto para">{config.intro?.subtitle}</p>
  </Card>

  <Card id="section--selections">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-lg">Selections</h2>

      <CardButton onclick={onReset} className="py-0.5">Reset</CardButton>
    </div>

    <SelectionSummary />
  </Card>

  <ChoiceOptions />

  <div class="flex justify-center gap-6">
    {#if !config.setup?.hideGitLink}
      <a
        href="https://github.com/CYOA-Tools/tool--cyoa-web-viewer"
        class="flex gap-1 hover:underline"
        rel="noopener noreferrer"
        target="_blank"><Icon icon="mdi:github" height="1.5rem" /> Code Repo</a
      >
    {/if}
    {#if config.setup?.altLink}
      <a
        href={config.setup?.altLink}
        class="flex gap-1 hover:underline"
        rel="noopener noreferrer"
        target="_blank"
        ><Icon icon="dashicons:admin-site-alt3" height="1.5rem" />
        {#if config.setup?.altLinkText}
          {config.setup?.altLinkText}
        {:else}
          Link
        {/if}</a
      >
    {/if}
  </div>
</article>

<style>
  article {
    background: var(--main-page-background-color);
  }
</style>
