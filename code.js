const regexEscape = str => str.replace('(', '\\(').replace(')', '\\)').replace('.', '\\.');
const splitOnIndex = (str, index) => [
    str.substring(0, index),
    str.substring(index, str.length)
]
const getQueryRegex = query => new RegExp(`${regexEscape(query)}\\s*?{`);
const firstIndexOfQuery = (rawCss, query) => rawCss.search(getQueryRegex(query));
const splitOnceOnQuery = (rawCss, query) => firstIndexOfQuery(rawCss, query) === -1
    ? [rawCss, '']
    : splitOnIndex(rawCss, firstIndexOfQuery(rawCss, query));
const getIndexOfClosingBracket = rawCss => {
    let toMatch = 0;
    for(let i = 0; i < rawCss.length; i++) {
        if(rawCss[i] === '{') toMatch += 1;
        if(rawCss[i] === '}') {
            toMatch -= 1; 
            if(toMatch === 0) return i;
        }
    }
    return false;
}

const wheatFromChaff = (unsorted, wheat, chaff, query) => {
    const split = splitOnceOnQuery(unsorted, query);
    chaff += '\n' + split[0].trim();
    wheat += '\n' + split[1].substring(
        split[1].search('{') + 1, 
        getIndexOfClosingBracket(split[1])
    ).trim();
    unsorted = split[1].substring(
        getIndexOfClosingBracket(split[1]) + 1,
        split[1].length
    ).trim();
    if(unsorted.trim().length === 0) {
        return {wheat: wheat.trim(), chaff: chaff.trim()};
    } else {
        return wheatFromChaff(unsorted, wheat, chaff, query);
    }
}

window.onload = () => {
    document.getElementById('strip-form').addEventListener('submit', e => {
        e.preventDefault();
        const rawCss = document.getElementById('css-input').value;
        const query = document.getElementById('query').value;
        const {wheat, chaff} = wheatFromChaff(rawCss, '', '', query);
        document.getElementById('css-output-wheat').value = wheat;
        document.getElementById('css-output-chaff').value = chaff;
    })
}