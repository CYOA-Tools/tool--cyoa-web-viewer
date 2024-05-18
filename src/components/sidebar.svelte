<script>
  import Icon from "@iconify/svelte";
  import Button from "./button.svelte";
  import { get } from "svelte/store";
  import { CYOAConfig } from "../stores/config";
  import { Choices } from "../stores/choices";
  import Sidecard from "./sidecard.svelte";
  import { createFileFromObj } from "../utils/export-json";
  import { runJSONFromUpload } from "../utils/import-json";
  import { objectToLocalStorage } from "../stores/local-storage";

  const config = get(CYOAConfig);
  const sidebarStyle = config.style?.sidebar;
  const cardStyle = `${sidebarStyle?.cardColor && "background:" + sidebarStyle?.cardColor};${sidebarStyle?.cardBorderColor && "border-style:" + sidebarStyle?.cardBorderColor};${sidebarStyle?.cardBorderRadius && "border-radius:" + sidebarStyle?.cardBorderRadius};${sidebarStyle?.cardBorderWidth && "border-width:" + sidebarStyle?.cardBorderWidth}`;
  const rootStyle = `${sidebarStyle?.backgroundColor && "background:" + sidebarStyle?.backgroundColor};${sidebarStyle?.textColor && "color:" + sidebarStyle?.textColor}`;

  let choices = {};
  let showImport = false;
  let choiceEffects = [];
  let effectKeys = [];

  Choices.subscribe((value) => {
    choices = value;
    choiceEffects = [];
    effectKeys = [];
    const tempEffects = { ...choices.effects };

    config.setup?.effectOrdering.forEach((elementKey) => {
      if (!!tempEffects[elementKey]) {
        effectKeys.push(elementKey);
        choiceEffects.push(tempEffects[elementKey]);
        delete tempEffects[elementKey];
      }
    });

    Object.entries(tempEffects).forEach(([key, effect]) => {
      choiceEffects.push(effect);
      effectKeys.push(key);
    });

    objectToLocalStorage(choices);
  });

  const options = {
    thin: "thin",
    mid: "mid",
    wide: "wide",
  };
  let currentWidth = options.thin;
  let name = "Name";

  function onExport() {
    const exportObject = {
      choices,
      config: {
        setup: config.setup,
        title: config.title,
        style: config.style,
        url: location.href
      },
    };

    createFileFromObj(
      exportObject,
      `${config.title.cyoaName.toLowerCase().replaceAll(" ", "-")}`
    );
  }

  function onImport() {
    runJSONFromUpload("import-json", (json) => {
      Choices.update((current) => {
        return {
          ...current,
          ...json.choices,
        };
      });
    });
  }
</script>

<div
  class={`type-${currentWidth} w-32 h-vscreen flex flex-col bg-slate-800 border-r border-black overflow-x-hidden overflow-y-auto scrollbar-custom z-10`}
  style={rootStyle}
>
  <div class="flex justify-between p-1.5">
    <Button
      onclick={() => (currentWidth = options.thin)}
      style={cardStyle}
      className={currentWidth === options.thin ? "hidden" : "w-8"}
    >
      <Icon class="rotate-180" icon="fluent:arrow-next-12-filled" /></Button
    >
    <Button
      onclick={() => (currentWidth = options.mid)}
      style={cardStyle}
      className={currentWidth === options.thin
        ? "hidden"
        : "w-8 hidden sm:block"}
      active={currentWidth === options.mid}
      ><Icon icon="fluent:arrow-left-32-filled" /></Button
    >
    <div
      class={currentWidth === options.thin ? "absolute z-20 flex flex-col" : ""}
    >
      <Button
        onclick={() => (currentWidth = options.wide)}
        style={cardStyle}
        active={currentWidth === options.wide}
        className="w-8"
      >
        <Icon icon="fluent:arrow-next-12-filled" />
      </Button>

      <Sidecard
        style={cardStyle}
        className={currentWidth === options.thin
          ? "p-1.5 py-0.5  bg-white mt-3 rounded-md border border-black text-sm"
          : "hidden"}
      >
        {#each config.setup.points as pointTypes, index}
          <div class="flex gap-2 items-center">
            <span class={currentWidth === options.wide ? "hidden" : "block"}
              >{pointTypes.name}</span
            >
            <span>{choices?.points?.[index] ?? pointTypes.startValue} </span>
          </div>
        {/each}
      </Sidecard>
    </div>
  </div>

  <div class="p-1.5 text-sm xl:text-base flex flex-col gap-2 h-full">
    <Sidecard style={cardStyle}>
      <div class="flex gap-2">
        <label for="name">Name:</label>
        <input id="name" bind:value={name} class="w-full rounded-md text-black px-1" />
      </div>

      <div class="flex gap-2">
        <img
          src={choices.playerImage}
          alt="character-icon"
          class="w-1/2 border-2 border-black"
        />

        <div class="flex flex-col gap-2">
          {#each config.setup.points as pointTypes, index}
            <div
              class={`flex  ${currentWidth === options.wide ? "flex-row gap-2 items-center" : "flex-col-reverse gap-0.5 items-start"}`}
            >
              <div class="flex gap-2 items-center">
                {#if !!pointTypes.icon}
                  <img
                    src={pointTypes.icon}
                    alt="points icon"
                    class={currentWidth === options.wide ? "h-8" : "h-4"}
                  />
                {/if}
                <span class={currentWidth === options.wide ? "block" : "hidden"}
                  >{pointTypes.fullName}</span
                >
                <span class={currentWidth === options.wide ? "hidden" : "block"}
                  >{pointTypes.name}</span
                >
              </div>
              <span>
                <b>{choices?.points?.[index] ?? pointTypes.startValue}</b><span
                  >/{pointTypes.startValue}</span
                >
              </span>
            </div>
          {/each}
        </div>
      </div></Sidecard
    >

    {#key choices}
      {#each choiceEffects as effect, i}
        {@const key = effectKeys[i]}
        <Sidecard style={cardStyle}>
          {@const isUniqueString = typeof effect === "string"}

          {#if isUniqueString}
            <div class="flex gap-2">
              <span class="underline decoration-double">{key}</span>
              <span>{effect}</span>
            </div>
          {:else}
            <span class="underline decoration-double">{key}</span>
            <div class="flex gap-2 flex-wrap">
              {#each effect as effectListItem}
                {#if effectListItem.quantity !== 0}
                  <p>
                    <span>{effectListItem.name}</span
                    >{#if effectListItem.quantity > 1}
                      <span class="ml-1">x{effectListItem.quantity}</span>
                    {/if}
                  </p>
                {/if}
              {/each}
            </div>
          {/if}
        </Sidecard>
      {/each}
    {/key}

    <div class="flex-1"></div>

    <div class="text-center flex flex-wrap gap-3 mx-auto">
      <Button onclick={onExport} style={cardStyle}>Export</Button>
      <div class="bg-white rounded-md flex flex-wrap">
        <Button onclick={() => (showImport = true)} style={cardStyle}
          >Import</Button
        >
        {#if showImport}
          <div class="p-0.5 flex gap-1 items-center">
            <input type="file" id="import-json" />
            <Button onclick={onImport} style={cardStyle}
              ><Icon class="text-green-600" icon="mdi:import" /></Button
            >
            <Button onclick={() => (showImport = false)} style={cardStyle}
              ><Icon icon="oi:collapse-left" /></Button
            >
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  div.type-wide {
    position: absolute;
    width: 80%;
    max-width: 36rem;
    height: 100vh;
  }
  div.type-mid {
    width: 16rem;
  }
  div.type-thin {
    width: 1px;
  }
</style>
