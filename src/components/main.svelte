<script>
  import { get } from "svelte/store";
  import { CYOAConfig } from "../stores/config";
  import Card from "./card.svelte";
  import { SELECTION_TYPE, Choices, ChoiceDefault } from "../stores/choices";
  import ChoiceOptions from "./choice-options.svelte";
  import Icon from "@iconify/svelte";
  import Button from "./button.svelte";

  const config = get(CYOAConfig);
  const mainStyle = config.style?.main;
  const rootStyle = `background:${mainStyle?.backgroundColor ?? "transparent"};color:${mainStyle?.textColor ?? "#000"}`;
  const cardStyle = `background:${mainStyle?.cardColor ?? "transparent"};border-style:${mainStyle?.cardBorderColor ?? "black"};border-radius:${mainStyle?.cardBorderRadius ?? "0.5rem"};border-width:${mainStyle?.cardBorderWidth ?? "1px"}`;

  let currentChoices;
  Choices.subscribe((value) => {
    currentChoices = value;
  });

  function getSelectionType(choice) {
    if (!choice.choicesUnique) {
      return SELECTION_TYPE.multi;
    } else if (choice.maxChoices > 1) {
      return SELECTION_TYPE.uniqueMulti;
    }
    return SELECTION_TYPE.uniqueOnce;
  }

  function choiceSummary(choice) {
    const currentSelectionData = currentChoices.selections?.[choice.title];
    const type = getSelectionType(choice);

    if (currentSelectionData) {
      switch (type) {
        case SELECTION_TYPE.uniqueOnce:
          return currentSelectionData;
        case SELECTION_TYPE.uniqueMulti:
          return currentSelectionData.join(", ");
        case SELECTION_TYPE.multi:
          return Object.entries(currentSelectionData)
            .map(
              ([title, number]) => `${title}${number > 1 ? " x" + number : ""}`
            )
            .join(", ");
      }
    }
    return "None";
  }

  function onReset() {
    Choices.update(() => ({
      ...ChoiceDefault,
      points: config.setup.points.map((p) => p.startValue),
    }));
  }
</script>

<div
  style={rootStyle}
  class={`w-full flex-1 flex flex-col gap-6 p-3 md:p-6 overflow-y-scroll h-screen scrollbar-custom`}
>
  <Card style={cardStyle} className="gap-6 mx-16" id="section--title">
    <div class="flex justify-between text-sm">
      <span>{config.title?.tagline}</span>
      <span>By {config.title?.author}</span>
      <span>{config.title?.version}</span>
    </div>

    <h1 class="text-2xl">{config.title?.cyoaName}</h1>
  </Card>

  <Card style={cardStyle} className="gap-6" id="section--intro">
    <h2 class="text-lg mx-auto">{config.intro?.title}</h2>

    <p class="cols lg:columns-2 max-w-3xl text-sm mx-auto para">
      {config.intro?.introText}
    </p>
    <img
      src={config.intro?.baseImage}
      alt="intro base"
      class="max-w-4xl mx-auto w-full"
    />
    <p class="text-sm mx-auto para">{config.intro?.subtitle}</p>
  </Card>

  <Card style={cardStyle} id="section--selections">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-lg">Selections</h2>

      <Button style={cardStyle} onclick={onReset} className="py-0.5"
        >Reset</Button
      >
    </div>

    <ul class="list-disc pl-8">
      {#key currentChoices}
        {#each config.choices as choice}
          <a href={`#${choice.title}`}>
            <li>
              <p class="flex justify-between gap-1.5 flex-wrap">
                <span class="underline">{choice.title}</span>
                <span>{choiceSummary(choice)}</span>
              </p>
            </li>
          </a>
        {/each}
      {/key}
    </ul>
  </Card>

  <ChoiceOptions
    {cardStyle}
    {currentChoices}
    {choiceSummary}
    {getSelectionType}
  />

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
</div>
