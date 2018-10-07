const SelectStateKey = 'selectState';
const StateOnText = 'ON';
const StateOffText = 'OFF';

const setBadgeText = (state, callback) =>
{
	const text = state === 1
		? StateOnText
		: StateOffText;

	console.debug(`Setting badge text to ${text}`);

	chrome.browserAction.setBadgeText({ text: text}, callback);
};

const getSelectionState = callback =>
	chrome.storage.sync.get(SelectStateKey, rState =>
	{
		console.debug(`Retrieved State: ${JSON.stringify(rState)}`);

		callback(rState.selectState);
	});

const toggleText = () =>
	getSelectionState(state =>
	{
		const nextState = state === 1
			? 0
			: 1;

		console.debug(`Toggling state to ${nextState}`);

		setBadgeText(nextState, () =>
			chrome.storage.sync.set({ selectState: nextState }));
	});

chrome.browserAction.onClicked.addListener(toggleText);

getSelectionState(setBadgeText);

// chrome.declarativeContent.onPageChanged.removeRules(undefined, () =>
// {
// 	chrome.declarativeContent.onPageChanged.addRules([{
// 		conditions: [new chrome.declarativeContent.PageStateMatcher({
// 			pageUrl: { hostEquals: 'developer.chrome.com' },
// 		})],
// 		actions: [new chrome.declarativeContent.ShowPageAction()]
// 	}]);
// });

// if (!localStorage.on) {
//     localStorage.on = '1';
// }

// if (localStorage.on == '1') {
// 	chrome.browserAction.setIcon({path: "images/icon19.png"});
// } else {
// 	chrome.browserAction.setIcon({path: "images/icon19-disabled.png"});
// }

// chrome.browserAction.onClicked.addListener(function(tab) {
// 	if (localStorage.on == '1') {
// 		chrome.browserAction.setIcon({path: "images/icon19-disabled.png"});
// 		localStorage.on = '0';
// 	} else {
// 		chrome.browserAction.setIcon({path: "images/icon19.png"});
// 		localStorage.on = '1';
// 	}
// });

// chrome.webRequest.onBeforeRequest.addListener(function(details) {
// 	if (localStorage.on == '1') {
// 		return {redirectUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="};
// 	}
// }, {urls: ["http://*/*", "https://*/*"], types: ["image", "object"]}, ["blocking"]);

// chrome.tabs.onUpdated.addListener(function() {
// 	if (localStorage.on == '1') {
// 		chrome.tabs.insertCSS(null, {code: "img{visibility: hidden;}", runAt: "document_start"});	    
// 	}
// });