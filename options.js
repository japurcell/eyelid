let page = document.getElementById('buttonDiv');
const buttonColors = [
    '#3aa757',
    '#e8453c',
    '#f9bb2d',
    '#4688f1'
];

const constructOptions = (colors) =>
{
    for (let color of colors)
    {
        let button = document.createElement('button');
        button.style.backgroundColor = color;
        button.addEventListener('click', () =>
        {
            chrome.storage.sync.set({ color: color}, () =>
            {
                console.log(`Color is ${color}`);
            });
        });

        page.appendChild(button);
    }
};

constructOptions(buttonColors);