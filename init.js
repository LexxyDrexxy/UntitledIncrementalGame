function initGameObject() {
    return {
        stats: {
            totalClicks: 0,
            totalShapes: 0,
            totalGildedShapes: 0,
            totalPrestige: 0,
            overclockCount: 0,
            statsOpen: false,
            helpOpen: false,
            clicksInLastSecond: 0,
        },
        resources: {
            shapes: 0,
            gildedShapes: 0,
            astralShapes: 0,
            paintedShapes: {
                t1: [0,0,0], // [red, blue, yellow]
                t2: [0,0,0], // [orange, purple, green]
                golden: 0,
            },
        },
        variables: {
            shapesPerClick: 1,
            ticksPerClick: 1,
            efficiency: 0,
            overclocked: false,
            overclockBoost: 1.2,
            canOverclock: true,
            overclockTimer: 0,
            paintedShapesBoost: 100,
            overclockCooldown: 40,
        },
        prestige: {
            prestigeMin: 10_000,
            prestigeIncrement: 10,
            gildedShapesBoostPercent: 100,
            gildedShapesGainPercent: 100,
            astralShapesOnPrestigePercent: 0,
        },
        shop: {
            costs: [10, 100, 1_500, 100_000, 25_000_000, 1_000_000_000],
            costIncreaseFuncs: [
                (x)=>x*2,
                (x)=>x*3,
                (x)=>x*2,
                (x)=>x*3,
                (x)=>game.shop.levels[4]>=25 ? x**1.02*3 : x*3,
                (x)=>+((x**1.03).toPrecision(3)),
            ],
            levels: [0,0,0,0,0,0]

        },
        altar: {
            altarOpen: false,
            altarUnlocked: false,
            altarDiv: document.getElementById('altar'),
            altarCurrenciesDiv: document.getElementById('altar-currencies'),
            astralShapesAvailable: 0,
            astralShapesAllocated: [0, 0, 0, 0],
            totalAstralAllocated: 0,
            spells: ["Golden Ritual", "Gifted Rebirth", "Astral Prestige", "Cosmic Colours"],
        },
        painting: {
            paintingOpen: false,
            paintingUnlocked: false,
            tierCosts: [100_000, 10], // tier 1 is shapes, rest are gilded shapes
        },
        achievements: {
            names: [
                "It has to start somewhere",
                "Most generic idle game mechanic",
                "Buttons are very useful things",
                "Well, thank you very much",
                "Tiny little thing :)",
                "OVER overclocked",
                "Can't count that high",
                "Δβγξξ",
                "01001000 00110100 01011000 01011000 00110000 01010010",
                "You CHEATER",
                "The obligatory SUS achievement",
                "Inflation",
                // this is all one string
                "<span style='font-size:4px'>Though it must be prefaced that E.G.O gears are standardized equipment, " +
                    "when juxtaposed with E.G.O gear from L Corp., depending on the degree of attunement to the Abnormality, " +
                    "the idiosyncrasies of the source may be utilized with greater flexibility. Yet, the degree to which that attunement" +
                    " and synchronization are achieved may resultantly allow the user to be devoured. This is reflected in their appearance, " +
                    "more closely resembling the source Abnormality than E.G.O of the former L Corp. do. E.G.O disintegration is not unlike decomposition of compost</span>"
            ],
            descriptions: [
                "Gain 100 shapes.",
                "Prestige for the first time.",
                "???",
                "???",
                "???",
                "Overclock 25 times.",
                "Have over 10 Gilded Shapes after you prestige once.",
                "Unlock the Altar.",
                "???",
                "???",
                "???",
                "Reach ^2 overclock boost.",
                "???",
            ],
            secretAchievementDescriptions: [
                null,
                null,
                "Press an achievement button.",
                "Click on any of my links.",
                "Tiny little hamster :)",
                null,
                null,
                null,
                "Execute the function hax() from the console.",
                "You used an autoclicker. (Either that, or you clicked really fast)",
                "Have exactly 69 or 420 shapes. Ha ha.",
                null,
                "Click a little link in the help text. The small text is possibly a reference."
            ],
            achievementsOpen: false,
            // the next 2 properties are filled by generateAchievementMatrix()
            sorted: {
                achievements: [],
                descriptions: [],
            },
            buttons: [],
        },
        divs: {
            mainDiv: document.getElementById("main-game"),
            altarDiv: document.getElementById("altar"),
            paintingDiv: document.getElementById("paint"),
            achievementDiv: document.getElementById("achievement-text"),
            achievementButtonDiv: document.getElementById("achievements"),
            settingsDiv: document.getElementById("settings"),
        },
        settings: {
            settingsOpen: false,
            autosave: true
        },
        other: {
            betterAlertInterval: null
        }
    }
}

let game = initGameObject();

const get = (id) => {
    if (id[0] !== "#" || id[0] !== ".") id = "#" + id
    return document.querySelector(id)
}

const localStorageItems = () => {
    let localStorageItems = [
        ["stats-totalClicks",game.stats.totalClicks],
        ["stats-totalShapes",game.stats.totalShapes],
        ["stats-totalGildedShapes",game.stats.totalGildedShapes],
        ["stats-totalPrestige",game.stats.totalPrestige],
        ["stats-overclockCount",game.stats.overclockCount],
        ["resources-shapes",game.resources.shapes],
        ["resources-gildedShapes",game.resources.gildedShapes],
        ["resources-astralShapes",game.resources.astralShapes],
        ["resources-paintedShapes-t1-0",game.resources.paintedShapes.t1[0]],
        ["resources-paintedShapes-t1-1",game.resources.paintedShapes.t1[1]],
        ["resources-paintedShapes-t1-2",game.resources.paintedShapes.t1[2]],
        ["resources-paintedShapes-t2-0",game.resources.paintedShapes.t2[0]],
        ["resources-paintedShapes-t2-1",game.resources.paintedShapes.t2[1]],
        ["resources-paintedShapes-t2-2",game.resources.paintedShapes.t2[2]],
        ["resources-paintedShapes-golden",game.resources.paintedShapes.golden],
        ["variables-shapesPerClick",game.variables.shapesPerClick],
        ["variables-ticksPerClick",game.variables.ticksPerClick],
        ["variables-efficiency",game.variables.efficiency],
        ["variables-overclockBoost",game.variables.overclockBoost],
        ["variables-overclockCooldown",game.variables.overclockCooldown],
        ["variables-paintedShapesBoost",game.variables.paintedShapesBoost],
        ["prestige-prestigeMin",game.prestige.prestigeMin],
        ["prestige-gildedShapesBoostPercent",game.prestige.gildedShapesBoostPercent],
        ["prestige-gildedShapesGainPercent",game.prestige.gildedShapesGainPercent],
        ["prestige-astralShapesOnPrestigePercent",game.prestige.astralShapesOnPrestigePercent],
        ["altar-altarUnlocked",game.altar.altarUnlocked],
        ["altar-astralShapesAvailable",game.altar.astralShapesAvailable],
        ["altar-totalAstralAllocated",game.altar.totalAstralAllocated],
        ["painting-paintingUnlocked",game.painting.paintingUnlocked],
    ]
    for (let i=0;i<game.shop.costs.length;i++) localStorageItems.push(["shop-costs-"+i,game.shop.costs[i]]);
    for (let i=0;i<game.shop.levels.length;i++) localStorageItems.push(["shop-levels-"+i,game.shop.levels[i]]);
    for (let i=0;i<game.altar.astralShapesAllocated.length;i++) localStorageItems.push(["altar-astralShapesAllocated-"+i,game.altar.astralShapesAllocated[i]]);
    for (let i=0;i<game.achievements.unlocked.length;i++) localStorageItems.push(["achievements-unlocked-"+i,game.achievements.unlocked[i]?1:0]);
    return localStorageItems
}

