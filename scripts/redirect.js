const setRedirectVariables = () => {
    chrome.storage.local.get([
        "enabledSites", "bannedWebsites", "blacklistWords"
    ], (result) => {
        if (!result.enabledSites) {
            chrome.storage.local.set({enabledSites: []}, () => {});
        }

        if (!result.bannedWebsites) {
            chrome.storage.local.set({bannedWebsites: []}, () => {});
        }

        if (!result.blacklistWords) {
            chrome.storage.local.set({blacklistWords: []}, () => {});
        }
    });
}
setRedirectVariables();

const pornWebsites = [
    'xvideos.com', 'pornhub.com', 'xhamster.com', 'xnxx.com',
    'youporn.com', 'hclips.com', 'porn.com', 'tnaflix.com',
    'tube8.com', 'spankbang.com', 'drtuber.com', 'nuvid.com',
    'ixxx.com', 'sunporno.com', 'pornhd.com', 'porn300.com',
    'pornone.com', 'sexvid.xxx', 'thumbzilla.com', 'zbporn.com',
    'fuq.com', 'xxxbunker.com', 'hdhole.com', '3movs.com',
    'cumlouder.com', 'porndoe.com', 'xbabe.com', 'vipwank.com',
    'porndroids.com', 'alohatube.com', 'maturetube.com',
    'tubev.sex', '4tube.com', 'shameless.com', 'megatube.xxx',
    'porntube.com', 'porndig.com', 'pornburst.xxx', 'bigporn.com',
    'porn.biz', 'xxxvideo.best', 'fapvidhd.com', 'melonstube.com',
    'tastyblacks.com', 'lobstertube.com', 'viviporn.tv',
    'pornrox.com', 'pornmaki.com', 'pornid.xxx', 'upskirt.tv',
    'slutload.com', 'proporn.com', 'pornhost.com', 'hotporntubes.com',
    'thematureporn.net', 'xxxvideos247.com', 'its.porn',
    'handjobhub.com', 'dansmovies.com', 'porn7.xxx', 'forhertube.com',
    'pornheed.com', 'orgasm.com', 'pornrabbit.com', 'tiava.com',
    'fux.com', 'h2porn.com', 'metaporn.com', 'here.xxx',
    'pornerbros.com', "boundhub.com", "theduchy.com", "shibari.ph"
];

// Redirect
const redirectBecauseSus = (word, where) => {
    alert(`Prohibited website detected. Found ${word} in ${where}. Redirecting.`);
    window.location.replace("http://www.google.com");
}

const stopBadStuff = () => {
    chrome.storage.local.get(["blacklistWords"], (result) => {
        const blacklistWords = result.blacklistWords;
        if (blacklistWords.find(word => document.title.toLowerCase().includes(word))) {
            if (blacklistWords.find(word => window.location.href.toLowerCase().includes(word))) {
                redirectBecauseSus(
                    `"${blacklistWords.find(word => window.location.href.toLowerCase().includes(word))}"`,
                    "the URL of the page"
                );
            } else if (blacklistWords.find(word => document.title.toLowerCase().includes(word))) {
                redirectBecauseSus(
                    `"${blacklistWords.find(word => document.title.toLowerCase().includes(word))}"`,
                    "the title of the page"
                );
            }
        }
    });

    chrome.storage.local.get(["enabledSites"], (enabledSitesObj) => {
        let enabledSites = [];

        if (Object.keys(enabledSitesObj).length < 1) {
            chrome.storage.local.set({enabledSites: []}, () => {});
        } else {
            enabledSites = enabledSitesObj.enabledSites;
        }

        let enabledSite = enabledSites.find(site => 
            window.location.host.toLowerCase().includes(site.host) &&
            (site.deadline > Date.now())
        );

        if (!enabledSite) {
            // disable banned websites
            chrome.storage.local.get(["bannedWebsites"], (result) => {
                if (result.bannedWebsites) {
                    let bannedWebsites = [...pornWebsites, ...result.bannedWebsites];
                    bannedWebsite = bannedWebsites.find(website => window.location.host.toLowerCase().includes(website));
                    if (bannedWebsite) {
                        redirectBecauseSus(
                            `a banned URL`,
                            "the host URL"
                        );
                    }
                }
            });
        }
    });
}

stopBadStuff();
setInterval(stopBadStuff, 10000);