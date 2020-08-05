export function getCardFromId(cardList, id) {
    let result = cardList.find(card => card.id === id);
    return result;
}