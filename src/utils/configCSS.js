export function configCSS({
    text,
    title,
    paragraph,
    main,
    sidebar,
}) {


    return `
        :root {
            --text-font-family: ${text.familyMain};
            --text-font-size: ${text.rootSize};
            --text-color: ${text.textColor};

            --title-font-family: ${title.fontFamily};
            --title-font-size: ${title.fontSize};
            --title-font-weight: ${title.fontWeight};
            --title-background-color: ${title.backgroundColor};
            --title-text-color: ${title.textColor};

            --paragraph-line-height: ${paragraph.lineHeight};
            --paragraph-letter-spacing: ${paragraph.letterSpacing};
            --paragraph-font-family: ${paragraph.fontFamily};

            --main-page-background-color: ${main.pageBackgroundColor};

            --main-card-bg-color: ${main.cardBackgroundColor};
            --main-card-border-color: ${main.cardBorderColor};
            --main-card-border-radius: ${main.cardBorderRadius};
            --main-card-border-width: ${main.cardBorderWidth}px;

            --main-unselected-option-border: ${main.unselectedOptionBorder};
            --main-unselected-option-bg: ${main.unselectedOptionBg};
            --main-unselected-option-text-color: ${main.unselectedOptionTextColor};

            --main-selected-option-border: ${main.selectedOptionBorder};
            --main-selected-option-bg: ${main.selectedOptionBg};
            --main-selected-option-text-color: ${main.selectedOptionTextColor};

            --main-list-image-border-color: ${main.listImageBorder};

            font-family: var(--text-font-family);
            font-size: var(--text-font-size);
            color: var(--text-color);
        }
    `
}