const convertBoolToString = bool => bool ? "Yes" : "No"
game.divs.altarDiv.style.display = 'none';
game.divs.paintingDiv.style.display = 'none';
game.divs.achievementDiv.style.display = 'none';
game.divs.achievementButtonDiv.style.display = 'none';
game.altar.altarCurrenciesDiv.style.display = 'none';
game.divs.mainDiv.style.display = 'block';
get("overclock-cooldown").style.display = "none";
get("overclock-active").style.display = "none";
game.achievements.unlocked = new Array(game.achievements.names.length).fill(false)
game.achievements.secretAchievementCount = game.achievements.descriptions.filter(x => x === "???").length
document.body.onload = () => {
    get("modal").style.display = "block"
    get("modal-close").onclick = () => {get("modal").style.display = "none"}
    if (+localStorage.getItem("stats-totalClicks") === 0 && +localStorage.getItem("stats-totalShapes") === 0) hardReset(false)
    if (!(navigator.cookieEnabled)) {
        const txt = document.createElement("p")
        txt.classList.add("main-text-mono")
        txt.innerHTML = "Your cookies are disabled!"
        txt.style.fontSize = "35px"
        txt.style.backgroundColor = "#be0000"
        txt.style.borderRadius = "5px"
        txt.style.color = "#4b0000"
        txt.style.textAlign = "center"
        get("hello-txt").insertAdjacentElement("beforebegin",txt)
    }
    generateAchievementMatrix();
    loadFromLocalStorage()
    for (let i=0;i<game.shop.costs.length;i++) {
        get(`shop-${i}-cost`).innerHTML = `Cost: ${game.shop.costs[i].toLocaleString("en-US")} shapes`;
    }
    updateShopButtons()
    updateShopTexts()
    get("stats-text").innerHTML = ""
}
window.setInterval(() => idleIncreaseShapes(), 1000)
window.setInterval(() => cheaterCheck(), 1000)
window.setInterval(() => {if (game.settings.autosave) saveToLocalStorage()}, 25000)
window.onclick = (e) => {
    if (e.target === get("modal") && navigator.cookieEnabled) get("modal").style.display = "none";
}
get("main-button").onkeydown = (e) => {if (e.keyCode === 13) e.preventDefault();}

function increaseShapes() {
    let increment = game.variables.shapesPerClick * game.variables.ticksPerClick * (1 + game.variables.efficiency);
    increment += game.resources.gildedShapes * (game.prestige.gildedShapesBoostPercent / 100) * (game.variables.shapesPerClick / 2);
    if (game.variables.overclocked) increment = increment ** game.variables.overclockBoost;
    increment = Math.round(increment);

    game.resources.shapes += increment
    game.stats.totalClicks++;
    game.stats.clicksInLastSecond++;
    game.stats.totalShapes += increment;
    if (game.stats.statsOpen) updateStatsText();
    if (game.resources.shapes >= 100) gainAchievement(0);
    if (game.resources.shapes === 69 || game.resources.shapes === 420) gainAchievement(10);
    updateShopButtons();
    updateShapeText();
}

function generateAchievementMatrix() {
    let i = 0;
    let sortedAchievements = []
    let secretAchievements = [];
    let sortedDescriptions = [];
    for (let i in game.achievements.names) {
        if (game.achievements.descriptions[i] !== "???") {
            sortedAchievements.push(game.achievements.names[i])
            sortedDescriptions.push(game.achievements.descriptions[i])
        } else secretAchievements.push(game.achievements.names[i]);
    }
    for (let i in secretAchievements) {
        sortedAchievements.push(secretAchievements[i]);
        sortedDescriptions.push("???");
    }
    for (let item of sortedAchievements) {
        let button = document.createElement("button");
        button.innerHTML = `${item}: ${sortedDescriptions[i]}`;
        button.classList.add("button");
        button.classList.add("achievement-locked");
        button.onclick = () => gainAchievement(2);
        get("achievements").appendChild(button);
        get("achievements").appendChild(document.createElement("br"));
        if (i === game.achievements.descriptions.length - game.achievements.secretAchievementCount - 1) {
            get("achievements").appendChild(document.createElement("br"));
        }
        game.achievements.buttons.push(button);
        i++;
    }
    game.achievements.sorted.achievements = sortedAchievements;
    game.achievements.sorted.descriptions = sortedDescriptions;
}

function idleIncreaseShapes() {
    for (let i in game.resources.paintedShapes.t1) {
        let increment = game.resources.paintedShapes.t1[i] * Math.round(game.resources.paintedShapes.t2[i] / 10 + 1) * Math.round(game.variables.paintedShapesBoost / 100) * 10_000
        increment *= game.resources.paintedShapes.golden + 1
        if (increment !== 0) game.resources.shapes += increment;
    }
    updateShapeText();
    if (game.stats.statsOpen) updateStatsText();
    updateShopButtons()
}

