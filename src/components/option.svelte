<script>
  import { Choices, SELECTION_TYPE } from "../stores/choices";
  import { getSelectionType, adjustplayerEffects } from "../utils/helper";
  import Cost from "./cost.svelte";
  import Icon from "@iconify/svelte";

  export let choice;
  export let option;
  export let choiceStyle = "list";

  let currentChoices;
  Choices.subscribe((value) => {
    currentChoices = { ...value };
  });

  $: choiceType = getSelectionType(choice);
  $: currentChoicePlayerSelection =
    currentChoices && currentChoices.selections?.[choice.title];

  function checkOptionIsSelected() {
    let isSelected = false;

    switch (choiceType) {
      case SELECTION_TYPE.multi:
        const isOptionIDInSelections = Object.keys(
          currentChoicePlayerSelection ?? {}
        ).includes(option.title);

        if (
          isOptionIDInSelections &&
          currentChoicePlayerSelection[option.title] > 0
        ) {
          isSelected = true;
        }
        break;

      case SELECTION_TYPE.uniqueMulti:
        if (currentChoicePlayerSelection.indexOf(option.title) != -1) {
          isSelected = true;
        }
        break;

      case SELECTION_TYPE.uniqueOnce:
        if (currentChoicePlayerSelection === option.title) {
          isSelected = true;
        }
        break;
    }

    return isSelected;
  }

  $: isSelected = currentChoicePlayerSelection && checkOptionIsSelected();

  function onOptionSelect() {
    const isUnselectAction =
      isSelected && (option.unique || choiceType !== SELECTION_TYPE.multi);

    if (
      !isUnselectAction &&
      choice.maxChoices > 1 &&
      currentChoicePlayerSelection?.length >= choice.maxChoices
    ) {
      return;
    }

    const canAfford =
      isUnselectAction ||
      option.cost.every((cost, i) => {
        if (cost <= 0 || currentChoices.points[i] >= cost) {
          return true;
        }
        dispatchEvent(new CustomEvent('insufficientPoints'));
        return false;
      });

    // update points if can afford
    const newPoints = canAfford
      ? currentChoices.points.map(
          (pointValue, i) =>
            pointValue +
            (isUnselectAction ? option.cost[i] : -1 * option.cost[i])
        )
      : currentChoices.points;
    // if uniqueOnce, and already selected, revert points cost of current selection
    if (
      SELECTION_TYPE.uniqueOnce &&
      !!currentChoicePlayerSelection &&
      currentChoicePlayerSelection !== option.title
    ) {
      const currentSelectionData = choice.options.find(
        (option) => option.title === currentChoicePlayerSelection
      );
      currentSelectionData?.cost.map((pointValue, i) => {
        newPoints[i] = newPoints[i] + pointValue;
      });
    }

    const newSelections = {
      ...(currentChoices?.selections ?? {}),
    };
    const newCurrentSelectionItem = newSelections[choice.title];
    let newEffects = { ...(currentChoices?.effects ?? {}) };

    if (canAfford) {
      switch (choiceType) {
        case SELECTION_TYPE.multi:
          if (isSelected && option.unique) {
            newCurrentSelectionItem[option.title] -= 1;
            newEffects = adjustplayerEffects(true, newEffects, option.effects);
          } else {
            if (newCurrentSelectionItem) {
              if (!!newCurrentSelectionItem[option.title]) {
                newCurrentSelectionItem[option.title] += 1;
                newEffects = adjustplayerEffects(
                  false,
                  newEffects,
                  option.effects
                );
              } else {
                newCurrentSelectionItem[option.title] = 1;
                newEffects = adjustplayerEffects(
                  false,
                  newEffects,
                  option.effects
                );
              }
            } else {
              newSelections[choice.title] = {
                [option.title]: 1,
              };
              newEffects = adjustplayerEffects(
                false,
                newEffects,
                option.effects
              );
            }
          }
          break;

        case SELECTION_TYPE.uniqueMulti:
          const indexOfItem = !!newCurrentSelectionItem
            ? newCurrentSelectionItem.indexOf(option.title)
            : -1;
          if (isSelected) {
            newCurrentSelectionItem.splice(indexOfItem, 1);
            newEffects = adjustplayerEffects(true, newEffects, option.effects);
          } else {
            if (!newCurrentSelectionItem) {
              newSelections[choice.title] = [option.title];
            } else {
              newCurrentSelectionItem.push(option.title);
            }
            newEffects = adjustplayerEffects(false, newEffects, option.effects);
          }
          break;

        case SELECTION_TYPE.uniqueOnce:
          if (isSelected) {
            newSelections[choice.title] = "";
            newEffects = adjustplayerEffects(true, newEffects, option.effects);
          } else {
            if (!!newCurrentSelectionItem && newCurrentSelectionItem !== "") {
              const currentSelectionData = choice.options.find(
                (option) => option.title === newCurrentSelectionItem
              );
              newEffects = adjustplayerEffects(
                true,
                newEffects,
                currentSelectionData.effects
              );
            }

            newSelections[choice.title] = option.title;
            newEffects = adjustplayerEffects(false, newEffects, option.effects);
          }
          break;
      }
    }

    Choices.update((current) => {
      return {
        points: newPoints,
        selections: newSelections,
        effects: newEffects,
        playerImage:
          choice.applyToPlayerImage && !isUnselectAction
            ? `${location.origin}${option.image}`
            : current.playerImage,
      };
    });
  }

  function clearMulti(e) {
    e.stopPropagation();

    Choices.update((current) => {
      const selections = { ...current.selections };
      const effects = adjustplayerEffects(
        false,
        current.effects,
        option.effects,
        true
      );

      let newCurrentSelectionItem = selections[choice.title];
      const currentSelectionQuantity = newCurrentSelectionItem[option.title];

      const points = current.points.map(
        (pointValue, i) =>
          pointValue + option.cost[i] * currentSelectionQuantity
      );

      newCurrentSelectionItem[option.title] = 0;
      return {
        points,
        selections,
        effects,
        playerImage: current.playerImage,
      };
    });
  }

  // @ts-ignore
  $: quantitySelected =
    (choiceType === SELECTION_TYPE.multi &&
      currentChoices?.selections?.[choice.title]?.[option.title]) ??
    0;
  $: isMultiAndSelected = !choice.choicesUnique && quantitySelected;
