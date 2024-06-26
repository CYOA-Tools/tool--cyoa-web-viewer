<script>
  import { get } from "svelte/store";
  import { CYOAConfig } from "../stores/config";
  import Card from "./card.svelte";
  import Icon from "@iconify/svelte";
  import Cost from "./cost.svelte";
  import { Choices, EFFECT_TYPE, SELECTION_TYPE } from "../stores/choices";

  export let currentChoices;
  export let choiceSummary;
  export let getSelectionType;
  export let cardStyle;

  const config = get(CYOAConfig);
  const mainStyle = config.style?.main;

  const selectionStyle = `border:${mainStyle?.selectionBorder ?? "transparent"};background:${mainStyle?.selectionBg ?? "transparent"}`;
  const unselectionStyle = `border:${mainStyle?.unselectionBorder ?? "1px solid transparent"};background:${mainStyle?.unselectionBg ?? "transparent"};`;
  const unselectionBoxStyle = `border:${mainStyle?.unselectionBoxBorder ?? "1px solid transparent"};background:${mainStyle?.unselectionBoxBg ?? "transparent"};`;

  let isCollapsedList = config?.choices?.map(() => false) ?? [];

  function updateCollapsed(i, setCollapsed = true) {
    const localList = [...isCollapsedList];
    localList[i] = setCollapsed;
    isCollapsedList = localList;
  }

  function isOptionSelected(option, currentSelectionItem, choice) {
    const currentSelectionExists = !!currentSelectionItem;

    const choiceType = getSelectionType(choice);

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

  function adjustEffect(
    isRemoveAction,
    currentEffects,
    effects,
    isClear = false
  ) {
    const currentEffectsLocal = { ...currentEffects };

    effects.map((effect) => {
      switch (effect.type) {
        case EFFECT_TYPE.list:
          if (!currentEffectsLocal?.[effect.key]) {
            const newData = isClear
              ? { ...effect.data, quantity: 0 }
              : { ...effect.data };
            currentEffectsLocal[effect.key] = [newData];
            if (isRemoveAction) {
              currentEffectsLocal[effect.key].quantity = 0;
            }
          } else {
            const currentEffectStatus = currentEffectsLocal[effect.key];

            const activeEffectEntryIndex = currentEffectStatus.findIndex(
              (activeEffectEntry) => activeEffectEntry.name === effect.data.name
            );
            const quantity = effect.data.quantity ?? 1;

            if (activeEffectEntryIndex !== -1) {
              if (isRemoveAction) {
                currentEffectStatus[activeEffectEntryIndex].quantity -=
                  quantity;
              } else if (isClear) {
                currentEffectStatus[activeEffectEntryIndex].quantity = 0;
              } else {
                currentEffectStatus[activeEffectEntryIndex].quantity +=
                  quantity;
              }
            } else {
              if (isRemoveAction || isClear) {
                const emptyItem = { ...effect.data, quantity: 0 };
                currentEffectStatus.push(emptyItem);
              } else {
                currentEffectStatus.push({ ...effect.data });
              }
            }
          }

          break;
        case EFFECT_TYPE.uniqueString:
          if (isRemoveAction || isClear) {
            currentEffectsLocal[effect.key] = "";
          } else {
            currentEffectsLocal[effect.key] = effect.data;
          }
          break;
      }
    });
    return currentEffectsLocal;
  }

  function onOptionSelect(option, choice) {
    const choiceType = getSelectionType(choice);

    Choices.update((current) => {
      if (choice.applyToPlayerImage) {
      }
      const selections = { ...current.selections };
      let activeEffects = { ...current.effects };

      let currentSelectionItem = selections[choice.title];
      const currentSelectionExists = !!currentSelectionItem;

      const isSelected = !!isOptionSelected(
        option,
        currentSelectionItem,
        choice
      );

      let points = [...current.points];
      const canAfford = option.cost.every((cost, i) => {
        const checkedCost =
          isSelected && (choiceType !== SELECTION_TYPE.multi || option.unique)
            ? -1 * cost
            : cost;
        if (checkedCost < 1 || points[i] >= checkedCost) {
          return true;
        }
        return false;
      });

      if (canAfford) {
        if (
          isSelected &&
          (option.unique || choiceType !== SELECTION_TYPE.multi)
        ) {
          points = points.map((pointValue, i) => pointValue + option.cost[i]);
        } else {
          points = points.map((pointValue, i) => pointValue - option.cost[i]);
        }

        switch (choiceType) {
          case SELECTION_TYPE.multi:
            if (isSelected && option.unique) {
              currentSelectionItem[option.title] -= 1;
              activeEffects = adjustEffect(true, activeEffects, option.effects);
            } else {
              if (currentSelectionExists) {
                if (!!currentSelectionItem[option.title]) {
                  currentSelectionItem[option.title] += 1;
                  activeEffects = adjustEffect(
                    false,
                    activeEffects,
                    option.effects
                  );
                } else {
                  currentSelectionItem[option.title] = 1;
                  activeEffects = adjustEffect(
                    false,
                    activeEffects,
                    option.effects
                  );
                }
              } else {
                currentSelectionItem = {
                  [option.title]: 1,
                };
                activeEffects = adjustEffect(
                  false,
                  activeEffects,
                  option.effects
                );
              }
            }
            break;

          case SELECTION_TYPE.uniqueMulti:
            const indexOfItem = currentSelectionExists
              ? currentSelectionItem.indexOf(option.title)
              : -1;
            if (isSelected) {
              currentSelectionItem.splice(indexOfItem, 1);
              activeEffects = adjustEffect(true, activeEffects, option.effects);
            } else {
              if (!currentSelectionExists) {
                currentSelectionItem = [option.title];
              } else {
                currentSelectionItem.push(option.title);
              }
              activeEffects = adjustEffect(
                false,
                activeEffects,
                option.effects
              );
            }
            break;

          case SELECTION_TYPE.uniqueOnce:
            if (isSelected) {
              currentSelectionItem = "";
              activeEffects = adjustEffect(true, activeEffects, option.effects);
            } else {
              if (!!currentSelectionItem && currentSelectionItem !== "") {
                const currentSelectionData = choice.options.find(
                  (option) => option.title === currentSelectionItem
                );
                activeEffects = adjustEffect(
                  true,
                  activeEffects,
                  currentSelectionData.effects
                );
                points = points.map(
                  (pointValue, i) => pointValue + currentSelectionData.cost[i]
                );
              }

              currentSelectionItem = option.title;
              activeEffects = adjustEffect(
                false,
                activeEffects,
                option.effects
              );
            }
            break;
        }

        selections[choice.title] = currentSelectionItem;
      }

      return {
        points,
        selections,
        effects: activeEffects,
        playerImage: choice.applyToPlayerImage
          ? `${location.origin}${option.image}`
          : current.playerImage,
      };
    });
  }

  function getMultiVaues(choice, currentPickedChoices, option) {
    if (!choice?.choicesUnique) {
      return (
        currentPickedChoices.selections?.[choice.title]?.[option.title] ?? 0
      );
    }
    return false;
  }

  function clearMulti(choice, option) {
    Choices.update((current) => {
      const selections = { ...current.selections };
      const effects = adjustEffect(
        false,
        current.effects,
        option.effects,
        true
      );

      let currentSelectionItem = selections[choice.title];
      const currentSelectionQuantity = currentSelectionItem[option.title];

      let points = current.points;
      points = points.map(
        (pointValue, i) =>
          pointValue + option.cost[i] * currentSelectionQuantity
      );

      currentSelectionItem[option.title] = 0;
      return {
        points,
        selections,
        effects,
      };
    });
  }
</script>

{#key currentChoices}
  {#each config.choices as choice, i}
    <Card style={cardStyle} className="relative" id="section-{choice.title.toLowerCase().replace(/\s/g, "-")}">
      <button
        on:click={() => updateCollapsed(i, !isCollapsedList[i])}
        class={`${isCollapsedList[i] ? "bg-slate-900" : "bg-slate-500"} transition-colors bg-opacity-60 text-white p-1 px-1.5 rounded-md top-0 left-full sticky w-min h-6 -mb-6 z-20`}
        ><Icon icon="gravity-ui:chevrons-collapse-vertical" /></button
      >

      <div class="flex flex-col gap-3" id={choice.title}>
        <h2 class="text-2xl font-bold">{choice.title}</h2>

        <p class="text-sm para">{choice.description}</p>
        <p class="text-sm">
          <span class="underline decoration-double">Selection:</span>
          {choiceSummary(choice)}
        </p>

        <div class="flex flex-col gap-3">
          {#if !isCollapsedList[i]}
            <div class="w-full h-px bg-black"></div>
            {#if choice.style === "list"}
              <div class="flex flex-col gap-3 items-center">
                {#each choice.options as opt}
                  {@const isSelected = isOptionSelected(
                    opt,
                    currentChoices.selections[choice.title],
                    choice
                  )}
                  {@const multiValues = getMultiVaues(
                    choice,
                    currentChoices,
                    opt
                  )}

                  <!-- LIST BTN -->
                  <button
                    class={`relative flex flex-col xs:flex-row justify-between gap-3 xl:gap-6 border-2 pl-1.5 w-full max-w-5xl ${isSelected ? "border-red-600" : "border-transparent"}`}
                    style={isSelected ? selectionStyle : unselectionStyle}
                    on:click={() => onOptionSelect(opt, choice)}
                  >
                    {#if !!multiValues && !opt.unique}
                      <!-- svelte-ignore a11y-click-events-have-key-events -->
                      <div
                        on:click={(e) => {
                          e.stopPropagation();
                        }}
                        role="button"
                        tabindex="-1000"
                        class="absolute flex items-center gap-1.5 right-0 top-0 bg-black bg-opacity-60 rounded-bl-md p-0.5 px-1.5 text-sm text-white"
                      >
                        <span>x{multiValues}</span>
                        <button
                          on:click={(e) => {
                            clearMulti(choice, opt);
                            e.stopPropagation();
                          }}
                          ><Icon
                            icon="ant-design:close-circle-filled"
                          /></button
                        >
                      </div>
                    {/if}
                    <div class="flex flex-col gap-1.5 items-start py-1.5">
                      <h4 class="font-semibold">{opt.title}</h4>
                      <p class="text-sm text-left para">{opt.description}</p>
                      <Cost {opt} />
                    </div>
                    <img
                      src={opt.image}
                      alt={choice.title}
                      class="border-4 border-black max-w-40"
                    />
                  </button>
                {/each}
              </div>
            {:else}
              <div class="flex flex-wrap w-full gap-3 2xl:gap-6 justify-center">
                {#each choice.options as opt}
                  {@const isSelected = isOptionSelected(
                    opt,
                    currentChoices.selections[choice.title],
                    choice
                  )}
                  {@const multiValues = getMultiVaues(
                    choice,
                    currentChoices,
                    opt
                  )}

                  <!-- BOXES BTN -->
                  <button
                    class={`w-full flex flex-col gap-3 border-2 rounded-lg md:w-64 lg:w-72 xl:w-80 overflow-hidden relative ${isSelected ? "border-red-600" : "border-black"}`}
                    style={isSelected ? selectionStyle : unselectionBoxStyle}
                    on:click={() => onOptionSelect(opt, choice)}
                  >
                    {#if !!multiValues && !opt.unique}
                      <!-- svelte-ignore a11y-click-events-have-key-events -->
                      <div
                        on:click={(e) => {
                          e.stopPropagation();
                        }}
                        role="button"
                        tabindex="-1000"
                        class="absolute flex items-center gap-1.5 right-0 top-0 bg-black bg-opacity-60 rounded-bl-md p-0.5 px-1.5 text-sm text-white"
                      >
                        <span>x{multiValues}</span>
                        <button
                          on:click={(e) => {
                            clearMulti(choice, opt);
                            e.stopPropagation();
                          }}
                          ><Icon
                            icon="ant-design:close-circle-filled"
                          /></button
                        >
                      </div>
                    {/if}
                    {#if opt.image}
                      <img
                        class="w-full h-auto"
                        src={opt.image}
                        alt={choice.title}
                      />
                    {/if}

                    <div
                      class="flex-1 flex justify-between flex-col gap-1.5 items-start p-1.5 xl:p-3 xl:gap-3"
                    >
                      <div class="flex flex-col gap-1.5 xl:gap-3">
                        <h4 class="font-semibold">{opt.title}</h4>
                        <p class="text-sm text-left para">{opt.description}</p>
                      </div>
                      <Cost {opt} />
                    </div>
                  </button>
                {/each}
              </div>
            {/if}
          {/if}
        </div>
      </div>
    </Card>
  {/each}
{/key}