function updateShapeText() {
    get("shapes-text").innerHTML = `Shapes: ${game.resources.shapes.toLocaleString("en-US")}`;
    get("gilded-shapes-text").innerHTML = `Gilded Shapes: ${game.resources.gildedShapes.toLocaleString("en-US")}`;

    if (game.altar.altarOpen) {
        get("astral-shapes-text").innerHTML = `Astral Shapes: ${game.resources.astralShapes.toLocaleString("en-US")}`;
        get("astral-shapes-available-text").innerHTML = `Astral Shapes Available: ${game.altar.astralShapesAvailable.toLocaleString("en-US")}`;
    }
}

function updateAllText() {
    updateShapeText();
    if (game.stats.statsOpen) updateStatsText();
    updateShopButtons()
    get("prestige-button").innerHTML = `Prestige (requires ${game.prestige.prestigeMin.toLocaleString("en-US")} shapes)`
}

function updateStatsText() {
    get("stats-text").innerHTML = `
        Total Clicks: ${game.stats.totalClicks.toLocaleString("en-US")}<br>
        Total Shapes: ${game.stats.totalShapes.toLocaleString("en-US")}<br>
        Total Gilded Shapes: ${game.stats.totalGildedShapes.toLocaleString("en-US")}<br>
        Total Prestiges: ${game.stats.totalPrestige.toLocaleString("en-US")}<br>
        Shapes per Click: ${game.variables.shapesPerClick.toLocaleString("en-US")}<br>
        Ticks per Click: ${game.variables.ticksPerClick.toLocaleString("en-US")}<br>
        Efficiency: ${game.variables.efficiency.toLocaleString("en-US")}<br>
        Overclock Boost: ^${game.variables.overclockBoost.toLocaleString("en-US")}<br>
        Shapes gained on click: ${game.variables.shapesPerClick * game.variables.ticksPerClick * (1 + game.variables.efficiency) + game.resources.gildedShapes * (game.prestige.gildedShapesBoostPercent / 100) * (game.variables.shapesPerClick / 2)}<br><br>

        Is altar unlocked? ${convertBoolToString(game.altar.altarUnlocked)}<br>
        Astral Shapes allocated: ${game.altar.totalAstralAllocated.toLocaleString("en-US")}<br>
        Astral Shapes available: ${game.altar.astralShapesAvailable.toLocaleString("en-US")}<br><br>

        Is painting unlocked? ${convertBoolToString(game.painting.paintingUnlocked)}<br>
        Golden Shapes: ${game.resources.paintedShapes.golden.toLocaleString("en-US")}<br>
        Total Tier I Shapes: ${game.resources.paintedShapes.t1.reduce((a,b) => a+b,0).toLocaleString("en-US")}<br>
        Total Tier II Shapes: ${game.resources.paintedShapes.t2.reduce((a,b) => a+b,0).toLocaleString("en-US")}<br>
    `
    get("stats-text").style.display = "inline-block";
}

function buyShopItem(item) {
    if (game.resources.shapes < game.shop.costs[item] || !(isFinite(game.shop.costs[item]))) return;

    game.resources.shapes -= game.shop.costs[item];
    game.shop.costs[item] = game.shop.costIncreaseFuncs[item](game.shop.costs[item]);
    game.shop.levels[item]++;

    get(`shop-${item}-cost`).innerHTML = `Cost: ${game.shop.costs[item].toLocaleString("en-US")} shapes`;

    switch (item) {
        case 0:
            game.variables.shapesPerClick++;
            break;
        case 1:
            game.variables.efficiency++;
            break;
        case 2:
            game.variables.ticksPerClick += 2;
            break;
        case 3:
            game.variables.shapesPerClick *= 2;
            break;
        case 4:
            game.variables.overclockBoost = (game.variables.overclockBoost * 100 + 5) / 100;
            get("overclock-text").innerHTML = `Overclocking gives ^${game.variables.overclockBoost.toLocaleString("en-US")} shape gain for 30 seconds and has a cooldown of ${game.variables.overclockCooldown} seconds.`
            if (Math.floor(game.variables.overclockBoost + 0.05) === 5) {
                const btn = get("shop-4")
                btn.disabled = true
                btn.classList.remove("other-button")
                btn.classList.add("disabled-button")
                game.shop.costs[4] = Infinity
                get(`shop-${item}-cost`).innerHTML = "This upgrade is maxed!"
            }
            break;
        case 5:
            game.variables.overclockCooldown -= 1
            if (game.variables.overclockCooldown === 1) {
                const btn = get("shop-5")
                btn.disabled = true
                btn.classList.remove("other-button")
                btn.classList.add("disabled-button")
                game.shop.costs[5] = Infinity
                get(`shop-${item}-cost`).innerHTML = "This upgrade is maxed!"
            }
            get("overclock-text").innerHTML = `Overclocking gives ^${game.variables.overclockBoost.toLocaleString("en-US")} shape gain for 30 seconds and has a cooldown of ${game.variables.overclockCooldown} seconds.`
            break;
    }

    if (game.variables.overclockBoost > 1.95) gainAchievement(11)

    saveToLocalStorage()
    if (game.stats.statsOpen) updateStatsText();
    updateShopButtons()
    updateShapeText();
}

function prestige() {
    if (game.resources.shapes < game.prestige.prestigeMin) {
        betterAlert(`You need at least ${game.prestige.prestigeMin.toLocaleString("en-US")} shapes to prestige.`)
        return;
    }
    if (!(confirm("Are you sure you want to prestige?"))) return;

    let increment = +((game.prestige.gildedShapesGainPercent / 100)*(Math.log10(game.resources.shapes) - 4).toFixed(2));
    game.resources.gildedShapes += increment;
    game.stats.totalGildedShapes += increment;
    game.stats.totalPrestige++;
    game.resources.shapes = 0;
    game.variables.efficiency = 0;
    game.variables.shapesPerClick = 1;
    game.variables.ticksPerClick = 1;
    game.prestige.prestigeMin *= game.prestige.prestigeIncrement;
    game.shop.costs = [10, 100, 2_500, 100_000, 25_000_000, 1_000_000_000];

    if (game.altar.astralShapesAllocated[2] > 0) {
        game.resources.astralShapes += increment * (game.prestige.astralShapesOnPrestigePercent / 100)
    }
    if (game.stats.totalPrestige >= 5) {
        game.painting.paintingUnlocked = true;
        get("painting-button").innerHTML = "Painting";
    }

    get("prestige-button").innerHTML = `Prestige (requires ${game.prestige.prestigeMin.toLocaleString("en-US")} shapes)`;
    if (!(game.achievements.unlocked[1])) gainAchievement(1);
    else if (game.resources.gildedShapes >= 10) gainAchievement(6);
    for (let i=0;i<game.shop.costs.length;i++) {
        get(`shop-${i}-cost`).innerHTML = `Cost: ${game.shop.costs[i].toLocaleString("en-US")} shapes`;
    }
    updateShapeText();
    updateShopButtons()
}

