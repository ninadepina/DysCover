export const createTooltip = (tooltipText, buttonId, site) => {
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');

    const tooltipSpan = document.createElement('span');
    tooltipSpan.classList.add('tooltip-text');
    tooltipSpan.textContent = tooltipText;
    tooltip.appendChild(tooltipSpan);

    const button = document.createElement('button');
    button.id = `${site}--${buttonId}`;
    button.textContent = buttonId;
    tooltip.appendChild(button);

    return tooltip;
};