const winrateFunction = (wins, losses, dec) => {

    if (wins == 0 && losses == 0) return "???"

    return ((wins*100)/(wins + losses)).toFixed(dec ? dec : 2)
}

const kdaFunction = (kills, assists, deaths, dec) => {

    if (kills == 0 && assists == 0 && deaths == 0) return "???"
    return ((kills + (assists/2))/deaths).toFixed(dec ? dec : 2)
}

const championReplaces = () => {
    return {
        "andro": "androxus",
        "andy": "androxus",
        "ach": "ash",
        "asaan": "azaan",
        "azan": "azaan",
        "asan": "azaan",
        "baric": "barik",
        "dwarf": "barik",
        "betty": "betty la bomba",
        "bety": "betty la bomba",
        "betti": "betty la bomba",
        "beti": "betty la bomba",
        "vetti": "betty la bomba",
        "caspa": "caspian",
        "bk": "bomb king",
        "bomb": "bomb king",
        "buk": "buck",
        "buc": "buck",
        "kaspian": "caspian",
        "casie": "cassie",
        "cassi": "cassie",
        "casi": "cassie",
        "cass": "cassie",
        "corv": "corvus",
        "corbus": "corvus",
        "drog": "drogoz",
        "dragon": "drogoz",
        "ice": "evie",
        "nando": "fernando",
        "orc": "grohk",
        "grok": "grohk",
        "gurk": "grohk",
        "tree": "grover",
        "grober": "grover",
        "arbol": "grover",
        "nara": "inara",
        "fox": "io",
        "op": "kasumi",
        "kas": "kasumi",
        "kan": "khan",
        "can": "khan",
        "nessa": "kinessa",
        "coga": "koga",
        "law": "lex",
        "lillit": "lillith",
        "lilith": "lillith",
        "lilit": "lillith",
        "mif": "maeve",
        "meif": "maeve",
        "meve": "maeve",
        "maev": "maeve",
        "milf": "maeve",
        "meef": "maeve",
        "koa": "makoa",
        "turtle": "makoa",
        "damba": "mal'damba",
        "mal": "mal'damba",
        "cow": "raum",
        "goblin": "ruckus",
        "rucus": "ruckus",
        "rukus": "ruckus",
        "ruck": "ruckus",
        "sati": "saati",
        "sha": "sha lin",
        "owl": "strix",
        "term": "terminus",
        "tiger": "tiberius",
        "tibe": "tiberius",
        "torv": "torvald",
        "batu": "vatu",
        "7": "vii",
        "vik": "viktor",
        "vic": "viktor",
        "viv": "vivian",
        "bora": "vora",
        "wilo": "willo",
        "yago": "yagorath",
        "zin": "zhin",
        "zin": "zhin",
        "androxus": "androxus",
        "ash": "ash",
        "atlas": "atlas",
        "azaan": "azaan",
        "barik": "barik",
        "betty la bomba": "betty la bomba",
        "bomb king": "bomb king",
        "buck": "buck",
        "caspian": "caspian",
        "cassie": "cassie",
        "corvus": "corvus",
        "dredge": "dredge",
        "drogoz": "drogoz",
        "evie": "evie",
        "fernando": "fernando",
        "furia": "furia",
        "grohk": "grohk",
        "grover": "grover",
        "imani": "imani",
        "inara": "inara",
        "io": "io",
        "jenos": "jenos",
        "kasumi": "kasumi",
        "khan": "khan",
        "kinessa": "kinessa",
        "koga": "koga",
        "lex": "lex",
        "lian": "lian",
        "lillith": "lillith",
        "maeve": "maeve",
        "makoa": "makoa",
        "mal'damba": "mal'damba",
        "moji": "moji",
        "octavia": "octavia",
        "pip": "pip",
        "raum": "raum",
        "rei": "rei",
        "ruckus": "ruckus",
        "saati": "saati",
        "seris": "seris",
        "sha lin": "sha lin",
        "skye": "skye",
        "strix": "strix",
        "talus": "talus",
        "terminus": "terminus",
        "tiberius": "tiberius",
        "torvald": "torvald",
        "tyra": "tyra",
        "vatu": "vatu",
        "vii": "vii",
        "viktor": "viktor",
        "vivian": "vivian",
        "vora": "vora",
        "willo": "willo",
        "yagorath": "yagorath",
        "ying": "ying",
        "zhin": "zhin"
    }
}

module.exports = {winrateFunction, kdaFunction, championReplaces}