<script>
  import { get } from "svelte/store";
  import { CYOAConfig } from "../stores/config";
  import Card from "./card.svelte";
  import { SELECTION_TYPE, Choices } from "../stores/choices";
  import ChoiceOptions from "./choice-options.svelte";
  import Icon from "@iconify/svelte";

  const config = get(CYOAConfig);

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
</script>

<div
  class={`w-full flex-1 flex flex-col gap-6 p-3 md:p-6 overflow-y-scroll h-screen scrollbar-custom`}
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
      class="max-w-2xl mx-auto w-full"
    />
    <p class="text-sm">{config.intro?.subtitle}</p>
  </Card>

  <Card className="">
    <h2 class="text-lg">Selections</h2>

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

  <ChoiceOptions {currentChoices} {choiceSummary} {getSelectionType} />

  <div class="flex justify-center gap-6">
    {#if config.setup?.showGitLink}
      <a
        href="https://github.com/aronedwards91/CYOA-base"
        class="flex gap-1 hover:underline"
        rel="noopener noreferrer"
        target="_blank"><Icon icon="mdi:github" height="1.5rem" /> Code Repo</a
      >
    {/if}
    {#if config.setup?.altLink}
      <a
        href="https://github.com/aronedwards91/CYOA-base"
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
