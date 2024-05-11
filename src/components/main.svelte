<script>
  import { get } from "svelte/store";
  import { CYOAConfig } from "../stores/config";
  import Card from "./card.svelte";
  import { SELECTION_TYPE, Choices } from "../stores/choices";

  const config = get(CYOAConfig);

  let currentChoices;
  Choices.subscribe((value) => {
    currentChoices = value;
  });

  function getChoiceType(choice) {
    console.log(">>choice", choice);
    if (!choice.choicesUnique) {
      return SELECTION_TYPE.multi;
    } else if (choice.maxChoices > 1) {
      return SELECTION_TYPE.uniqueMulti;
    }
    return SELECTION_TYPE.uniqueOnce;
  }

  function isOptionSelected(option, currentSelectionItem, choice) {
    const currentSelectionExists = !!currentSelectionItem;

    const choiceType = getChoiceType(choice);

    let isSelected = false;

    switch (choiceType) {
      case SELECTION_TYPE.multi:
        const keys = currentSelectionExists
          ? Object.keys(currentSelectionItem)
          : [];
        const currentQuantity = currentSelectionItem?.[option.title] ?? 0;
        if (keys.includes(option.title) && currentQuantity > 0) {
          isSelected = currentQuantity;
        }
        break;
      case SELECTION_TYPE.uniqueMulti:
        const indexOfItem = currentSelectionExists
          ? currentSelectionItem.indexOf(option.title)
          : -1;
        if (indexOfItem != -1) {
          isSelected = true;
        }
        break;
      case SELECTION_TYPE.uniqueOnce:
        if (currentSelectionItem === option.title) {
          isSelected = true;
        }
        break;
    }

    return isSelected;
  }

  function onOptionSelect(option, choice) {
    const choiceType = getChoiceType(choice);

    Choices.update((current) => {
      const selections = { ...current.selections };
      let currentSelectionItem = selections[choice.title];
      const currentSelectionExists = !!currentSelectionItem;

      const isSelected = !!isOptionSelected(
        option,
        currentSelectionItem,
        choice
      );

      switch (choiceType) {
        case SELECTION_TYPE.multi:
          if (isSelected) {
            currentSelectionItem[option.title] -= 1;
          } else {
            currentSelectionItem[option.title] += 1;
          }
          break;
        case SELECTION_TYPE.uniqueMulti:
          const indexOfItem = currentSelectionExists
            ? currentSelectionItem.indexOf(option.title)
            : -1;
          if (isSelected) {
            currentSelectionItem.splice(indexOfItem, 1);
          } else {
            if (!currentSelectionExists) {
              currentSelectionItem = [option.title];
            } else {
              currentSelectionItem.push(option.title);
            }
          }
          break;
        case SELECTION_TYPE.uniqueOnce:
          if (isSelected) {
            currentSelectionItem = "";
          } else {
            currentSelectionItem = option.title;
          }
          break;
      }

      let points = current.points;
      if (isSelected) {
        points = points.map((pointValue, i) => pointValue + option.cost[i]);
      } else {
        points = points.map((pointValue, i) => pointValue - option.cost[i]);
      }
      selections[choice.title] = currentSelectionItem;
      return {
        points,
        selections,
        effects: current.effects,
      };
    });
  }
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
      class="max-w-2xl mx-auto w-full"
    />
    <p class="text-sm">{config.intro?.subtitle}</p>
  </Card>

  <!-- choices list -->

  {#each config.choices as choice}
    <Card className="gap-3">
      <h2 class="text-2xl font-bold">{choice.title}</h2>

      <p class="text-sm">{choice.description}</p>
      <p class="text-sm">Selection: None</p>

      <div class="w-full h-px bg-black"></div>
      {#if choice.style === "list"}
        {#each choice.options as opt}
          {@const isSelected = isOptionSelected(
            opt,
            currentChoices.selections[choice.title],
            choice
          )}

          <!-- LIST BTN -->
          <button
            class={`flex gap-3 border-2 ${isSelected ? "border-red-600" : "border-transparent"}`}
            on:click={() => onOptionSelect(opt, choice)}
          >
            <div class="flex flex-col gap-1.5 items-start">
              <h4 class="font-semibold">{opt.title}</h4>
              <p class="text-sm text-left">{opt.description}</p>
            </div>
            <img src={opt.image} alt={choice.title} />
          </button>
        {/each}
      {:else}
        <div class="flex flex-wrap w-full gap-3 2xl:gap-6 justify-center">
          {#each choice.options as opt}
            {@const isSelected = isOptionSelected(
              opt,
              currentChoices.selections[choice.title],
              choice
            )}

            <!-- BOXES BTN -->
            <button
              class={`w-full flex flex-col gap-3 border-2 rounded-lg md:w-64 lg:w-72 xl:w-80 ${isSelected ? "border-red-600" : "border-black"}`}
              on:click={() => onOptionSelect(opt, choice)}
            >
              <img class="w-full h-auto" src={opt.image} alt={choice.title} />

              <div class="flex flex-col gap-1.5 items-start">
                <h4 class="font-semibold">{opt.title}</h4>
                <p class="text-sm text-left">{opt.description}</p>
              </div>
            </button>
          {/each}
        </div>
      {/if}
    </Card>
  {/each}
</div>