function toggleStats() {
    if (game.stats.statsOpen) {
        get("stats-text").innerHTML = "";
        get("stats-text").style.display = "none";
    } else updateStatsText();
    game.stats.statsOpen = !game.stats.statsOpen;
}

function toggleHelp() {
    if (game.stats.helpOpen) {
        get("help-text").innerHTML = "";
        get("help-text").style.display = "none";
    } else {
        get("help-text").innerHTML = `
        To get shapes, press the "generate shapes" button.<br>
        Once you have 10 shapes, you can increase the amount of shapes per click by 1.<br>
        This will cost 10 shapes, and the cost of buying it again will double.<br><br>
        
        Overclocking is a unique mechanic to increase your shape output.<br>
        Every 40s, you can Overclock which raises your shape gain to the power of 1.2 (without any upgrades).<br>
        Some upgrades can increase this.<br><br>
        
        Efficiency increases your shape gain by 1 for each point you have.<br>
        Ticks increase your shape gain by increasing the amount of times that your shapes are calculated per click.<br><br>
        
        Once you reach 10,000 shapes, you may gain prestige and gain Gilded Shapes based on the amount of shapes you have. (Formula: log10(shapes) - 4)<br>
        Each Gilded Shape gives you 50% of your shapes per click. <span onclick="gainAchievement(12)">Also, click here for an achievement.</span><br><br>
        
        After reaching 10 Gilded Shapes, the Altar is unlocked. There, you may convert Gilded Shapes into Astral Shapes, and allocate them to Spells.<br>
        Spells have various insanely positive effects based on the amount of Astral Shapes that are allocated to it.<br>
        As Astral Shapes do not give the buff that Gilded Shapes do, it is advised to have 0 Astral Shapes available.<br><br>
        
        After you gain prestige 10 times, you unlock the Painting menu. Shapes can be painted for 100,000 shapes, and they are the only idle income source.<br>
        Painted Shapes have multiple tiers, with each tier boosting the last. Painted Shapes only boost their own colour.<br>
        Orange Shapes (Tier II) only boost Red Shapes (Tier I).
        `
        get("help-text").style.display = "inline-block";
    }
    game.stats.helpOpen = !game.stats.helpOpen;
}

function toggleAltar() {
    if (game.resources.gildedShapes >= 10) game.altar.altarUnlocked = true;
    if (!(game.altar.altarUnlocked)) {
        get("altar-button").innerHTML = "Altar (requires 10 Gilded Shapes)";
        betterAlert("You need 10 Gilded Shapes to access the Altar.");
        return;
    }

    gainAchievement(7);
    get("altar-button").innerHTML = "Altar"
    if (game.altar.altarOpen) {
        game.altar.altarDiv.style.display = 'none';
        game.altar.altarCurrenciesDiv.style.display = "none";
        game.divs.mainDiv.style.display = 'block';
        document.body.style.backgroundColor = '#1b1e23';
    } else {
        game.altar.altarDiv.style.display = 'block';
        game.altar.altarCurrenciesDiv.style.display = "block";
        game.divs.mainDiv.style.display = 'none';
        document.body.style.backgroundColor = '#25003a';
    }
    game.altar.altarOpen = !game.altar.altarOpen;
    game.painting.paintingOpen = false;
}

function toggleSettings() {
    if (game.settings.settingsOpen) {
        game.divs.settingsDiv.style.display = 'none';
        get("settings-button").innerHTML = "Settings"
    }
    else {
        game.divs.settingsDiv.style.display = 'inline-block';
        get("settings-button").innerHTML = "Close"
    }
    game.settings.settingsOpen = !game.settings.settingsOpen;
}

function alterSetting(key, value) {
    game.settings[key] = value;
    const btn = get("settings-" + key)
    key = key.split(" ");
    for(let i=0;i<key.length;i++) {
        key[i] = key[i].charAt(0).toUpperCase() + key[i].substring(1);
    }
    key = key.join(" ");
    btn.innerHTML = key + ": " + (typeof value === "boolean" ? convertBoolToString(value) : value);
}

function convertShapes(type) {
    let amount = +prompt("How many shapes to convert?")
    if (!(typeof amount === "number") || isNaN(amount) || amount < 0 || !(isFinite(amount))) return;

    if (type === "astral") {
        if (game.resources.astralShapes < amount) {
            betterAlert("Not enough Astral Shapes!")
            return;
        } else {
            game.resources.astralShapes -= amount;
            game.altar.astralShapesAvailable -= amount;
            game.resources.gildedShapes += amount;
        }
    } else if (type === "gilded") {
        if (game.resources.gildedShapes < amount) {
            betterAlert("Not enough Gilded Shapes!")
            return;
        } else {
            game.resources.gildedShapes -= amount;
            game.altar.astralShapesAvailable += amount;
            game.resources.astralShapes += amount;
        }
    } else return;
    updateShapeText();
}

function allocateAstralShapes(spell) {
    let spellName = game.altar.spells[spell];
    let amount = +prompt("How many Astral Shapes to allocate in the spell?")
    if (amount === 0 || isNaN(amount) || !(isFinite(amount))) betterAlert("Please input a number!");

    game.altar.totalAstralAllocated = 0;
    for (let i of game.altar.astralShapesAllocated) {
        game.altar.totalAstralAllocated += i;
    }
    game.altar.astralShapesAvailable = game.resources.astralShapes - game.altar.totalAstralAllocated;

    if (amount > game.altar.astralShapesAvailable) {
        betterAlert("Not enough Astral Shapes available!")
        return;
    }
    game.altar.astralShapesAllocated[spell] += amount;
    game.altar.astralShapesAvailable -= amount;

    switch (spell) {
        case 0:
            game.prestige.gildedShapesBoostPercent = game.altar.astralShapesAllocated[spell] * 5 + 100;
            break;
        case 1:
            game.prestige.gildedShapesGainPercent = game.altar.astralShapesAllocated[spell] * 3 + 100;
            break;
        case 2:
            game.prestige.astralShapesOnPrestigePercent = game.altar.astralShapesAllocated[spell] * 2;
            break;
        case 3:
            game.variables.paintedShapesBoost = game.altar.astralShapesAllocated[spell] * 3 + 100;
            break;
    }
    betterAlert(`Allocated ${amount} Astral Shapes to spell ${spellName}!`);
    updateShapeText();
}

