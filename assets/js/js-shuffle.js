/*
 * Shuffle function taken from  
 * jsfiddle.net/uze8e2ro/
 *
 */

 var shuffle = (all, one, i, orig) => {
    if (i !== 1) return all;
    for (let i = orig.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [orig[i - 1], orig[j]] = [orig[j], orig[i - 1]];
    }
    return orig;
}