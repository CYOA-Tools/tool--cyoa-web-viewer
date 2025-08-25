<script>
  import { get } from "svelte/store";
  import { CYOAConfig } from "../stores/config";
  import Card from "./card.svelte";
  import Icon from "@iconify/svelte";
  import Option from "./option.svelte";
  import ChoiceCurrentSelection from "./choice-current-selection.svelte";

  let config = get(CYOAConfig);
  CYOAConfig.subscribe((newVal) => (config = newVal));

  let isCollapsedList = config?.choices?.map(() => false) ?? [];

  function updateCollapsed(i, setCollapsed = true) {
    const localList = [...isCollapsedList];
    localList[i] = setCollapsed;
    isCollapsedList = localList;
  }
</script>

{#each config.choices as choice, i}
  <Card
    className="relative"
    id="section-{choice.title.toLowerCase().replace(/\s/g, '-')}"
  >
    <button
      on:click={() => updateCollapsed(i, !isCollapsedList[i])}
      class={`${isCollapsedList[i] ? "bg-slate-900" : "bg-slate-500"} transition-colors bg-opacity-60 text-white p-1 px-1.5 rounded-md top-0 left-full sticky w-min h-6 -mb-6 z-20`}
      ><Icon icon="gravity-ui:chevrons-collapse-vertical" /></button
    >

    <div class="flex flex-col gap-3" id={choice.title}>
      <h2 class="text-2xl font-bold">{choice.title}</h2>

      <p class="para">{choice.description}</p>
      <ChoiceCurrentSelection {choice} />

      <div class="flex flex-col gap-3">
        {#if !isCollapsedList[i]}
          <div class="w-full h-px bg-black"></div>
          {#if choice.style === "list"}
            <div class="flex flex-col gap-3 items-center">
              {#each choice.options as opt}
                <Option {choice} option={opt} choiceStyle="list" />
              {/each}
            </div>
          {:else}
            <div class="flex flex-wrap w-full gap-3 2xl:gap-6 justify-center">
              {#each choice.options as opt}
                <Option {choice} option={opt} choiceStyle="box" />
              {/each}
            </div>
          {/if}
        {/if}
      </div>
    </div>
  </Card>
{/each}