function togglePainting() {
    if (game.stats.totalPrestige >= 5) game.painting.paintingUnlocked = true;
    if (!(game.painting.paintingUnlocked)) {
        betterAlert("You need 5 total prestige to access Painting.")
        return;
    }

    get("painting-button").innerHTML = "Painting";
    if (game.painting.paintingOpen) {
        game.divs.mainDiv.style.display = 'block'
        game.divs.paintingDiv.style.display = 'none'
        document.body.style.backgroundColor = '#1b1e23';
    } else {
        game.divs.mainDiv.style.display = 'none'
        game.divs.paintingDiv.style.display = 'block'
        document.body.style.backgroundColor = '#1b020a';
    }
    game.painting.paintingOpen = !game.painting.paintingOpen;
    game.altar.altarOpen = false
}

function paintShapes(tier) {
    if (tier === 0 && game.resources.shapes < game.painting.tierCosts[tier]) {
        betterAlert(`To paint shapes of tier 1, you need ${game.painting.tierCosts[0].toLocaleString("en-US")} shapes!`);
        return;
    } else if (game.resources.gildedShapes < game.painting.tierCosts[tier]) {
        betterAlert(`To paint shapes of tier ${tier + 1}, you need ${game.painting.tierCosts[tier].toLocaleString("en-US")} Gilded Shapes!`);
        return;
    }

    if (tier === 0) game.resources.shapes -= game.painting.tierCosts[tier];
    else game.resources.gildedShapes -= game.painting.tierCosts[tier];
    let rng = +((Math.random() * 100).toFixed(2));
    switch (tier) {
        case 0:
            if (rng > 99) {
                game.resources.paintedShapes.golden++;
                betterAlert("WOW! +1 Golden Shape!")
            }
            else if (rng > 66) {
                game.resources.paintedShapes.t1[2]++;
                betterAlert("+1 Yellow Shape!")
            }
            else if (rng > 33) {
                game.resources.paintedShapes.t1[1]++;
                betterAlert("+1 Blue Shape!")
            }
            else {
                game.resources.paintedShapes.t1[0]++;
                betterAlert("+1 Red Shape!")
            }
            break;
        case 1:
            if (rng > 99) {
                game.resources.paintedShapes.golden++;
                betterAlert("WOW! +1 Golden Shape!")
            }
            else if (rng > 66) {
                game.resources.paintedShapes.t2[2]++;
                betterAlert("+1 Green Shape!")
            }
            else if (rng > 33) {
                game.resources.paintedShapes.t2[1]++;
                betterAlert("+1 Purple Shape!")
            }
            else {
                game.resources.paintedShapes.t2[0]++;
                betterAlert("+1 Orange Shape!")
            }
    }
}

function overclock() {
    if (!(game.variables.canOverclock)) return;
    game.variables.overclocked = true;
    game.variables.canOverclock = false;
    game.stats.overclockCount++;
    if (game.stats.overclockCount >= 25) gainAchievement(5)
    get("overclock-active").style.display = "block";
    get("overclock-button").disabled = true;
    window.setTimeout(() => overclockCooldown(), 30000)
}

function overclockCooldown() {
    game.variables.overclockTimer = game.variables.overclockCooldown;
    game.variables.overclocked = false;
    get("overclock-active").style.display = "none";
    get("overclock-cooldown").style.display = 'block'
    get("overclock-cooldown").innerHTML = `Cooldown: ${game.variables.overclockTimer}s`;

    let timeoutId = window.setInterval(() => {
        if (game.variables.overclockTimer === 0) {
            get("overclock-cooldown").style.display = 'none'
            get("overclock-button").disabled = false;
            game.variables.canOverclock = true;
            clearInterval(timeoutId);
            return;
        }
        game.variables.overclockTimer--;
        get("overclock-cooldown").innerHTML = `Cooldown: ${game.variables.overclockTimer}s`;
    }, 1000);
}

function gainAchievement(id) {
    if (game.achievements.unlocked[id]) return;

    const sortedId = game.achievements.sorted.achievements.findIndex(item => item === game.achievements.names[id]);
    game.divs.achievementDiv.style.display = 'block';
    get("achievement-container").style.display = "block";
    game.divs.achievementDiv.innerHTML = `Achievement Unlocked! ${game.achievements.sorted.achievements[sortedId]}`;
    if (game.achievements.descriptions[id] === "???") {
        game.achievements.descriptions[id] = game.achievements.secretAchievementDescriptions[id];
        game.achievements.buttons[sortedId].innerHTML = game.achievements.names[id] + ": " + game.achievements.descriptions[id];
    }
    window.setTimeout(() => {
        game.divs.achievementDiv.style.display = "none";
        game.divs.achievementDiv.innerHTML = "";
        get("achievement-container").style.display = "none";
    }, 4000)
    game.achievements.unlocked[id] = true;
    game.achievements.buttons[sortedId].classList.remove("achievement-locked")
    game.achievements.buttons[sortedId].classList.add("achievement-unlocked")
}

function toggleAchievements() {
    if (game.altar.altarOpen) toggleAltar()
    if (game.painting.paintingOpen) togglePainting()
    if (game.achievements.achievementsOpen) {
        game.divs.achievementButtonDiv.style.display = "none";
        game.divs.mainDiv.style.display = "block";
        get("achievement-button").innerHTML = "Achievements"
    } else {
        game.divs.achievementButtonDiv.style.display = "block";
        game.divs.mainDiv.style.display = "none";
        get("achievement-button").innerHTML = "Back"
    }
    game.achievements.achievementsOpen = !game.achievements.achievementsOpen
}

function cheaterCheck() {if (game.stats.clicksInLastSecond > 20) gainAchievement(9); game.stats.clicksInLastSecond = 0}

