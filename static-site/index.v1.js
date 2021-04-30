(async() => {
    const api = 'https://9bjqsbak0m.execute-api.eu-west-2.amazonaws.com/prod';
    const response = await fetch(`${api}/swaps/tz1VgpmwW66LCbskjudK54Zp96vKn2cHjpGN`);
    const swaps = await response.json();
    const priceDivs = document.getElementsByClassName('xtz');
    for(const priceDiv of priceDivs) {
        const [_, objkt] = priceDiv.id.split('-');
        const value = objkt in swaps ? swaps[objkt] : null;
        priceDiv.innerText = value ? (value?.[0].xtz * 0.000001) + 'xtz' : 'SOLD';
    }
})();
