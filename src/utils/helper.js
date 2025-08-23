import { EFFECT_TYPE, SELECTION_TYPE } from "../stores/choices";

export function getSelectionType(choice) {
  if (!choice.choicesUnique) {
    return SELECTION_TYPE.multi;
  } else if (choice.maxChoices > 1) {
    return SELECTION_TYPE.uniqueMulti;
  }
  return SELECTION_TYPE.uniqueOnce;
}


export function adjustplayerEffects(
    isRemoveAction,
    currentEffects,
    optionEffects,
    isClear = false
  ) {
    const currentEffectsLocal = { ...currentEffects };

    optionEffects.map((effect) => {
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