function saveToLocalStorage(prompt = false) {
    for (let i=0;i<localStorageItems().length;i++) localStorage[localStorageItems()[i][0]] = JSON.stringify(localStorageItems()[i][1])
    if (prompt) betterAlert("Saved your game!")
}

function loadFromLocalStorage(prompt = false) {
    for (let i=0;i<localStorageItems().length;i++) {
        let item = +localStorage.getItem(localStorageItems()[i][0]);
        const keys = localStorageItems()[i][0].split("-");
        console.log(keys)
        if (keys[0] === "achievements") {
            if (item === 1) gainAchievement(+keys[2])
            continue
        }
        if (keys.length === 2) {
            game[keys[0]][keys[1]] = item
        } else if (keys.length === 3) {
            game[keys[0]][keys[1]][keys[2]] = item
        } else if (keys.length === 4) {
            game[keys[0]][keys[1]][keys[2]][keys[3]] = item
        } else console.log("uh oh: " + keys)
    }
    if (prompt) betterAlert("Loaded your data!")
    updateAllText()
    updateShopTexts()
}

function updateShopButtons() {
    for (let i=0;i<game.shop.costs.length;i++) {
        if (game.resources.shapes < game.shop.costs[i]) {
            const btn = get("shop-"+i)
            btn.disabled = true
            btn.classList.remove("other-button")
            btn.classList.add("disabled-button")
        } else {
            const btn = get("shop-"+i)
            btn.disabled = false
            btn.classList.remove("disabled-button")
            btn.classList.add("other-button")
        }
    }
}

function updateShopTexts() {
    if (isNaN(game.shop.costs[4]) || !(isFinite(game.shop.costs[4]))) {
        game.shop.costs[4] = Infinity
        get("shop-4-cost").innerHTML = "This upgrade is maxed!"
    }
    if (isNaN(game.shop.costs[5]) || !(isFinite(game.shop.costs[5]))) {
        game.shop.costs[5] = Infinity
        get("shop-5-cost").innerHTML = "This upgrade is maxed!"
    }
}

function hardReset(prompt = true) {
    if (prompt && !(confirm("Are you sure you want to hard reset?"))) return;
    if (prompt && !(confirm("This will erase EVERYTHING! Are you really sure?"))) return;
    game = initGameObject()
    game.achievements.unlocked = new Array(game.achievements.names.length).fill(false)
    game.achievements.secretAchievementCount = game.achievements.descriptions.filter(x => x === "???").length

    saveToLocalStorage()
    updateAllText()
    updateShopButtons()
    for (let i=0;i<game.shop.costs.length;i++) {
        get(`shop-${i}-cost`).innerHTML = `Cost: ${game.shop.costs[i].toLocaleString("en-US")} shapes`;
    }
    if (prompt) {
        betterAlert("Reset your game!");
        location.reload()
    }
}

const hax = () => gainAchievement(8);
// this is here so that this function isnt unsed and webstorm doesnt cry about it
const _ = false
if (_) hax()

function exportSave() {
    writeClipboardText(btoa(JSON.stringify(game).replaceAll("Δβγξξ", "ABYSS")))
        .then(() => betterAlert("Copied save file to clipboard!"))
        .catch(() => betterAlert("Permission for writing to the clipboard was denied."))
}

function importSave() {
    navigator.clipboard.readText()
    .then((save) => {
        save = atob(save)
        save.replaceAll("ABYSS", "Δβγξξ")
        game = JSON.parse(save)
        updateAllText()
        updateShopTexts()
        betterAlert("Imported save file from clipboard!")
    })

    .catch(err => {
        // If navigator.clipboard.readText() throws a NotAllowedError: No permission or insecure
        if (err.name === "NotAllowedError") {
            betterAlert("You need to grant permission for this site to view your clipboard. If you are on Firefox, or have granted the permission already, make sure that this website is secure and not embedded in an iFrame.")
        // If navigator.clipboard.readText() throws a NotFoundError: No text on clipboard
        } else if (err.name === "NotFoundError") {
            betterAlert("Whatever is on your clipboard is not text!")
        // If JSON.parse(save) throws a SyntaxError: Not vaild base64
        } else if (err.name === "SyntaxError" || err.name === "InvalidCharacterError") {
            betterAlert("Invalid base64!")
        // If .toLocaleString() in updateShapeText() in updateAllText() thows a TypeError: Value is null or undefined or similar
        } else if (err.name === "TypeError") {
            betterAlert("Invalid save data!")
        // idek anymore help me
        } else {
            betterAlert("idk what happened but we got a " + err.name + ": " + err.message)
            console.error(err.name + ": " +err.message)
        }
    })
}

function betterAlert(text) {
    if (game.other.betterAlertInterval) window.clearTimeout(game.other.betterAlertInterval)
    get("alerts-text").innerHTML = text;
    get("alerts").style.display = "block"
    game.other.betterAlertInterval = window.setTimeout(() => {
        get("alerts").style.display = "none"
    }, 4000)
}

// deeefffinetly not taken from MDN
async function writeClipboardText(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (error) {
        console.error(error.message);
    }
}

