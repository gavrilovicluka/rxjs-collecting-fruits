const fruits_url = [
    "../assets/images/apple.png",
    "../assets/images/banana.png",
    "../assets/images/pear.png",
]

export function returnRandomFruitUrl() {
    const randomNumber = Math.floor(Math.random() * fruits_url.length);
    return fruits_url[randomNumber];
}