</script>

<button
  class={`option-item
  relative
  flex flex-col gap-3
  border-2 w-full
  ${choiceStyle === "list" ? "max-w-5xl xs:flex-row justify-between xl:gap-6" : ""}
  ${choiceStyle === "box" ? "md:w-64 lg:w-72 xl:w-80 rounded-lg overflow-hidden" : ""}`}
  data-selected={isSelected}
  on:click={onOptionSelect}
>
  {#if isMultiAndSelected && !option.unique}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      on:click={(e) => {
        // stops background of cancel element being considered as an item click
        e.stopPropagation();
      }}
      role="button"
      tabindex="-1000"
      class={`absolute right-0 top-0
      flex items-center gap-1.5
      bg-black bg-opacity-60 rounded-bl-md
      p-0.5 px-1.5
      text-sm text-white`}
    >
      <span>x{quantitySelected}</span>
      <button on:click={clearMulti}
        ><Icon icon="ant-design:close-circle-filled" /></button
      >
    </div>
  {/if}
  {#if choiceStyle === "box" && option.image}
    <img class="w-full h-auto" src={option.image} alt={choice.title} />
  {/if}

  <div
    class={`flex flex-col gap-1.5 items-start
    ${choiceStyle === "box" ? "p-1.5 xl:p-3 xl:gap-3" : ""}
    ${choiceStyle === "list" ? "p-3" : ""}`}
  >
    <h4 class="font-semibold">{option.title}</h4>
    <p class="text-left para">{option.description}</p>
    <Cost opt={option} />
  </div>
  {#if choiceStyle === "list" && option.image}
    <img
      src={option.image}
      alt={choice.title}
      class="list-image border-4 max-w-40 max-h-60"
    />
  {/if}
</button>


<style>
  .option-item {
    border: var(--main-unselected-option-border, 1px solid transparent);
    background: var(--main-unselected-option-bg, transparent);
    color: var(--main-unselected-option-text-color, inherit);
  }

  button.option-item[data-selected="true"] {
    border: var(--main-selected-option-border, 1px solid black);
    background: var(--main-selected-option-bg, transparent);
    color: var(--main-selected-option-text-color, inherit);
  }

  img.list-image {
    border-color: var(--main-image-border-color, black);
  }
</style>