/*
SAVE SYSTEM WORK IN PROGRESS

bro what is this, why am I not using localStorage
now i am :)

Infinite (1.79e308) shapes code:

eyJzdGF0cyI6eyJ0b3RhbENsaWNrcyI6MCwidG90YWxTaGFwZXMiOjAsInRvdGFsR2lsZGVkU2hhcGVzIjowLCJ0b3RhbFByZXN0aWdlIjowLCJvdmVyY2xvY2tDb3VudCI6MCwic3RhdHNPcGVuIjpmYWxzZSwiaGVscE9wZW4iOmZhbHNlLCJjbGlja3NJbkxhc3RTZWNvbmQiOjB9LCJyZXNvdXJjZXMiOnsic2hhcGVzIjoxLjc
4ZSszMDgsImdpbGRlZFNoYXBlcyI6MCwiYXN0cmFsU2hhcGVzIjowLCJwYWludGVkU2hhcGVzIjp7InQxIjpbMCwwLDBdLCJ0MiI6WzAsMCwwXSwiZ29sZGVuIjowfX0sInZhcmlhYmxlcyI6eyJzaGFwZXNQZXJDbGljayI6MSwidGlja3NQZXJDbGljayI6MSwiZWZmaWNpZW5jeSI6MCwib3ZlcmNsb2NrZWQiOmZhbHNlLCJvdm
VyY2xvY2tCb29zdCI6MS4yLCJjYW5PdmVyY2xvY2siOnRydWUsIm92ZXJjbG9ja1RpbWVyIjowLCJwYWludGVkU2hhcGVzQm9vc3QiOjEwMCwib3ZlcmNsb2NrQ29vbGRvd24iOjQwfSwicHJlc3RpZ2UiOnsicHJlc3RpZ2VNaW4iOjEwMDAwLCJwcmVzdGlnZUluY3JlbWVudCI6MTAsImdpbGRlZFNoYXBlc0Jvb3N0UGVyY2Vud
CI6MTAwLCJnaWxkZWRTaGFwZXNHYWluUGVyY2VudCI6MTAwLCJhc3RyYWxTaGFwZXNPblByZXN0aWdlUGVyY2VudCI6MH0sInNob3AiOnsiY29zdHMiOlsxMCwxMDAsMTUwMCwxMDAwMDAsMjUwMDAwMDAsMTAwMDAwMDAwMF0sImNvc3RJbmNyZWFzZUZ1bmNzIjpbbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGxdLCJsZXZl
bHMiOlswLDAsMCwwLDAsMF19LCJhbHRhciI6eyJhbHRhck9wZW4iOmZhbHNlLCJhbHRhclVubG9ja2VkIjpudWxsLCJhbHRhckRpdiI6e30sImFsdGFyQ3VycmVuY2llc0RpdiI6e30sImFzdHJhbFNoYXBlc0F2YWlsYWJsZSI6MCwiYXN0cmFsU2hhcGVzQWxsb2NhdGVkIjpbMCwwLDAsMF0sInRvdGFsQXN0cmFsQWxsb2NhdGV
kIjowLCJzcGVsbHMiOlsiR29sZGVuIFJpdHVhbCIsIkdpZnRlZCBSZWJpcnRoIiwiQXN0cmFsIFByZXN0aWdlIiwiQ29zbWljIENvbG91cnMiXX0sInBhaW50aW5nIjp7InBhaW50aW5nT3BlbiI6ZmFsc2UsInBhaW50aW5nVW5sb2NrZWQiOm51bGwsInRpZXJDb3N0cyI6WzEwMDAwMCwxMF19LCJhY2hpZXZlbWVudHMiOnsibm
FtZXMiOlsiSXQgaGFzIHRvIHN0YXJ0IHNvbWV3aGVyZSIsIk1vc3QgZ2VuZXJpYyBpZGxlIGdhbWUgbWVjaGFuaWMiLCJCdXR0b25zIGFyZSB2ZXJ5IHVzZWZ1bCB0aGluZ3MiLCJXZWxsLCB0aGFuayB5b3UgdmVyeSBtdWNoIiwiVGlueSBsaXR0bGUgdGhpbmcgOikiLCJPVkVSIG92ZXJjbG9ja2VkIiwiQ2FuJ3QgY291bnQgd
GhhdCBoaWdoIiwiQUJZU1MiLCIwMTAwMTAwMCAwMDExMDEwMCAwMTAxMTAwMCAwMTAxMTAwMCAwMDExMDAwMCAwMTAxMDAxMCIsIllvdSBDSEVBVEVSIiwiVGhlIG9ibGlnYXRvcnkgU1VTIGFjaGlldmVtZW50IiwiSW5mbGF0aW9uIiwiPHNwYW4gc3R5bGU9J2ZvbnQtc2l6ZTo0cHgnPlRob3VnaCBpdCBtdXN0IGJlIHByZWZh
Y2VkIHRoYXQgRS5HLk8gZ2VhcnMgYXJlIHN0YW5kYXJkaXplZCBlcXVpcG1lbnQsIHdoZW4ganV4dGFwb3NlZCB3aXRoIEUuRy5PIGdlYXIgZnJvbSBMIENvcnAuLCBkZXBlbmRpbmcgb24gdGhlIGRlZ3JlZSBvZiBhdHR1bmVtZW50IHRvIHRoZSBBYm5vcm1hbGl0eSwgdGhlIGlkaW9zeW5jcmFzaWVzIG9mIHRoZSBzb3VyY2U
gbWF5IGJlIHV0aWxpemVkIHdpdGggZ3JlYXRlciBmbGV4aWJpbGl0eS4gWWV0LCB0aGUgZGVncmVlIHRvIHdoaWNoIHRoYXQgYXR0dW5lbWVudCBhbmQgc3luY2hyb25pemF0aW9uIGFyZSBhY2hpZXZlZCBtYXkgcmVzdWx0YW50bHkgYWxsb3cgdGhlIHVzZXIgdG8gYmUgZGV2b3VyZWQuIFRoaXMgaXMgcmVmbGVjdGVkIGluIH
RoZWlyIGFwcGVhcmFuY2UsIG1vcmUgY2xvc2VseSByZXNlbWJsaW5nIHRoZSBzb3VyY2UgQWJub3JtYWxpdHkgdGhhbiBFLkcuTyBvZiB0aGUgZm9ybWVyIEwgQ29ycC4gZG8uIEUuRy5PIGRpc2ludGVncmF0aW9uIGlzIG5vdCB1bmxpa2UgZGVjb21wb3NpdGlvbiBvZiBjb21wb3N0PC9zcGFuPiJdLCJkZXNjcmlwdGlvbnMiO
lsiR2FpbiAxMDAgc2hhcGVzLiIsIlByZXN0aWdlIGZvciB0aGUgZmlyc3QgdGltZS4iLCI/Pz8iLCI/Pz8iLCI/Pz8iLCJPdmVyY2xvY2sgMjUgdGltZXMuIiwiSGF2ZSBvdmVyIDEwIEdpbGRlZCBTaGFwZXMgYWZ0ZXIgeW91IHByZXN0aWdlIG9uY2UuIiwiVW5sb2NrIHRoZSBBbHRhci4iLCI/Pz8iLCI/Pz8iLCI/Pz8iLCJS
ZWFjaCBeMiBvdmVyY2xvY2sgYm9vc3QuIiwiPz8/Il0sInNlY3JldEFjaGlldmVtZW50RGVzY3JpcHRpb25zIjpbbnVsbCxudWxsLCJQcmVzcyBhbiBhY2hpZXZlbWVudCBidXR0b24uIiwiQ2xpY2sgb24gYW55IG9mIG15IGxpbmtzLiIsIlRpbnkgbGl0dGxlIGhhbXN0ZXIgOikiLG51bGwsbnVsbCxudWxsLCJFeGVjdXRlIHR
oZSBmdW5jdGlvbiBoYXgoKSBmcm9tIHRoZSBjb25zb2xlLiIsIllvdSB1c2VkIGFuIGF1dG9jbGlja2VyLiAoRWl0aGVyIHRoYXQsIG9yIHlvdSBjbGlja2VkIHJlYWxseSBmYXN0KSIsIkhhdmUgZXhhY3RseSA2OSBvciA0MjAgc2hhcGVzLiBIYSBoYS4iLG51bGwsIkNsaWNrIGEgbGl0dGxlIGxpbmsgaW4gdGhlIGhlbHAgdG
V4dC4gVGhlIHNtYWxsIHRleHQgaXMgcG9zc2libHkgYSByZWZlcmVuY2UuIl0sImJ1dHRvbnMiOlt7fSx7fSx7fSx7fSx7fSx7fSx7fSx7fSx7fSx7fSx7fSx7fSx7fV0sImFjaGlldmVtZW50c09wZW4iOmZhbHNlLCJzb3J0ZWQiOnsiYWNoaWV2ZW1lbnRzIjpbIkl0IGhhcyB0byBzdGFydCBzb21ld2hlcmUiLCJNb3N0IGdlb
mVyaWMgaWRsZSBnYW1lIG1lY2hhbmljIiwiT1ZFUiBvdmVyY2xvY2tlZCIsIkNhbid0IGNvdW50IHRoYXQgaGlnaCIsIkFCWVNTIiwiSW5mbGF0aW9uIiwiQnV0dG9ucyBhcmUgdmVyeSB1c2VmdWwgdGhpbmdzIiwiV2VsbCwgdGhhbmsgeW91IHZlcnkgbXVjaCIsIlRpbnkgbGl0dGxlIHRoaW5nIDopIiwiMDEwMDEwMDAgMDAx
MTAxMDAgMDEwMTEwMDAgMDEwMTEwMDAgMDAxMTAwMDAgMDEwMTAwMTAiLCJZb3UgQ0hFQVRFUiIsIlRoZSBvYmxpZ2F0b3J5IFNVUyBhY2hpZXZlbWVudCIsIjxzcGFuIHN0eWxlPSdmb250LXNpemU6NHB4Jz5UaG91Z2ggaXQgbXVzdCBiZSBwcmVmYWNlZCB0aGF0IEUuRy5PIGdlYXJzIGFyZSBzdGFuZGFyZGl6ZWQgZXF1aXB
tZW50LCB3aGVuIGp1eHRhcG9zZWQgd2l0aCBFLkcuTyBnZWFyIGZyb20gTCBDb3JwLiwgZGVwZW5kaW5nIG9uIHRoZSBkZWdyZWUgb2YgYXR0dW5lbWVudCB0byB0aGUgQWJub3JtYWxpdHksIHRoZSBpZGlvc3luY3Jhc2llcyBvZiB0aGUgc291cmNlIG1heSBiZSB1dGlsaXplZCB3aXRoIGdyZWF0ZXIgZmxleGliaWxpdHkuIF
lldCwgdGhlIGRlZ3JlZSB0byB3aGljaCB0aGF0IGF0dHVuZW1lbnQgYW5kIHN5bmNocm9uaXphdGlvbiBhcmUgYWNoaWV2ZWQgbWF5IHJlc3VsdGFudGx5IGFsbG93IHRoZSB1c2VyIHRvIGJlIGRldm91cmVkLiBUaGlzIGlzIHJlZmxlY3RlZCBpbiB0aGVpciBhcHBlYXJhbmNlLCBtb3JlIGNsb3NlbHkgcmVzZW1ibGluZyB0a
GUgc291cmNlIEFibm9ybWFsaXR5IHRoYW4gRS5HLk8gb2YgdGhlIGZvcm1lciBMIENvcnAuIGRvLiBFLkcuTyBkaXNpbnRlZ3JhdGlvbiBpcyBub3QgdW5saWtlIGRlY29tcG9zaXRpb24gb2YgY29tcG9zdDwvc3Bhbj4iXSwiZGVzY3JpcHRpb25zIjpbIkdhaW4gMTAwIHNoYXBlcy4iLCJQcmVzdGlnZSBmb3IgdGhlIGZpcnN0
IHRpbWUuIiwiT3ZlcmNsb2NrIDI1IHRpbWVzLiIsIkhhdmUgb3ZlciAxMCBHaWxkZWQgU2hhcGVzIGFmdGVyIHlvdSBwcmVzdGlnZSBvbmNlLiIsIlVubG9jayB0aGUgQWx0YXIuIiwiUmVhY2ggXjIgb3ZlcmNsb2NrIGJvb3N0LiIsIj8/PyIsIj8/PyIsIj8/PyIsIj8/PyIsIj8/PyIsIj8/PyIsIj8/PyJdfSwidW5sb2NrZWQ
iOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV0sInNlY3JldEFjaGlldmVtZW50Q291bnQiOjd9LCJkaXZzIjp7Im1haW5EaXYiOnt9LCJhbHRhckRpdiI6e30sInBhaW50aW5nRGl2Ijp7fSwiYWNoaWV2ZW1lbnREaXYiOnt9LCJhY2
hpZXZlbWVudEJ1dHRvbkRpdiI6e30sInNldHRpbmdzRGl2Ijp7fX0sInNldHRpbmdzIjp7InNldHRpbmdzT3BlbiI6dHJ1ZSwiYXV0b3NhdmUiOnRydWV9LCJvdGhlciI6eyJiZXR0ZXJBbGVydEludGVydmFsIjoyM319

function exportSave() {
    let save = `${game.stats.totalClicks};_00a;${game.stats.totalShapes};${game.stats.totalGildedShapes};${game.stats.totalGildedShapes-7};${game.stats.totalPrestige};${game.resources.shapes};${game.resources.shapes+game.stats.totalPrestige}`
    console.log(save);
}

function importSave() {
    const save = prompt("Enter save code")
    let saveItems = save.split(";")
    if (saveItems[1] !== "_00a" || +saveItems[4] !== +saveItems[3]-7 || +saveItems[7] !== +saveItems[6]+ +saveItems[5]) {
        alert("Invalid")
        return;
    }
    delete saveItems[1]
    delete saveItems[4]
    delete saveItems[7]
}
*/