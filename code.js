/********************************************************************\
 * Breakpoint Cleaner 🧹                                             
 *                                                                   
 * The most function-y code ever, for fun.         
 *                 
 * This was written pretty quickly and I didn't want to bother with a
 * CSS parser so don't toss malformed CSS at it and double-check the 
 * results.
 \*******************************************************************/

// Escape all reserved characters for regex conversion:
const regexEscape = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Split string on provided index into arr[2]:
const splitOnIndex = (str, index) => [
    str.substring(0, index),
    str.substring(index, str.length)
]
// Create regex from provided @media query:
const getQueryRegex = query => new RegExp(`${regexEscape(query)}\\s*?{`);
// Find first index of provided @media query:
const firstIndexOfQuery = (rawCss, query) => rawCss.search(getQueryRegex(query));
// Split CSS on query if found, return arr[cleaned, responsive]:
const splitOnceOnQuery = (rawCss, query) => firstIndexOfQuery(rawCss, query) === -1
    ? [rawCss, '']
    : splitOnIndex(rawCss, firstIndexOfQuery(rawCss, query));
// Search through unsorted CSS for next closing bracket:
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
// Finally, use all the above to seperate responsive styles from raw CSS:
const wheatFromChaff = (unsorted, wheat, chaff, query) => {
    // Split raw CSS on query:
    const split = splitOnceOnQuery(unsorted, query);
    // split[0] holds pre-query CSS:
    chaff += '\n' + split[0].trim();
    // Responsive styles are found from first { to the matching }:
    wheat += '\n' + split[1].substring(
        split[1].search('{') + 1, 
        getIndexOfClosingBracket(split[1])
    ).trim();
    // Everything else goes to unsorted:
    unsorted = split[1].substring(
        getIndexOfClosingBracket(split[1]) + 1,
        split[1].length
    ).trim();
    // If nothing's left in unsorted:
    if(unsorted.trim().length === 0) {
        // Return the results as an object:
        return {wheat: wheat.trim(), chaff: chaff.trim()};
    // If raw CSS remains:
    } else {
        // Recurse:
        return wheatFromChaff(unsorted, wheat, chaff, query);
    }
}

// Let's see it in action:
window.onload = () => {
    document.getElementById('strip-form').addEventListener('submit', e => {
        e.preventDefault();
        // Get input values:
        const rawCss = document.getElementById('css-input').value;
        const query = document.getElementById('query').value;
        // Sort CSS:
        const {wheat, chaff} = wheatFromChaff(rawCss, '', '', query);
        // Display results:
        document.getElementById('css-output-wheat').value = wheat;
        document.getElementById('css-output-chaff').value = chaff;
    })
}