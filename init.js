let game = {
    stats: {
        totalClicks: 0,
        totalShapes: 0,
        totalGildedShapes: 0,
        totalPrestige: 0,
        statsOpen: false,
        helpOpen: false,
    },
    resources: {
        shapes: 0,
        gildedShapes: 0,
        astralShapes: 0,
        paintedShapes: {
            t1: [0,0,0],
            golden: 0,
        },
    },
    variables: {
        shapesPerClick: 1,
        ticksPerClick: 1,
        efficiency: 0,
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
        isExpensiveCost: [false, true, false, undefined, undefined, undefined],
        costIncrease: 2,
        costIncreaseExpensive: 3,
    },
    altar: {
        altarOpen: false,
        altarUnlocked: false,
        altarDiv: document.getElementById('altar'),
        astralShapesAvailable: 0,
        astralShapesAllocated: [0, 0, 0],
        totalAstralAllocated: 0,
        spells: ["Golden Ritual", "Gifted Rebirth", "Astral Prestige"],
    },
    painting: {
        paintingOpen: false,
        paintingUnlocked: false,
        tierCosts: [100_000],
    },
    divs: {
        mainDiv: document.getElementById("main-game"),
        altarDiv: document.getElementById("altar"),
        paintingDiv: document.getElementById("paint"),
    }
}
const gameReset = Object.assign({}, game);
const convertBoolToString = (bool) => {
    if (bool) return "Yes"
    return "No"
}
game.divs.altarDiv.style.display = 'none';
game.divs.paintingDiv.style.display = 'none';
game.divs.mainDiv.style.display = 'block';

function increaseShapes() {
    let increment = Math.round(game.variables.shapesPerClick * game.variables.ticksPerClick * (1 + game.variables.efficiency));
    increment += Math.round(game.resources.gildedShapes * (game.prestige.gildedShapesBoostPercent / 100) * (game.variables.shapesPerClick / 2));

    if (game.stats.statsOpen) updateStatsText();

    game.resources.shapes += increment
    game.stats.totalClicks++;
    game.stats.totalShapes += increment;
    updateShapeText();
}

function updateShapeText() {
    document.getElementById("shapes-text").innerHTML = `Shapes: ${game.resources.shapes.toLocaleString("en-US")}`;
    document.getElementById("gilded-shapes-text").innerHTML = `Gilded Shapes: ${game.resources.gildedShapes.toLocaleString("en-US")}`;

    if (game.altar.altarOpen) {
        document.getElementById("astral-shapes-text").innerHTML = `Astral Shapes: ${game.resources.astralShapes.toLocaleString("en-US")}`;
        document.getElementById("astral-shapes-available-text").innerHTML = `Astral Shapes Available: ${game.altar.astralShapesAvailable.toLocaleString("en-US")}`;
    }
}

function updateAllText() {
    updateShapeText();
    updateStatsText();
    document.getElementById("prestige-button").innerHTML = `Prestige (requires ${game.prestige.prestigeMin.toLocaleString("en-US")} shapes)`
}

function updateStatsText() {
    document.getElementById("stats-text").innerHTML = `
        Total Clicks: ${game.stats.totalClicks.toLocaleString("en-US")}<br>
        Total Shapes: ${game.stats.totalShapes.toLocaleString("en-US")}<br>
        Total Gilded Shapes ${game.stats.totalGildedShapes.toLocaleString("en-US")}<br>
        Total Prestiges: ${game.stats.totalPrestige.toLocaleString("en-US")}<br>
        Shapes per Click: ${game.variables.shapesPerClick.toLocaleString("en-US")}<br>
        Ticks per Click: ${game.variables.ticksPerClick.toLocaleString("en-US")}<br>
        Efficiency: ${game.variables.efficiency.toLocaleString("en-US")}<br><br>

        Is altar unlocked? ${convertBoolToString(game.altar.altarUnlocked)}<br>
        Astral Shapes allocated: ${game.altar.totalAstralAllocated.toLocaleString("en-US")}<br>
        Astral Shapes available: ${game.altar.astralShapesAvailable.toLocaleString("en-US")}<br>`
}

function buyShopItem(item) {
    if (game.resources.shapes < game.shop.costs[item]) return;

    game.resources.shapes -= game.shop.costs[item];
    if (!(game.shop.isExpensiveCost[item] ?? false)) game.shop.costs[item] *= game.shop.costIncrease
    else game.shop.costs[item] *= game.shop.costIncreaseExpensive

    document.getElementById(`shop-${item}-cost`).innerHTML = `Cost: ${game.shop.costs[item].toLocaleString("en-US")} shapes`;

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
    }
    updateShapeText();
}

function prestige() {
    if (game.resources.shapes < game.prestige.prestigeMin) {
        alert(`You need at least ${game.prestige.prestigeMin.toLocaleString("en-US")} shapes to prestige.`)
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
        document.getElementById("painting-button").innerHTML = "Painting";
    }

    document.getElementById("prestige-button").innerHTML = `Prestige (requires ${game.prestige.prestigeMin.toLocaleString("en-US")} shapes)`;
    updateShapeText();
}

function toggleStats() {
    if (game.stats.statsOpen) {
        document.getElementById("stats-text").innerHTML = "";
    } else updateStatsText();
    game.stats.statsOpen = !game.stats.statsOpen;
}

