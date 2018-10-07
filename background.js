const SelectStateKey = 'selectState';
const StateOnText = 'ON';
const StateOffText = 'OFF';

const mapState = (state, on, off) =>
	state === 1
		? on()
		: off();

const setBadgeText = (state, callback) =>
{
	const text =
		mapState(
			state,
			() => StateOnText,
			() => StateOffText
		);

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
		const nextState = mapState(state, () => 0, () => 1);

		console.debug(`Toggling state to ${nextState}`);

		setBadgeText(nextState, () =>
			chrome.storage.sync.set({ selectState: nextState }));
	});

chrome.browserAction.onClicked.addListener(toggleText);

chrome.webRequest.onBeforeRequest.addListener(details =>
	// TODO: can't be async
	getSelectionState(state =>
		{
			if (state === 1)
			{
				return { redirectUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==" };
			}
		}),
		{
			urls: ["http://*/*", "https://*/*"],
			types: ["image", "object"]
		}, ["blocking"]);

chrome.tabs.onUpdated.addListener(() =>
	getSelectionState(state =>
		mapState(
			state,
			() => chrome.tabs.insertCSS(
				null,
				{
					code: 'img { visibility: hidden; }',
					runAt: 'document_start'
				}
			),
			() => null
		)));

getSelectionState(setBadgeText);

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