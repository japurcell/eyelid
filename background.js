const SelectStateKey = 'selectState';
const StateOnText = 'ON';
const StateOffText = 'OFF';
let CurrentState = 0;
let UrlState = 0;

const mapState = (state, on, off) =>
	state === 1
		? on()
		: off();

const setBadgeText = (state, callback) =>
{
	CurrentState = state;

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
	{
		const tabUrl = tabUrlState.url(details.tabId) ||  '';

		console.debug(`Rcvd ${tabUrl} from tabUrlState`);

		if (CurrentState === 1 &&
			tabUrl &&
			!tabUrl.search(/facebook/))
		{
			UrlState = 1;
			return {
				redirectUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
			};
		}
		else
		{
			UrlState = 0;
		}
	},
	{
		urls: ["<all_urls>"],
		types: ["image", "object"]
	}, ["blocking"]);

chrome.tabs.onUpdated.addListener(() =>
	getSelectionState(state =>
		mapState(
			state,
			() => UrlState === 1
				? 
					chrome.tabs.insertCSS(
						null,
						{
							code: 'img { visibility: hidden; }',
							runAt: 'document_start'
						})
				: null,
			() => null
		)));

getSelectionState(state =>
{
	CurrentState = state;
	setBadgeText(state);
});