function toggleHelp() {
    if (game.stats.helpOpen) {
        document.getElementById("help-text").innerHTML = "";
    } else {
        document.getElementById("help-text").innerHTML = `
        To get shapes, press the "generate shapes" button.<br>
        Once you have 10 shapes, you can increase the amount of shapes per click by 1.<br>
        This will remove 10 shapes, and the cost of buying it again will double.<br><br>
        
        Efficiency increases your shape gain by 1 for each point you have.<br>
        Ticks increase your shape gain by increasing the amount of times that your shapes are calculated per click.<br><br>
        
        Once you reach 10,000 shapes, you may gain prestige and gain Gilded Shapes based on the amount of shapes you have. (Formula: log10(shapes) - 4)<br>
        Each Gilded Shape gives you 50% of your shapes per click.<br><br>
        
        After reaching 10 Gilded Shapes, the Altar is unlocked. There, you may convert Gilded Shapes into Astral Shapes, and allocate them to Spells.<br>
        Spells have various insanely positive effects based on the amount of Astral Shapes that are allocated to it.<br>
        `
    }
    game.stats.helpOpen = !game.stats.helpOpen;
}

function toggleAltar() {
    if (game.resources.gildedShapes >= 10) game.altar.altarUnlocked = true;
    if (!(game.altar.altarUnlocked)) {
        document.getElementById("altar-button").innerHTML = "Altar (requires 10 Gilded Shapes)";
        alert("You need 10 Gilded Shapes to access the Altar!");
        return;
    }

    document.getElementById("altar-button").innerHTML = "Altar"
    if (game.altar.altarOpen) {
        game.altar.altarDiv.style.display = 'none';
        game.divs.mainDiv.style.display = 'block';
        document.body.style.backgroundColor = '#1b1e23';
    } else {
        game.altar.altarDiv.style.display = 'block';
        game.divs.mainDiv.style.display = 'none';
        document.body.style.backgroundColor = '#25003a';
    }
    game.altar.altarOpen = !game.altar.altarOpen;
    game.painting.paintingOpen = false;
}

function convertShapes(type) {
    let amount = +prompt("How many shapes to convert?")
    if (!(typeof amount === "number")) return;

    if (type === "astral") {
        if (game.resources.astralShapes < amount) {
            alert("Not enough Astral Shapes!")
            return;
        } else {
            game.resources.astralShapes -= amount;
            game.altar.astralShapesAvailable -= amount;
            game.resources.gildedShapes += amount;
        }
    } else if (type === "gilded") {
        if (game.resources.gildedShapes < amount) {
            alert("Not enough Gilded Shapes!")
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
    if (!(typeof amount === "number") || amount === 0) return;

    game.altar.totalAstralAllocated = 0;
    for (let i of game.altar.astralShapesAllocated) {
        game.altar.totalAstralAllocated += i;
    }
    game.altar.astralShapesAvailable = game.resources.astralShapes - game.altar.totalAstralAllocated;

    if (amount > game.altar.astralShapesAvailable) {
        alert("Not enough Astral Shapes available!")
        return;
    }
    game.altar.astralShapesAllocated[spell] += amount;
    game.altar.astralShapesAvailable -= amount;

    switch (spell) {
        case 0:
            game.prestige.gildedShapesBoostPercent = amount * 5 + 100;
            break;
        case 1:
            game.prestige.gildedShapesGainPercent = amount * 3 + 100;
            break;
        case 2:
            game.prestige.astralShapesOnPrestigePercent = amount * 2;
            break;
    }
    alert(`Allocated ${amount} Astral Shapes to spell ${spellName}!`);
    updateShapeText();
}

function togglePainting() {
    if (game.stats.totalPrestige >= 5) game.painting.paintingUnlocked = true;
    if (!(game.painting.paintingUnlocked)) {
        alert("You need 5 total prestige to access Painting.")
        return;
    }

    document.getElementById("painting-button").innerHTML = "Painting";
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
    if (game.resources.shapes < game.painting.tierCosts[tier]) {
        alert(`To paint shapes of tier ${tier + 1}, you need ${game.painting.tierCosts[tier].toLocaleString("en-US")} shapes!`);
        return;
    }
    game.resources.shapes -= game.painting.tierCosts[tier];
    let rng = +((Math.random() * 100).toFixed(2));
    switch (tier) {
        case 0:
            if (rng > 99) {
                game.resources.paintedShapes.golden++;
                alert("WOW! +1 Golden Shape!")
            }
            else if (rng > 66) {
                game.resources.paintedShapes.t1[2]++;
                alert("+1 Yellow Shape!")
            }
            else if (rng > 33) {
                game.resources.paintedShapes.t1[1]++;
                alert("+1 Blue Shape!")
            }
            else {
                game.resources.paintedShapes.t1[0]++;
                alert("+1 Red Shape!")
            }
            break;
    }
}

function hardReset() {
    if (!(confirm("Are you sure you want to hard reset?"))) return;
    if (!(confirm("This will erase EVERYTHING! Are you really sure?"))) return;
    // add code sometime
    alert("Reset your game!");
}

// SAVE SYSTEM WORK IN PROGRESS
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