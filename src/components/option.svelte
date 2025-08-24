<script>
  import { get } from "svelte/store";
  import { CYOAConfig } from "../stores/config";
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

  let formConfig = get(CYOAConfig);
  CYOAConfig.subscribe((newVal) => (formConfig = newVal));

  $: mainStyle = formConfig.style?.main;

  $: selectionStyle = `border:${mainStyle?.selectionBorder ?? "transparent"};background:${mainStyle?.selectionBg ?? "transparent"}`;
  $: unselectionStyle =
    choiceStyle === "list"
      ? `border:${mainStyle?.unselectionBorder ?? "1px solid transparent"};background:${mainStyle?.unselectionBg ?? "transparent"};`
      : `border:${mainStyle?.unselectionBoxBorder ?? "1px solid transparent"};background:${mainStyle?.unselectionBoxBg ?? "transparent"};`;

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
      !isUnselectAction ||
      option.cost.every((cost, i) => {
        if (cost < 1 || currentChoices.points[i] >= cost) {
          return true;
        }
        return false;
      });
    console.log(">>>OPTION- ON-OPTION-SELECT", {
      isUnselectAction,
      canAfford,
      option,
      currentChoices,
      isSelected,
      choiceType,
      currentChoicePlayerSelection,
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
      const selections = { ...current.selections };
      let newEffects = { ...current.effects };

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
  class={`relative
  flex flex-col gap-3
  border-2 w-full
  ${choiceStyle === "list" ? "pl-1.5 max-w-5xl xs:flex-row justify-between xl:gap-6" : ""}
  ${choiceStyle === "box" ? "md:w-64 lg:w-72 xl:w-80 rounded-lg overflow-hidden" : ""}
  ${isSelected ? "border-red-600" : "border-transparent"}`}
  style={isSelected ? selectionStyle : unselectionStyle}
  on:click={onOptionSelect}
>
  {#if isMultiAndSelected && !option.unique}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      on:click={(e) => {
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
    class={`flex flex-col gap-1.5 items-start py-1.5 ${choiceStyle === "box" ? "p-1.5 xl:p-3 xl:gap-3" : ""} `}
  >
    <h4 class="font-semibold">{option.title}</h4>
    <p class="text-sm text-left para">{option.description}</p>
    <Cost opt={option} />
  </div>
  {#if choiceStyle === "list" && option.image}
    <img
      src={option.image}
      alt={choice.title}
      class="border-4 border-black max-w-40"
    />
  {/if}
</button>
