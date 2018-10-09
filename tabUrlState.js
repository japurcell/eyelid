const tabUrlState = (function()
{
    let urls = {};

    chrome.tabs.query({ active: true }, tabs =>
        tabs && tabs.forEach(tab =>
            urls[tab.id] = tab.url));

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>
        urls[tabId] = tab.url);

    chrome.tabs.onRemoved.addListener((tabId, removeInfo) =>
        delete urls[tabId]);

    return {
        contains: url =>
        {
            for (const tabId in urls)
            {
                if (urls[tabId] === url)
                    return true;
            }

            return false;
        },
        url: tabId =>
        {
            console.debug(`Querying ${JSON.stringify(urls)} for tabId ${tabId}`);
            return urls[tabId];
        }
    };
}());